const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);


// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cream_dream')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.env.DB_STATUS = 'disconnected';
  });

app.get('/', (req, res) => {
  res.send('Cream Dream API is running...');
});

app.get('/health', (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    database: status,
    timestamp: new Date()
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
