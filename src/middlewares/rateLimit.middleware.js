import rateLimit from 'express-rate-limit';

// General API limiter — generous, just a safety net against abuse.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 100,              // 100 requests/min per IP
  standardHeaders: true, // send RateLimit-* headers so clients can self-throttle
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// Strict limiter for auth — slows brute-force / credential-stuffing on login.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later' },
});