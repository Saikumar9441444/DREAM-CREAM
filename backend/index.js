import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dream_cream_secret_sql_2026';

// 1. Performance & Security Middlewares
app.use(helmet({ 
  contentSecurityPolicy: false, 
}));
app.use(compression());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://dream-cream-peach.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

console.log('🚀 SQL Server initialized with Prisma');

// --- API ROUTES ---

// 0. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    engine: 'Prisma + SQLite',
    timestamp: new Date()
  });
});

// 1. AUTHENTICATION
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // For demo, we check plain text if hashing isn't fully seeded yet
    // In production, always use bcrypt.compare
    const isMatch = (password === user.password); 
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { email: user.email, name: user.name, role: user.role } 
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. PRODUCTS (FLAVORS)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.flavor.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await prisma.flavor.create({ data: req.body });
    res.status(201).json(newProduct);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await prisma.flavor.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.flavor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { total, ...rest } = req.body;
    const data = { 
      ...rest, 
      totalPrice: total || 0 
    };
    if (typeof data.items !== 'string') data.items = JSON.stringify(data.items);
    
    const newOrder = await prisma.order.create({ data });
    res.status(201).json(newOrder);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Server Listen
app.listen(PORT, () => {
  console.log(`🚀 SQL Backend running on http://localhost:${PORT}`);
});

export default app;
