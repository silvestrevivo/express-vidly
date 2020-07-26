const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const { logger } = require('../middleware/error');

module.exports = function(app){
  // Connect to mongoDB and server
  mongoose.connect('mongodb://localhost/vidly',
    { useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true })
    .then(() => {
        //console.log('connected to mongoDB');
        logger.info('connected to mongoDB');
        // Server
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
          // Configuration
          logger.info(`Listening on port ${port}...`)
          logger.info('Application data',
            {name: config.get('name'),
            host: config.get('mail').host
          });
        });
      })
  };
