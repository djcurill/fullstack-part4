const dummy = (blogs) => 1;

const totalLikes = (blogs) =>
  // eslint-disable-next-line no-param-reassign
  blogs.reduce((accu, blog) => (accu += blog.likes), 0);

module.exports = { dummy, totalLikes };
