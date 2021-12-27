const supertest = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Blog = require('../models/blog');
const app = require('../app');
const testHelper = require('./test_helper');

const api = supertest(app);

describe('Blog API', () => {
  beforeEach(async () => {
    await testHelper.tearDownDb();
    await testHelper.setUpDb();
  });

  const setUpExistingUser = async () => {
    const existingUser = (await User.find({}))[0];
    const token = testHelper.generateTokenFromUser(
      existingUser._id.toString(),
      existingUser.userName
    );
    return { user: existingUser, token };
  };

  describe('GET /api/blogs', () => {
    test('valid get returns 200 & json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('GET /api/blogs returns 2 blogs', async () => {
      const response = await api.get('/api/blogs');
      expect(response.body.length).toBe(2);
    });

    test('GET /api/blogs returns blogs with defined id property', async () => {
      const response = await api.get('/api/blogs');
      response.body.forEach((blog) => {
        expect(blog.id).toBeDefined();
      });
    });
  });

  describe('POST /api/blogs', () => {
    const newBlog = {
      title: 'dev.to',
      author: 'the internet',
      url: 'dev.to',
    };

    const invalidBlog = {
      url: 'no title, no author',
    };

    test('valid blog is added to db', async () => {
      const { user, token } = await setUpExistingUser();

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const postedBlog = await Blog.findOne({
        title: newBlog.title,
        author: newBlog.author,
      });

      expect(postedBlog).toBeTruthy();
      expect(postedBlog.title).toBe(newBlog.title);
      expect(postedBlog.author).toBe(newBlog.author);
      expect(postedBlog.user).toEqual(user._id);
    });

    test('invalid blog returns 400', async () => {
      const { token } = await setUpExistingUser();
      const before = await testHelper.blogsInDb();
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(invalidBlog)
        .expect(400);

      const after = await testHelper.blogsInDb();
      expect(after.length).toBe(before.length);
    });

    test('new note with undefined likes defaults to 0', async () => {
      const { token } = await setUpExistingUser();

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send({
          title: 'no likes',
          author: 'nobody',
        })
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blog = await testHelper.findOne({ title: 'no likes' });
      expect(blog.likes).toBe(0);
    });

    test('new blog with missing title returns 400', async () => {
      const { user, token } = await setUpExistingUser();
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send({ author: '400', userId: user._id.toString() })
        .expect(400);
    });

    test('new blog with missing author returns 400', async () => {
      const { user, token } = await setUpExistingUser();
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send({ title: '400', userId: user._id.toString() })
        .expect(400);
    });

    test('request with no token returns 401', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });

    test('request with invalid token returns 401', async () => {
      const invalidToken = jwt.sign({ fail: 'yes' }, process.env.SECRET);

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${invalidToken}`)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('given valid id blog is deleted', async () => {
      const { user, token } = await setUpExistingUser();
      const blogToDelete = await Blog.findOne({ user: user._id });

      await api
        .delete(`/api/blogs/${blogToDelete._id.toString()}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      const after = await testHelper.blogsInDb();
      expect(after).not.toContainEqual(blogToDelete);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.blogs).not.toContainEqual(blogToDelete._id);
    });

    test('given non-existing id api returns 404', async () => {
      const { token } = await setUpExistingUser();
      await api
        .delete(`/api/blogs/61b3c6caa7df69784a7867f6`)
        .set('Authorization', `bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/blogs/', () => {
    test('given existing blog, blog is updated by user', async () => {
      const { user, token } = await setUpExistingUser();
      const blog = (await Blog.findOne({ user: user._id })).toJSON();

      blog.title = 'incoming updated title';
      const result = await api
        .put('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(result.body.title).toEqual(blog.title);
    });

    test('given non-existing blog, no update occurs', async () => {
      const { user, token } = await setUpExistingUser();
      const fakeBlog = {
        id: '61b3cec497d8bb747cd25c7f', // non existing id
        title: 'I do not',
        author: 'exist',
        user: user._id,
      };
      await api
        .put('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(fakeBlog)
        .expect(404);
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });
});
