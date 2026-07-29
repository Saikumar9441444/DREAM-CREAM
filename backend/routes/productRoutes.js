const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create({
      id: req.body.id || `PRD-${Date.now()}`,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image || '/dairy.png',
      inStock: req.body.inStock !== undefined ? req.body.inStock : true
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Seed products from default list
router.post('/seed', async (req, res) => {
  try {
    const existing = await Product.findAll();
    if (existing.length > 0) {
      return res.json({ message: 'Products already seeded', count: existing.length });
    }

    const defaultProducts = [
      { id: 'p1', name: 'Belgian Dark Chocolate', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p2', name: 'Classic Vanilla Bean', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p3', name: 'Strawberry Swirl', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p4', name: 'Butterscotch Bliss', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p5', name: 'Mango Tango', price: 332, category: 'Sorbet', image: '/dairy.png' },
      { id: 'p6', name: 'Mint Chocolate Chip', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p7', name: 'Cookies and Cream', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p8', name: 'Pistachio Delight', price: 415, category: 'Specialty', image: '/dairy.png' },
      { id: 'p9', name: 'Salted Caramel', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p10', name: 'Coconut Paradise', price: 332, category: 'Vegan', image: '/dairy.png' },
      { id: 'p11', name: 'Raspberry Ripple', price: 332, category: 'Sorbet', image: '/dairy.png' },
      { id: 'p12', name: 'Coffee Crunch', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p13', name: 'Hazelnut Praline', price: 415, category: 'Specialty', image: '/dairy.png' },
      { id: 'p14', name: 'Blueberry Cheesecake', price: 415, category: 'Specialty', image: '/dairy.png' },
      { id: 'p15', name: 'Peanut Butter Cup', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p16', name: 'Lemon Zest Sorbet', price: 332, category: 'Sorbet', image: '/dairy.png' },
      { id: 'p17', name: 'Red Velvet', price: 415, category: 'Specialty', image: '/dairy.png' },
      { id: 'p18', name: 'Matcha Green Tea', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p19', name: 'Almond Fudge', price: 373, category: 'Dairy', image: '/dairy.png' },
      { id: 'p20', name: 'Cotton Candy Dream', price: 332, category: 'Dairy', image: '/dairy.png' },
      { id: 'p21', name: 'Chocolate Milkshake', price: 249, category: 'Milkshake', image: '/milkshake.png' },
      { id: 'p22', name: 'Vanilla Milkshake', price: 249, category: 'Milkshake', image: '/milkshake.png' },
      { id: 'p23', name: 'Strawberry Milkshake', price: 249, category: 'Milkshake', image: '/milkshake.png' },
      { id: 'p24', name: 'Oreo Thick Shake', price: 299, category: 'Thick Shake', image: '/thick_shake.png' },
      { id: 'p25', name: 'KitKat Thick Shake', price: 299, category: 'Thick Shake', image: '/thick_shake.png' },
    ];

    await Product.bulkCreate(defaultProducts);
    res.status(201).json({ message: 'Default products seeded', count: defaultProducts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
