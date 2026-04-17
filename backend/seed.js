const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const initialProducts = [
  { name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: 373, image: '/dairy.png', hue: 0 },
  { name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: 373, image: '/belgian_dark_chocolate.png', hue: 0 },
  { name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: 373, image: '/strawberry_dream.png', hue: 0 },
  { name: 'Mint Choc Chip', category: 'Dairy', rating: 4.5, price: 373, image: '/mint_choc_chip.png', hue: 0 },
  { name: 'Cookies n Cream', category: 'Dairy', rating: 4.9, price: 373, image: '/cookies_n_cream.png', hue: 0 },
  { name: 'Oat Milk Vanilla', category: 'Vegan', rating: 4.6, price: 415, image: '/vegan.png', hue: 0 },
  { name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: 332, image: '/sorbet.png', hue: 0 },
  { name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: 498, image: '/specialty.png', hue: 0 }
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
  }
  
  // Mask password for safe logging
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log('🔌 Attempting connection to:', maskedUri);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected! Wiping old data...');
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log('🚀 Database Seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ MongoDB Auth Failed!');
    console.error('Error Details:', err.message);
    process.exit(1);
  }
};

seedDB();
