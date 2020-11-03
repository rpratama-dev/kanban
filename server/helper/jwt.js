const jwt = require('jsonwebtoken');

function generateToken(payload) {
  const token = jwt.sign(JSON.stringify(payload), process.env.SECRET_KEY)
  return token;
}

function verifyToken(token) {
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  return decode;
}

console.log(generateToken({ name: 'riyan' }))

module.exports = {
  generateToken, verifyToken
}