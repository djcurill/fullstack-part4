const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testHelper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/users');

const api = supertest(app);

describe('POST /test/reset', () => {
  beforeEach(async () => {
    await testHelper.tearDownDb();
    await testHelper.setUpDb();
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('cleans the state of the database', async () => {
    await api.post('/test/reset').expect(204);

    const blogs = await Blog.find({});
    const users = await User.find({});
    expect(blogs.length).toBe(0);
    expect(users.length).toBe(0);
  });
});
