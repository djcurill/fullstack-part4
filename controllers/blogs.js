const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body);
  const result = await blog.save();
  res.status(201).json(result);
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
