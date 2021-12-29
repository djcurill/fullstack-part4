const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const resetRouter = require('./controllers/reset');

const app = express();

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('Connection successful'))
  .catch((error) =>
    logger.error('Error connection to MongoDb: ', error.message)
  );

app.use(express.json());
app.use(cors());
app.use(
  morgan('tiny', {
    skip: (_req, res) => process.env.NODE_ENV === 'test',
  })
);
app.use(middleware.getToken);
app.use(middleware.getUser);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', userRouter);

if (process.env.NODE_ENV === 'test') app.use('/test/reset', resetRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
