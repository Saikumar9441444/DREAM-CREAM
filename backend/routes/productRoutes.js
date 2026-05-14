const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const initialProducts = [
  { name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: 373, image: '/dairy.png', hue: 0 },
  { name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: 373, image: '/belgian_dark_chocolate.png', hue: 0 },
  { name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: 373, image: '/strawberry_dream.png', hue: 0 },
  { name: 'Oat Milk Vanilla', category: 'Vegan', rating: 4.6, price: 415, image: '/vegan.png', hue: 0 },
  { name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: 332, image: '/sorbet.png', hue: 0 },
  { name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: 498, image: '/specialty.png', hue: 0 }
];

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    if (products.length === 0) {
      return res.json(initialProducts); // Return fallback if DB is empty
    }
    res.json(products);
  } catch (err) {
    console.error("Product fetch error, using fallback:", err.message);
    res.json(initialProducts); // Return fallback on error to keep UI alive
  }
});

// POST a new product (Admin)
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (Update) a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
