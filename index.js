require('express-async-errors');// handling errors middleware
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

if(!config.get('jwtPrivateKey')){
  console.log('ERROR FATAL: jwtPrivatekey is not defined');
  process.exit(1);// exit of the process
}

// Middleware
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

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

// Configuration
console.log('Application data', {name: config.get('name'), host: config.get('mail').host});

// Connect to mongoDB and server
mongoose.connect('mongodb://localhost/vidly',
  { useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true })
  .then(() => {
    console.log('connected to mongoDB');
    // Server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch(err => console.log('Could not connect to MongoDB'))


