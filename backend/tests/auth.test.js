const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, comparePassword, createToken, verifyToken } = require('../src/auth');

test('password hashing and comparison works', async () => {
  const hash = await hashPassword('secret123');
  assert.notEqual(hash, 'secret123');
  assert.equal(await comparePassword('secret123', hash), true);
  assert.equal(await comparePassword('wrong', hash), false);
});

test('token round-trip works', async () => {
  const token = createToken({ user_id: 1, username: 'demo', role: 'ADMIN' });
  const decoded = verifyToken(token);
  assert.equal(decoded.username, 'demo');
  assert.equal(decoded.role, 'ADMIN');
});
