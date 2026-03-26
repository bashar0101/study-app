const rateLimit = require('express-rate-limit');

// Basic memory store rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per windowMs for auth endpoints
  skipSuccessfulRequests: true,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 30, // limit each IP to 30 requests per windowMs
});

module.exports = {
  authLimiter,
  apiLimiter,
};
