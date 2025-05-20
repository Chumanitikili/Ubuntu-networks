import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (error) => {
  console.error('Redis error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, stringValue);
    } else {
      await redis.set(key, stringValue);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },
};

export const session = {
  async get(userId: string): Promise<unknown> {
    return cache.get(`session:${userId}`);
  },

  async set(userId: string, data: unknown, ttl: number = 3600): Promise<void> {
    await cache.set(`session:${userId}`, data, ttl);
  },

  async del(userId: string): Promise<void> {
    await cache.del(`session:${userId}`);
  },
};

export const queue = {
  async add(jobName: string, data: unknown, options?: { delay?: number }): Promise<void> {
    const job = {
      name: jobName,
      data,
      timestamp: Date.now(),
    };

    if (options?.delay) {
      await redis.zadd('delayed_jobs', Date.now() + options.delay, JSON.stringify(job));
    } else {
      await redis.lpush('jobs', JSON.stringify(job));
    }
  },

  async process(jobName: string, handler: (data: unknown) => Promise<void>): Promise<void> {
    while (true) {
      const job = await redis.brpop('jobs', 0);
      if (job) {
        const { name, data } = JSON.parse(job[1]);
        if (name === jobName) {
          await handler(data);
        }
      }
    }
  },
};

export default redis; 