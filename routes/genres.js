const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// GET requests
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  // Find genre
  const genre = await Genre.findById(req.params.id)

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// POST requests
router.post('/', auth, async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// PUT requests
router.put('/:id', auth,  async (req, res) => {
  // Validation
  const { error } = validate(req.body);
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
router.delete('/:id', auth,  async (req, res) => {
  // Try to find the genre to delete
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // 404 => object not found, not exists in the server
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});


module.exports = router;
