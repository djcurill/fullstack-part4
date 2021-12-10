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

  test('invalid blog returns 400', async () => {
    await api.post('/api/blogs').send(invalidBlog).expect(400);

    const blogsAfterPost = await testHelper.blogsInDb();
    expect(blogsAfterPost.length).toBe(testHelper.initialBlogs.length);
  });

  test('new note with undefined likes defaults to 0', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'no likes', author: 'nobody' })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blog = await testHelper.findOne({ title: 'no likes' });
    expect(blog.likes).toBe(0);
  });

  test('new blog with missing title returns 400', async () => {
    await api.post('/api/blogs').send({ author: '400' }).expect(400);
  });

  test('new blog with missing author returns 400', async () => {
    await api.post('/api/blogs').send({ title: '400' }).expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('given valid id blog is deleted', async () => {
    const before = await testHelper.blogsInDb();
    const blogToDelete = before[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(200);

    const after = await testHelper.blogsInDb();
    expect(after).not.toContainEqual(blogToDelete);
  });

  test('given non-existing id api returns 404', async () => {
    await api.delete(`/api/blogs/61b3c6caa7df69784a7867f6`).expect(404);
  });
});

describe('PUT /api/blogs/', () => {
  test('given existing blog, blog is updated', async () => {
    const blog = (await testHelper.blogsInDb())[0];
    blog.title = 'incoming updated title';
    const result = await api
      .put('/api/blogs')
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toEqual(blog);
  });

  test('given non-existing blog, no update occurs', async () => {
    const fakeBlog = {
      id: '61b3cec497d8bb747cd25c7f', // non existing id
      title: 'I do not',
      author: 'exist',
    };
    api.put('/api/blogs').send(fakeBlog).expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
