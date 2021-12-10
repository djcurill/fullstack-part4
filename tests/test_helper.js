const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'blog #1',
    author: 'bob',
    url: 'bob.loblaw',
    likes: 5,
  },
  {
    title: 'blog #2',
    author: 'mary',
    url: 'mary.scary',
    likes: 7,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const findOne = async (query) => {
  const blog = await Blog.findOne(query);
  return blog.toJSON();
};

module.exports = { initialBlogs, blogsInDb, findOne };
