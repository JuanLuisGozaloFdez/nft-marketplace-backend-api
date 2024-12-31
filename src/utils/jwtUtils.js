const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

exports.generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
