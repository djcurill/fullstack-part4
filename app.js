const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
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
app.use('/api/blogs', blogsRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
