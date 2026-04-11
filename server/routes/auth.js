import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dream-cream-secret-key';
const ADMIN_EMAIL = "saikumar89515@gmail.com";

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await getDB();

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.email.split('@')[0]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Setup Initial Admin (One-time or helper)
router.post('/setup-admin', async (req, res) => {
  const { email, password } = req.body;
  const db = await getDB();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'admin']
    );
    res.json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'User already exists or error: ' + error.message });
  }
});

export default router;
