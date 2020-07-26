const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const helmet = require('helmet');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(helmet());
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  // this middleware is to handle the errors and is going to work together with
  // the package express-async-errors
  // has to be placed always at the end of the middleware
  app.use(error);
}
