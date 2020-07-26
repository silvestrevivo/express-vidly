const winston = require('winston'); // track errors in the console for server
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    // for mongo
    new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly'})
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = function(err, req, res, next) {
  logger.error(err.message); // what we send to console
  res.status(500).send('Something failed'); // what we send to client
}
