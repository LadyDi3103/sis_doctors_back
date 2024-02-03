const jwt = require('jsonwebtoken');

function createToken(data) {
  return jwt.sign(data, 'secretya');
}

module.exports = createToken;
