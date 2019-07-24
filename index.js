const Joi = require('joi');
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' },
];

// GET requests
app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// POST requests
app.post('/api/genres', (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

// PUT requests
app.put('/api/genres/:id', (req, res) => {
  // Try to find the genre to update
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Validation
  const { error } = validateGenre(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);

  // Update genre
  genre.name = req.body.name;
  res.send(genre);
});

// DELETE requests
app.delete('/api/genres/:id', (req, res) => {
  // Try to find the genre to delete
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Element to delete
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

// Function validation
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
