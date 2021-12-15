const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/users');

const userIdOne = '61bacefd5184324d03eb5996';

const blogIdOne = '61bad011180ab60beaeeb387';
const blogIdTwo = '61bad01ad39cc5fe10f3c5f1';

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

const initialUsers = [
  {
    username: 'testUser',
    name: 'testerson',
    password: 'secret',
  },
];

const createUsers = () => {
  const userOne = new User({
    _id: userIdOne,
    userName: 'testUser',
    name: 'testerson',
    passwordHash: bcrypt.hashSync('secret', 10),
    blogs: [blogIdOne, blogIdTwo],
  });
  return [userOne];
};

const createBlogs = () => {
  const blogOne = new Blog({
    _id: blogIdOne,
    title: 'Blog One',
    author: 'Bob',
    url: 'bob.loblaw',
    likes: 5,
    user: userIdOne,
  });

  const blogTwo = new Blog({
    _id: blogIdTwo,
    title: 'blog #2',
    author: 'mary',
    url: 'mary.scary',
    likes: 7,
    user: userIdOne,
  });
  return [blogOne, blogTwo];
};

const tearDownDb = async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
};

const setUpDb = async () => {
  await User.insertMany(createUsers());
  await Blog.insertMany(createBlogs());
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const findOne = async (query) => {
  const blog = await Blog.findOne(query);
  return blog.toJSON();
};

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb,
  findOne,
  setUpDb,
  tearDownDb,
};
