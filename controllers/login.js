const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

loginRouter.post('/', async (req, res) => {
  const { body } = req;

  if (body.password === undefined || body.username === undefined)
    return res.status(400).send('Missing username and/or password');

  const user = await User.findOne({ username: body.username });

  if (user === null)
    return res.status(401).send('Username login does not exist');

  const passwordCheck = await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordCheck)
    return res
      .status(401)
      .send(`Invalid password for username: ${user.username}`);

  const signature = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(signature, process.env.SECRET);

  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
