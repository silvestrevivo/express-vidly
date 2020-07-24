const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('Joi');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

// Register user
router.post('/', async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  // Check if user exists
  let user = await User.findOne({ email: req.body.email });
  if (!user)  return  res.status(400).send('Invalid email');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) res.status(400).send('Invalid password');

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
