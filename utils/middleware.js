const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'CastError')
    return res
      .status(400)
      .json({ error: `Error casting ${err.path}: ${err.value}` });

  if (err.name === 'ValidationError')
    return res.status(400).json({ error: 'schema validation error' });

  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'invalid token' });

  next(err);
};

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: 'unknown endpoint' });

const getToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader !== undefined) {
    const token = authorizationHeader.split(' ')[1];
    req.token = token;
  }

  next();
};

module.exports = { errorHandler, unknownEndpoint, getToken };
