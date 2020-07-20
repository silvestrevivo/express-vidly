const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
})

const Genre = mongoose.model('Genre', genreSchema);

// GET requests
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  // Find genre
  const genre = await Genre.findById(req.params.id)

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// POST requests
router.post('/', async (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// PUT requests
router.put('/:id', async (req, res) => {
  // Validation
  const { error } = validateGenre(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);

  // Try to find the genre to update
  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Update genre
  res.send(genre);
});

// DELETE requests
router.delete('/:id', async (req, res) => {
  // Try to find the genre to delete
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Function validation
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
