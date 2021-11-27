const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  // eslint-disable-next-line no-param-reassign
  blogs.reduce((accu, blog) => (accu += blog.likes), 0);

const argMax = (arr) => {
  if (arr.length <= 1) return 0;
  return arr
    .map((val, idx) => [val, idx])
    .reduce((accu, next) => (next[0] > accu[0] ? next : accu))[1];
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  if (blogs.length === 1) return blogs[0];
  const idx = argMax(blogs.map((b) => b.likes));
  return blogs[idx];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  if (blogs.length === 1) return blogs[0].author;
  return _(blogs).countBy('author').entries().maxBy(_.last)[0];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  if (blogs.length === 1) return blogs[0].author;
  return _(blogs)
    .groupBy('author')
    .map((summary, name) => ({
      author: name,
      totalLikes: _.sumBy(summary, 'likes'),
    }))
    .maxBy('totalLikes').author;
};

const manyBlogs = [
  {
    title: 'blog #1',
    author: 'bob',
    url: 'blog.uno',
    likes: 1,
  },
  {
    title: 'blog #2',
    author: 'bob',
    url: 'blog.dos',
    likes: 2,
  },
  {
    title: 'blog #3',
    author: 'mary',
    url: 'blog.tres',
    likes: 50,
  },
  {
    title: 'blog #4',
    author: 'bob',
    url: 'blog.quatro',
    likes: 2,
  },
];

console.log(mostLikes(manyBlogs));

module.exports = {
  dummy,
  totalLikes,
  argMax,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
