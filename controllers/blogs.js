const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/users');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { body, token } = req;

  if (token === undefined)
    return res.status(401).send('Authentication token missing');

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await Blog.findByIdAndDelete(id);
  if (result === null) return res.status(404).send('Not found');
  return res.status(200).send('Successfully deleted');
});

blogsRouter.put('/', async (req, res) => {
  const blog = req.body;
  const result = await Blog.findByIdAndUpdate(blog.id, blog, { new: true });
  if (result === null) return res.status(404).send('Not found');
  return res.status(200).json(result);
});

module.exports = blogsRouter;
