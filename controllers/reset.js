const resetRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/users');

resetRouter.post('/', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = resetRouter;
