const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, 'secret', { expiresIn: '1h' });
}

module.exports = generateToken;
