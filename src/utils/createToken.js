const jwt = require('jsonwebtoken');

function createToken(data) {
  return jwt.sign(data, 'clave');
}

module.exports = createToken;
