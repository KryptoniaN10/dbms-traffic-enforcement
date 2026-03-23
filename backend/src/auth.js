const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function createToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
};
