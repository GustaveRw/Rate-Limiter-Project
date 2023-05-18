const redisClient = require('../utils/redisClient');

function systemRateLimitMiddleware(req, res, next) {
  const windowSize = 60; // Time window in seconds
  const maxRequests = 100; // Maximum number of requests allowed within the time window

  const key = 'system_rate_limit';
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  redisClient.zRemRangeByScore(key, '-inf', currentTime - windowSize, (err) => {
    if (err) {
      console.error('Error in systemRateLimitMiddleware:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    redisClient.zCard(key, (err, count) => {
      if (err) {
        console.error('Error in systemRateLimitMiddleware:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (count < maxRequests) {
        redisClient.zAdd(key, currentTime, currentTime, (err) => {
          if (err) {
            console.error('Error in systemRateLimitMiddleware:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          next();
        });
      } else {
        res.status(429).json({ message: 'Too many requests' });
      }
    });
  });
}

module.exports = systemRateLimitMiddleware;
