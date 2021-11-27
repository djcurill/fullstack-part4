const listHelper = require('../utils/list_helper');

const noBlogs = [];
const oneBlog = [
  {
    title: 'blog #1',
    author: 'louis the first',
    url: 'blog.uno',
    likes: 42,
  },
];
const twoBlogs = [
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

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];
    expect(listHelper.dummy(blogs)).toBe(1);
  });
});

describe('totalLikes', () => {
  test('totalLikes returns 0 for no blogs', () => {
    expect(listHelper.totalLikes(noBlogs)).toBe(0);
  });

  test('when list has one blog, totalLikes equals likes of that blog', () => {
    expect(listHelper.totalLikes(oneBlog)).toBe(42);
  });

  test('when list has multiple blogs, totalLikes equals sum of all likes', () => {
    expect(listHelper.totalLikes(twoBlogs)).toBe(3);
  });
});

describe('argMax', () => {
  test('argMax is 0 if [3,2,1]', () => {
    expect(listHelper.argMax([3, 2, 1])).toBe(0);
  });

  test('argMax is 0 if array is empty', () => {
    expect(listHelper.argMax([])).toBe(0);
  });

  test('argMax is 0 if array has one value', () => {
    expect(listHelper.argMax([1])).toBe(0);
  });

  test('argMax any index given multiple maximums', () => {
    const result = listHelper.argMax([1, 2, 3, 3, 2, 1]);
    const answer = result === 2 || result === 3;
    expect(answer).toBe(true);
  });
});

describe('favoriteBlog', () => {
  test('returns null for empty array', () => {
    expect(listHelper.favoriteBlog(noBlogs)).toBe(null);
  });

  test('returns first value of array with one blog', () => {
    expect(listHelper.favoriteBlog(oneBlog)).toEqual(oneBlog[0]);
  });

  test('returns blog with most likes given array with many blogs', () => {
    expect(listHelper.favoriteBlog(twoBlogs)).toEqual(twoBlogs[1]);
  });

  describe('mostBlogs', () => {
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
        likes: 1,
      },
      {
        title: 'blog #4',
        author: 'bob',
        url: 'blog.quatro',
        likes: 2,
      },
    ];
    test('returns null for empty array', () => {
      expect(listHelper.mostBlogs(noBlogs)).toBe(null);
    });

    test('returns only author in array of one blog', () => {
      expect(listHelper.mostBlogs(oneBlog)).toBe('louis the first');
    });

    test('returns author with most blogs given many blogs', () => {
      expect(listHelper.mostBlogs(manyBlogs)).toBe('bob');
    });
  });
});

describe('mostLikes', () => {
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

  test('given empty array, returns null', () => {
    expect(listHelper.mostLikes(noBlogs)).toBe(null);
  });

  test('given array of one blog, returns only author', () => {
    expect(listHelper.mostLikes(oneBlog)).toBe('louis the first');
  });

  test('given array of many blogs, author with most lieks is returned', () => {
    expect(listHelper.mostLikes(manyBlogs)).toBe('mary');
  });
});
