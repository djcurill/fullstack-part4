const supertest = require('supertest');
const mongoose = require('mongoose');
const testHelper = require('./test_helper');
const app = require('../app');
const User = require('../models/users');

const api = supertest(app);

describe('send user info to login api', () => {
  beforeEach(async () => {
    await testHelper.tearDownDb();
    await testHelper.setUpDb();
  });

  const validLogin = {
    username: 'testUser',
    password: 'secret',
  };

  test('valid user login returns token', async () => {
    const response = await api
      .post('/api/login')
      .send(validLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(validLogin.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
