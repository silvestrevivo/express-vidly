const express = require('express');
const Joi = require('joi');
const router = express.Router();

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' },
];

// GET requests
router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// POST requests
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;
