const supertest = require('supertest');
const mongoose = require('mongoose');
const testHelper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/users');
const app = require('../app');

const api = supertest(app);

describe('send user info to login api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const testUser = testHelper.initialUsers[0];
    const newUser = await new User({
      userName: testUser.username,
      name: testUser.name,
    }).save();
    testHelper.initialBlogs.forEach((blog) => (blog.user = newUser._id));
    await Blog.insertMany(testHelper.initialBlogs);
  });

  test('valid user login returns token', async () => {
    const validUser = testHelper.initialUsers[0];

    const allUsers = await testHelper.usersInDb();

    console.log(allUsers);

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
