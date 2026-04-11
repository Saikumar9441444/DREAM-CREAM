import express from 'express';
import { getDB } from '../database.js';

const router = express.Router();

// Public: Get all products
router.get('/products', async (req, res) => {
  const db = await getDB();
  try {
    const products = await db.all('SELECT * FROM products ORDER BY createdAt DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Add product
router.post('/products', async (req, res) => {
  const db = await getDB();
  const { name, category, price, rating, image, hue } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO products (name, category, price, rating, image, hue) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, price, rating, image, hue]
    );
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update product
router.put('/products/:id', async (req, res) => {
  const db = await getDB();
  const { name, category, price, rating, image, hue } = req.body;
  try {
    await db.run(
      'UPDATE products SET name = ?, category = ?, price = ?, rating = ?, image = ?, hue = ? WHERE id = ?',
      [name, category, price, rating, image, hue, req.params.id]
    );
    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete product
router.delete('/products/:id', async (req, res) => {
  const db = await getDB();
  try {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
