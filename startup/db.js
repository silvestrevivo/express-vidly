const mongoose = require('mongoose');
const config = require('config');
const { logger } = require('../middleware/error');

module.exports = function(){
  const db = config.get('db');
  // Connect to mongoDB and server
  mongoose.connect(db,
    { useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true })
    .then(() => {
        logger.info(`connected to ${db}...`);
      })
  };
