const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./envConsts');

module.exports.generateToken = (payload) => jwt.sign({ _id: payload }, JWT_SECRET, { expiresIn: '7d' });

module.exports.checkToken = (token) => jwt.verify(token, JWT_SECRET);
