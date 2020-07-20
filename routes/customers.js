const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const customersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
})

const Customer = mongoose.model('Customer', customersSchema);

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
router.post('/', async (req, res) => {
  // Validation
  const { error } = validateCustomer(req.body);
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
router.put('/:id', async (req, res) => {
  // Validation
  const { error } = validateCustomer(req.body);
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
router.delete('/:id', async (req, res) => {
  // Try to find the genre to delete
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // 404 => object not found, not exists in the server
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});


function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
