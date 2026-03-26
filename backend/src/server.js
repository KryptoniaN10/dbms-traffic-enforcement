const express = require('express');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const pool = require('./db');
const { hashPassword, comparePassword, createToken } = require('./auth');
const { requireAuth } = require('./middleware');
const resources = require('./resources');

const app = express();
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

app.get('/health', apiLimiter, async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password, role = 'CLERK' } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role',
      [username, passwordHash, role],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const result = await pool.query('SELECT user_id, username, password, role FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken({ user_id: user.user_id, username: user.username, role: user.role });
    return res.json({ token, user: { user_id: user.user_id, username: user.username, role: user.role } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use('/api', requireAuth);

app.get('/api/stats', async (req, res) => {
  try {
    const violationsResult = await pool.query('SELECT COUNT(*) FROM violation');
    const unpaidResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM fine WHERE fine_id NOT IN (SELECT fine_id FROM payment)');
    const blacklistResult = await pool.query('SELECT COUNT(*) FROM blacklist');
    const suspendedResult = await pool.query('SELECT COUNT(*) FROM owner WHERE license_status = $1', ['SUSPENDED']);
    
    return res.json({
      total_violations: parseInt(violationsResult.rows[0].count, 10),
      unpaid_fines: parseFloat(unpaidResult.rows[0].total),
      blacklisted_vehicles: parseInt(blacklistResult.rows[0].count, 10),
      suspended_licenses: parseInt(suspendedResult.rows[0].count, 10)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/:resource', async (req, res) => {
  const config = resources[req.params.resource];
  if (!config) {
    return res.status(404).json({ error: 'Unknown resource' });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${config.table} ORDER BY ${config.id} DESC`);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/:resource/:id', async (req, res) => {
  const config = resources[req.params.resource];
  if (!config) {
    return res.status(404).json({ error: 'Unknown resource' });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${config.table} WHERE ${config.id} = $1`, [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/:resource', async (req, res) => {
  const config = resources[req.params.resource];
  if (!config) {
    return res.status(404).json({ error: 'Unknown resource' });
  }

  const payload = req.body || {};
  
  // SECURE: Automatically assign the submitting user as the officer
  if (req.params.resource === 'violations' && req.user) {
    // Note: Assuming `req.user.user_id` corresponds to the `officer_id` in a 1:1 scheme,
    // or just inject it so the frontend doesn't need to specify it.
    payload.officer_id = req.user.user_id;
  }

  const keys = config.fields.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));

  if (!keys.length) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const values = keys.map((key) => payload[key]);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

  try {
    const result = await pool.query(
      `INSERT INTO ${config.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put('/api/:resource/:id', async (req, res) => {
  const config = resources[req.params.resource];
  if (!config) {
    return res.status(404).json({ error: 'Unknown resource' });
  }

  const payload = req.body || {};
  const keys = config.fields.filter((field) => Object.prototype.hasOwnProperty.call(payload, field));

  if (!keys.length) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const values = keys.map((key) => payload[key]);
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  try {
    const result = await pool.query(
      `UPDATE ${config.table} SET ${setClause} WHERE ${config.id} = $${keys.length + 1} RETURNING *`,
      [...values, req.params.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/api/:resource/:id', async (req, res) => {
  const config = resources[req.params.resource];
  if (!config) {
    return res.status(404).json({ error: 'Unknown resource' });
  }

  try {
    const result = await pool.query(`DELETE FROM ${config.table} WHERE ${config.id} = $1 RETURNING *`, [req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.json({ deleted: true, row: result.rows[0] });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = app;
