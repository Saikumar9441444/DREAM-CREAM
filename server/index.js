import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Models
import Product from './models/Product.js';
import Order from './models/Order.js';
import Visitor from './models/Visitor.js';
import SiteContent from './models/SiteContent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dream-cream-peach.vercel.app', // Explicit Production URL
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or in the allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API ROUTES ---

// 0. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 1. PRODUCTS (FLAVORS)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 3. VISITORS (ANALYTICS)
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisited: -1 });
    res.json(visitors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/visitors', async (req, res) => {
  const { email, displayName } = req.body;
  try {
    let visitor = await Visitor.findOne({ email });
    if (visitor) {
      visitor.lastVisited = new Date();
      visitor.loginCount += 1;
      await visitor.save();
    } else {
      visitor = new Visitor({ email, displayName });
      await visitor.save();
    }
    res.status(200).json(visitor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 4. SITE CONTENT (CMS)
app.get('/api/content', async (req, res) => {
  try {
    const content = await SiteContent.find();
    res.json(content);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/content', async (req, res) => {
  const { section, key, value } = req.body;
  try {
    const filter = { section, key };
    const update = { value, updatedAt: new Date() };
    const result = await SiteContent.findOneAndUpdate(filter, update, { upsert: true, new: true });
    res.json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Server Listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 MERN Server running on http://localhost:${PORT}`);
  });
}

export default app;
