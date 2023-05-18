const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server');
const systemRateLimitMiddleware = require('../../src/middleware/systemRateLimitMiddleware');
const clientModel = require('../../src/models/clientModel');

chai.use(chaiHttp);
const expect = chai.expect;

describe('System Rate Limit Middleware', () => {
  beforeEach(async () => {
    // Set up any necessary test data or environment before each test case
    await clientModel.create({ name: 'Test Client 1', monthlyLimit: 100 });
    await clientModel.create({ name: 'Test Client 2', monthlyLimit: 200 });
    // Add any other necessary setup steps specific to your project
  });

  afterEach(async () => {
    // Clean up any test data or environment after each test case
    await clientModel.deleteMany({});
    // Add any other necessary cleanup steps specific to your project
  });

  it('should allow requests within the system limit', async () => {
    // Simulate requests within the system limit
    const requests = Array.from({ length: 100 }, () =>
      chai.request(app)
        .get('/api/test')
        .use(systemRateLimitMiddleware)
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(200))));
  });

  it('should reject requests exceeding the system limit', async () => {
    // Simulate requests exceeding the system limit
    const requests = Array.from({ length: 101 }, () =>
      chai.request(app)
        .get('/api/test')
        .use(systemRateLimitMiddleware)
    );

    // Perform the requests and assert the response status
    await Promise.all(requests.map((request) => request.then((res) => expect(res).to.have.status(429))));
  });
});
