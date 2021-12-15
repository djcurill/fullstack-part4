const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/users');
const Blog = require('../models/blog');
const app = require('../app');
const testHelper = require('./test_helper');

const api = supertest(app);

describe('User API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const testUser = testHelper.initialUsers[0];
    const newUser = await new User(testUser).save();
    testHelper.initialBlogs.forEach((blog) => (blog.user = newUser._id));
    await Blog.insertMany(testHelper.initialBlogs);
  });

  describe('when there is initially a user in the db', () => {
    test('create a new user', async () => {
      const before = await testHelper.usersInDb();

      const newUser = {
        username: 'testo', // this is failing because user already exist
        name: 'test',
        password: 'testing',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const after = await testHelper.usersInDb();
      expect(after.length - before.length).toBe(1);

      const usernames = after.map((user) => user.userName);
      expect(usernames).toContain('testo');
    });

    test('create duplicate user returns 400 status', async () => {
      const duplicateUser = (await User.find({}))[0];
      await api.post('/api/users').send(duplicateUser).expect(400);
    });

    test('get returns all users', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const usersInDb = await testHelper.usersInDb();
      expect(response.body.length).toBe(usersInDb.length);
    });
  });

  describe('validation checks', () => {
    test('create new user with missing password returns 400', async () => {
      const invalidUser = {
        username: 'fail',
        name: 'fast',
      };

      await api.post('/api/users').send(invalidUser).expect(400);

      const users = await testHelper.usersInDb();
      expect(users.length).toBe(testHelper.initialUsers.length);
    });

    test('create new user with missing username returns 400', async () => {
      const invalidUser = {
        password: 'fail',
        name: 'fast',
      };

      await api.post('/api/users').send(invalidUser).expect(400);

      const users = await testHelper.usersInDb();
      expect(users.length).toBe(testHelper.initialUsers.length);
    });

    test('username less than 3 characters returns 400', async () => {
      const invalidUser = {
        username: 'no',
        password: 'fail',
        name: 'fast',
      };

      await api.post('/api/users').send(invalidUser).expect(400);

      const users = await testHelper.usersInDb();
      expect(users.length).toBe(testHelper.initialUsers.length);
    });

    test('password less than 3 characters returns 400', async () => {
      const invalidUser = {
        username: 'fail',
        password: 'no',
        name: 'epic',
      };

      await api.post('/api/users').send(invalidUser).expect(400);

      const users = await testHelper.usersInDb();
      expect(users.length).toBe(testHelper.initialUsers.length);
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
