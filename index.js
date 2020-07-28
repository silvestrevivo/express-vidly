require('express-async-errors');// handling errors middleware
const { logger } = require('./middleware/error');
const morgan = require('morgan');
const config = require('config');
const express = require('express');
const app = express();
require('./startup/routes')(app);// Middleware
require('./startup/db')(); // Connect to mongoDB and server
require('./startup/validation')(); // Validation

if(!config.get('jwtPrivateKey')){
  throw new Error('ERROR FATAL: jwtPrivatekey is not defined');
}

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

const port = process.env.PORT || 3000;
const server =  app.listen(port, () => {
  // Configuration
  logger.info(`Listening on port ${port}...`)
  logger.info('Application data',
    {name: config.get('name'),
    host: config.get('mail').host
  });
});

module.exports = server; // export server for integration test
