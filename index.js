require('express-async-errors');// handling errors middleware
const morgan = require('morgan');
const config = require('config');
const express = require('express');
const app = express();
require('./startup/routes')(app);// Middleware
require('./startup/db')(app); // Connect to mongoDB and server
require('./startup/validation')(); // Validation

if(!config.get('jwtPrivateKey')){
  throw new Error('ERROR FATAL: jwtPrivatekey is not defined');
}

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}


