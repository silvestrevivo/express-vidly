const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})

// Register user
router.post('/', async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  // Check if user exists
  let user = await User.findOne({ email: req.body.email });
  if (user)  return  res.status(400).send('User already registered');

  // If not exists in the database
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  // We hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
