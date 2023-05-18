const assert = require('assert');
const redisClient = require('../../src/utils/redisClient');

describe('Redis Client', () => {
  beforeEach(async () => {
    // Flush Redis database before each test case
    await redisClient.flushDb();
  });

  afterEach(async () => {
    // Flush Redis database after each test case
    await redisClient.flushDb();
  });

  it('should set a key-value pair in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value);

    const result = await redisClient.get(key);

    assert.strictEqual(result, value);
  });

  it('should delete a key from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value);

    await redisClient.del(key);

    const result = await redisClient.get(key);

    assert.strictEqual(result, null);
  });

  it('should increment a counter in Redis', async () => {
    const key = 'testCounter';

    await redisClient.incr(key);

    const result = await redisClient.get(key);

    assert.strictEqual(result, '1');
  });

  it('should get the remaining time to live of a key in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const expiresIn = 60;

    await redisClient.set(key, value, 'EX', expiresIn);

    const remainingTime = await redisClient.ttl(key);

    assert.strictEqual(remainingTime, expiresIn);
  });
});
