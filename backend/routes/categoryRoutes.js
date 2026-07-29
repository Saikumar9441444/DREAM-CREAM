const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['createdAt', 'ASC']] });
    const names = categories.map(c => c.name);
    res.json(names);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const existing = await Category.findByPk(req.body.name);
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    const category = await Category.create({ name: req.body.name });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Seed default categories
router.post('/seed', async (req, res) => {
  try {
    const defaults = ['Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'];
    const existing = await Category.findAll();
    if (existing.length > 0) {
      return res.json({ message: 'Categories already seeded', count: existing.length });
    }
    const docs = defaults.map(name => ({ name }));
    await Category.bulkCreate(docs);
    res.status(201).json({ message: 'Default categories seeded', count: defaults.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a category by name
router.delete('/:name', async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { name: req.params.name } });
    if (deleted) {
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
