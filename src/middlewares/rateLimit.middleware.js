import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

// Shared store factory — sendCommand routes through ioredis.
const store = () =>
  new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  });

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: store(),
  message: { error: 'Too many requests, please try again later' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: store(),
  message: { error: 'Too many attempts, please try again later' },
});