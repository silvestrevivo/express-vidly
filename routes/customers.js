const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET requests
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  // Find genre
  const customer = await Customer.findById(req.params.id)

  // 404 => object not found, not exists in the server
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
});


// POST requests
router.post('/', auth, async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);
  // in post request, 400 means a BAD request

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();

  res.send(customer);
});

// PUT requests
router.put('/:id', auth, async (req, res) => {
  // Validation
  const { error } = validate(req.body);
  // 400 => on put is a Bad request
  if (error) return res.status(400).send(error.details[0].message);

  // Try to find the genre to update
  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {name: req.body.name, phone: req.body.phone, isGold: req.body.isGold}, {new: true});

  // 404 => object not found, not exists in the server
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Update genre
  res.send(customer);
});

// DELETE requests
router.delete('/:id', auth, async (req, res) => {
  // Try to find the genre to delete
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // 404 => object not found, not exists in the server
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router;
