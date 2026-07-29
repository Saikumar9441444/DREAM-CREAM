const express = require('express');
const router = express.Router();
const Addon = require('../models/Addon');

// Get all addons
router.get('/', async (req, res) => {
  try {
    const addons = await Addon.findAll({ order: [['createdAt', 'DESC']] });
    const mapped = addons.map(a => ({
      id: a.id.toString(),
      name: a.name,
      category: a.category,
      price: a.price,
      inStock: a.inStock
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new addon
router.post('/', async (req, res) => {
  try {
    const saved = await Addon.create({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true
    });
    res.status(201).json({
      id: saved.id.toString(),
      name: saved.name,
      category: saved.category,
      price: saved.price,
      inStock: saved.inStock
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an addon
router.put('/:id', async (req, res) => {
  try {
    const addon = await Addon.findByPk(req.params.id);
    if (!addon) return res.status(404).json({ message: 'Addon not found' });
    
    await addon.update(req.body);
    res.json({
      id: addon.id.toString(),
      name: addon.name,
      category: addon.category,
      price: addon.price,
      inStock: addon.inStock
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an addon
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Addon.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Addon deleted' });
    } else {
      res.status(404).json({ message: 'Addon not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed default addons
router.post('/seed', async (req, res) => {
  try {
    const existing = await Addon.findAll();
    if (existing.length > 0) {
      return res.json({ message: 'Addons already seeded', count: existing.length });
    }
    const defaults = [
      { name: 'Rainbow Sprinkles', category: 'Toppings', price: 20, inStock: true },
      { name: 'Chocolate Chips', category: 'Toppings', price: 25, inStock: true },
      { name: 'Waffle Cone', category: 'Cones', price: 40, inStock: true },
      { name: 'Sugar Cone', category: 'Cones', price: 20, inStock: true },
      { name: 'Hot Fudge', category: 'Sauces', price: 30, inStock: true },
      { name: 'Caramel Drizzle', category: 'Sauces', price: 30, inStock: true },
    ];
    await Addon.bulkCreate(defaults);
    res.status(201).json({ message: 'Default addons seeded', count: defaults.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
