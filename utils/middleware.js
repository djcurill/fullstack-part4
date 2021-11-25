const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: 'schema validation error' });
  }

  next(err);
};

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: 'unknown endpoint' });

module.exports = { errorHandler, unknownEndpoint };
