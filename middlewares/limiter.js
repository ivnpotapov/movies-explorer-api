const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 10000,
  max: 10000,
});

module.exports = limiter;
