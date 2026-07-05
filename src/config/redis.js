import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  // Don't let a slow/absent Redis hang requests forever.
  maxRetriesPerRequest: 2,
  // Reconnect on transient errors.
  retryStrategy: (times) => Math.min(times * 200, 2000),
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));

export default redis;