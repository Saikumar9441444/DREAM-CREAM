require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Make io accessible in routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingRoutes = require('./routes/settingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const addonRoutes = require('./routes/addonRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database connection & Server initialization
const startServer = async () => {
  // Connect to database
  await connectDB();
  
  // Sync models with MySQL database
  try {
    await sequelize.sync({ alter: true });
    console.log('All MySQL models synchronized successfully.');

    // Automatically sync the 55 default premium products with 4K images in the MySQL database
    const Product = require('./models/Product');
    try {
      const seedData = require('./seedData');
      for (const item of seedData) {
        const [prod, created] = await Product.findOrCreate({
          where: { id: item.id },
          defaults: {
            name: item.name,
            price: item.price,
            category: item.category,
            image: item.image,
            inStock: true
          }
        });
        if (!created) {
          // If it exists, update it to use the new premium 4K image if it was previously set to generic '/dairy.png'
          if (prod.image === '/dairy.png' || prod.image.includes('placeholder') || item.image.includes('shake') || prod.price !== item.price) {
            await prod.update({
              image: item.image,
              price: item.price,
              category: item.category
            });
          }
        }
      }
      console.log('MySQL Database synchronized with 55 premium products successfully.');
    } catch (dbErr) {
      console.error('Failed to synchronize product database on startup:', dbErr.message);
    }
  } catch (error) {
    console.error('Failed to sync MySQL models:', error);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
