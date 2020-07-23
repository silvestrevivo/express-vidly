const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  await user.save();

  res.send(user);
});




module.exports = router;
