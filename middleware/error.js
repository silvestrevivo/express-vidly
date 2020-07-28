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
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' }),
    // for mongo
    new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'info'}),
    // to share with another developers
    new winston.transports.Console({ color: true, prettyPrint: true })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// If an error happens during the runtime and is not handel
// this is valid for sync code
process.on('uncaughtException', (err) => {
  logger.error('we got an uncaughtException', err.message);
  process.exit(1);
})

// this the same but for async operations
process.on('unhandledRejection', (err) => {
  logger.error('we got an unhandledRejection', err.message);
  process.exit(1);
})

//* this errors can be handle with another winston method => see docs
// winston.handleExceptions(
//   new winston.transports.File({filename: 'uncaughtexception.log'})
// );

// Error function middleware
module.exports = function(err, req, res, next) {
  logger.error(err.message); // what we send to console
  res.status(500).send('Something failed'); // what we send to client
}

module.exports.logger = logger;
