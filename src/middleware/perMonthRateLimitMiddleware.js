const Client = require('../models/clientModel');

async function perMonthRateLimitMiddleware(req, res, next) {
  const { 'x-client-id': clientId } = req.headers;

  try {
    // Get the client by ID
    const client = await Client.findById(clientId);

    if (client) {
      // Check if the client has exceeded the monthly limit
      const currentMonthRequests = client.monthlyRequests || 0;
      const monthlyLimit = client.monthlyLimit || 0;

      if (currentMonthRequests < monthlyLimit) {
        // Update the number of requests for the current month
        await Client.findByIdAndUpdate(clientId, { $inc: { monthlyRequests: 1 } });
        next();
      } else {
        // Client has exceeded the monthly limit
        res.status(429).json({ message: 'Monthly limit exceeded' });
      }
    } else {
      // Client not found
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error in perMonthRateLimitMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = perMonthRateLimitMiddleware;
