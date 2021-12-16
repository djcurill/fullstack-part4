const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 });
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

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
  // update user post delete
  const { id } = req.params;
  const { user } = req;

  if (user === undefined)
    return res.status(401).send('Authentication token missing');

  const blogToDelete = await Blog.findById(id);
  if (blogToDelete === null) return res.status(404).send('Blog not found');

  if (blogToDelete.user.toString() !== user.id)
    return res.status(401).send('Invalid user token.');

  await Blog.findByIdAndDelete(blogToDelete._id);
  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== blogToDelete._id.toString()
  );
  await user.save();
  return res.status(200).send('Successfully deleted');
});

blogsRouter.put('/', async (req, res) => {
  const blog = req.body;
  const result = await Blog.findByIdAndUpdate(blog.id, blog, { new: true });
  if (result === null) return res.status(404).send('Not found');
  return res.status(200).json(result);
});

module.exports = blogsRouter;
