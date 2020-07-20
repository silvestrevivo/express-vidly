const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('morgan enable...development environment')
}

// Configuration
console.log('Application data', {name: config.get('name'), host: config.get('mail').host});

// Connect to mongoDB and server
mongoose.connect('mongodb://localhost/vidly', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('connected to mongoDB');
    // Server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch(err => console.log('Could not connect to MongoDB'))


