const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server');
const rateLimitMiddleware = require('../../src/middleware/rateLimitMiddleware');
const clientModel = require('../../src/models/clientModel');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Rate Limit Middleware', () => {
  beforeEach(async () => {
    // Set up any necessary test data or environment before each test case
    await clientModel.deleteMany({});
    const clientData = {
      name: 'Test Client',
      rateLimit: 10,
    };
    await clientModel.create(clientData);
  });

  afterEach(async () => {
    // Clean up any test data or environment after each test case
    await clientModel.deleteMany({});
  });

  it('should allow requests within the time window limit', async () => {
    // Simulate requests within the time window limit
    const requests = Array.from({ length: 10 }, () =>
      chai.request(app)
        .get('/api/test')
        .set('X-Client-ID', 'test-client-id')
        .use(rateLimitMiddleware)
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(200))));
  });

  it('should reject requests exceeding the time window limit', async () => {
    // Simulate requests exceeding the time window limit
    const requests = Array.from({ length: 11 }, () =>
      chai.request(app)
        .get('/api/test')
        .set('X-Client-ID', 'test-client-id')
        .use(rateLimitMiddleware)
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(429))));
  });
});
