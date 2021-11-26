const listHelper = require('../utils/list_helper');

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];
    expect(listHelper.dummy(blogs)).toBe(1);
  });
});

describe('totalLikes', () => {
  const noBlogs = [];
  const oneBlog = [
    {
      title: 'blog #1',
      author: 'louis the first',
      url: 'blog.uno',
      likes: 42,
    },
  ];
  const multipleBlogs = [
    {
      title: 'blog #1',
      author: 'louis the first',
      url: 'blog.uno',
      likes: 1,
    },
    {
      title: 'blog #2',
      author: 'louis the second',
      url: 'blog.dos',
      likes: 2,
    },
  ];

  test('totalLikes returns 0 for no blogs', () => {
    const blogs = [];

    expect(listHelper.totalLikes(blogs)).toBe(0);
  });

  test('when list has one blog, totalLikes equals likes of that blog', () => {
    expect(listHelper.totalLikes(oneBlog)).toBe(42);
  });

  test('when list has multiple blogs, totalLikes equals sum of all likes', () => {
    expect(listHelper.totalLikes(multipleBlogs)).toBe(3);
  });
});
