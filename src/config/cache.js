import redis from './redis.js';

const DEFAULT_TTL = 30; // seconds

export const cacheGet = async (key) => {
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    console.error('cacheGet failed:', err.message);
    return null; // treat as cache miss
  }
};

export const cacheSet = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (err) {
    console.error('cacheSet failed:', err.message);
  }
};

export const cacheDel = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error('cacheDel failed:', err.message);
  }
};