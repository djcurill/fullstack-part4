const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

const MIN_PASSWORD_LENGTH = 3;

userRouter.post('/', async (req, res) => {
  const { body } = req;
  if (body.password === undefined || body.username === undefined)
    return res.status(400).send('User registration requires password field');

  if (body.password.length < MIN_PASSWORD_LENGTH)
    return res
      .status(400)
      .send(
        `Password must have a minimum of ${MIN_PASSWORD_LENGTH} characters`
      );

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.json(savedUser);
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs');
  res.json(users);
});

module.exports = userRouter;
