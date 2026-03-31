const rateLimit = require('express-rate-limit');
const redis = require('../config/redis');
const logger = require('../utils/logger');

// Generic IP-based limiter factory
function createLimiter(options) {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max:      options.max || 100,
    message:  { success: false, message: options.message || 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders:   false,
    handler: (req, res, next, options) => {
      logger.warn({
        event:  'rate_limit_exceeded',
        ip:     req.ip,
        path:   req.path,
        method: req.method,
      });
      res.status(429).json(options.message);
    },
  });
}

// Auth routes — very strict
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  'Too many login attempts. Please wait 15 minutes.',
});

// OTP routes — strict
const otpLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max:      5,
  message:  'Too many OTP requests. Please wait 10 minutes.',
});

// General API — relaxed
const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  'Rate limit exceeded.',
});

// Per-user Redis-backed limiter (post-auth)
async function perUserLimiter(req, res, next) {
  if (!req.user) return next();
  const key   = `ratelimit:user:${req.user.id}`;
  const limit  = 60;
  const window = 60;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, window);
    if (count > limit) {
      logger.warn({ event: 'per_user_rate_limit', userId: req.user.id });
      return res.status(429).json({ success: false, message: 'Per-user rate limit exceeded' });
    }
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));
    next();
  } catch (err) {
    // Redis failure — fail open (don't block legitimate users if Redis is down)
    next();
  }
}

module.exports = { authLimiter, otpLimiter, generalLimiter, perUserLimiter };
