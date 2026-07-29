const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Get all subscription plans
router.get('/', async (req, res) => {
  try {
    const plans = await Subscription.findAll({ order: [['id', 'ASC']] });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new subscription plan
router.post('/', async (req, res) => {
  try {
    const plan = await Subscription.create({
      name: req.body.name,
      price: req.body.price,
      frequency: req.body.frequency,
      subscribers: req.body.subscribers || 0,
      features: req.body.features || [],
      popular: req.body.popular || false
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a subscription plan
router.put('/:id', async (req, res) => {
  try {
    const plan = await Subscription.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    
    await plan.update(req.body);
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a subscription plan
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Subscription.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Plan deleted' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed default subscriptions
router.post('/seed', async (req, res) => {
  try {
    const existing = await Subscription.findAll();
    if (existing.length > 0) {
      return res.json({ message: 'Plans already seeded', count: existing.length });
    }
    const defaults = [
      {
        name: 'Family Pack Weekly',
        price: 1499,
        frequency: 'Weekly',
        subscribers: 42,
        features: ['2 Family Tubs', '4 Waffle Cones', 'Free Toppings', 'Free Delivery'],
        popular: true
      },
      {
        name: 'Couples Weekend',
        price: 899,
        frequency: 'Weekly',
        subscribers: 86,
        features: ['1 Family Tub', '2 Choco Cones', 'Free Delivery'],
        popular: false
      },
      {
        name: 'Monthly Mega Box',
        price: 2499,
        frequency: 'Monthly',
        subscribers: 115,
        features: ['4 Premium Tubs', 'Assorted Popsicles', 'Secret New Flavor Sample'],
        popular: false
      }
    ];
    await Subscription.bulkCreate(defaults);
    res.status(201).json({ message: 'Default subscription plans seeded', count: defaults.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
