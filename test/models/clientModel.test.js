const assert = require('assert');
const clientModel = require('../../src/models/clientModel');

describe('Client Model', () => {
  beforeEach(async () => {
    // Clear the client collection before each test case
    await clientModel.deleteMany({});
  });

  afterEach(async () => {
    // Clear the client collection after each test case
    await clientModel.deleteMany({});
  });

  it('should create a new client', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const createdClient = await clientModel.create(clientData);

    assert.strictEqual(createdClient.name, clientData.name);
    assert.strictEqual(createdClient.monthlyLimit, clientData.monthlyLimit);
  });

  it('should retrieve a client by ID', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const createdClient = await clientModel.create(clientData);

    const retrievedClient = await clientModel.findById(createdClient._id);

    assert.strictEqual(retrievedClient.name, clientData.name);
    assert.strictEqual(retrievedClient.monthlyLimit, clientData.monthlyLimit);
  });

  it('should update a client', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const createdClient = await clientModel.create(clientData);

    const updatedData = {
      name: 'Updated Client',
      monthlyLimit: 2000,
    };

    await clientModel.findByIdAndUpdate(createdClient._id, updatedData);

    const updatedClient = await clientModel.findById(createdClient._id);

    assert.strictEqual(updatedClient.name, updatedData.name);
    assert.strictEqual(updatedClient.monthlyLimit, updatedData.monthlyLimit);
  });

  it('should delete a client', async () => {
    const clientData = {
      name: 'Test Client',
      monthlyLimit: 1000,
    };

    const createdClient = await clientModel.create(clientData);

    await clientModel.findByIdAndDelete(createdClient._id);

    const deletedClient = await clientModel.findById(createdClient._id);

    assert.strictEqual(deletedClient, null);
  });
});
