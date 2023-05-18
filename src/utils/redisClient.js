const redis = require('redis');
const { promisify } = require('util');

// Create a Redis client
const redisClient = redis.createClient({
  host: 'localhost', // Replace with your Redis server host
  port: 6379, // Replace with your Redis server port
  password: 'REDIS_PASSWORD', // Replace with your Redis server password if applicable
});

// Promisify Redis client methods for async/await support
redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
redisClient.zAddAsync = promisify(redisClient.zAdd).bind(redisClient);
redisClient.zCardAsync = promisify(redisClient.zCard).bind(redisClient);
redisClient.zRemRangeByScoreAsync = promisify(redisClient.zRemRangeByScore).bind(redisClient);

module.exports = redisClient;
