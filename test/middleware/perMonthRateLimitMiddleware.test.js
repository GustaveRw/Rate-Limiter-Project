const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server');
const clientModel = require('../../src/models/clientModel');
const perMonthRateLimitMiddleware = require('../../src/middleware/perMonthRateLimitMiddleware');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Per Month Rate Limit Middleware', () => {
  beforeEach(async () => {
    // Clear the client collection before each test case
    await clientModel.deleteMany({});
  });

  afterEach(async () => {
    // Clear the client collection after each test case
    await clientModel.deleteMany({});
  });

  it('should allow requests within the monthly limit', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const client = await clientModel.create(clientData);

    // Simulate requests within the monthly limit
    const requests = Array.from({ length: 1000 }, () =>
      chai.request(app)
        .get('/api/test')
        .set('X-Client-ID', client._id)
        .use(perMonthRateLimitMiddleware) // Apply the perMonthRateLimitMiddleware
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(200))));
  });

  it('should reject requests exceeding the monthly limit', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const client = await clientModel.create(clientData);

    // Simulate requests exceeding the monthly limit
    const requests = Array.from({ length: 1001 }, () =>
      chai.request(app)
        .get('/api/test')
        .set('X-Client-ID', client._id)
        .use(perMonthRateLimitMiddleware) // Apply the perMonthRateLimitMiddleware
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(429))));
  });
});
