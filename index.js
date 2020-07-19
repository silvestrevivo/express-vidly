const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const express = require('express');
const genres = require('./routes/genres');
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use('/api/genres', genres);

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

// Configuration
console.log('Application data', {name: config.get('name'), host: config.get('mail').host});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
