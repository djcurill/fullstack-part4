const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const app = require('../app');
const testHelper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(testHelper.initialBlogs);
});

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
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterPost = await testHelper.blogsInDb();
    expect(blogsAfterPost.map((blog) => blog.title)).toContainEqual(
      newBlog.title
    );
    expect(blogsAfterPost.map((blog) => blog.author)).toContainEqual(
      newBlog.author
    );
    expect(blogsAfterPost.length).toBe(testHelper.initialBlogs.length + 1);
  });

  test('invalid blog is not added to db', async () => {
    await api.post('/api/blogs').send(invalidBlog).expect(400);

    const blogsAfterPost = await testHelper.blogsInDb();
    expect(blogsAfterPost.length).toBe(testHelper.initialBlogs.length);
  });

  test('POST /api/blogs defaults missing likes to 0', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'no likes', author: 'nobody' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blog = await testHelper.findOne({ title: 'no likes' });
    expect(blog.likes).toBe(0);
  });

  test('POST /api/blogs returns 400 given missing title', async () => {
    await api.post('/api/blogs').send({ author: '400' }).expect(400);
  });

  test('POST /api/blogs returns 400 given missing author', async () => {
    await api.post('/api/blogs').send({ title: '400' }).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
