const supertest = require('supertest');
const mongoose = require('mongoose');
const testHelper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('send user info to login api', () => {
  beforeEach(async () => {
    await testHelper.tearDownDb();
    await testHelper.setUpDb();
  });

  test('valid user login returns token', async () => {
    const validUser = testHelper.initialUsers[0];

    const response = await api
      .post('/api/login')
      .send(validUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(validUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
