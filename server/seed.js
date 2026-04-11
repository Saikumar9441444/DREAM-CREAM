import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  // DAIRY (10)
  { name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: '₹373', image: '/dairy.png', hue: 0 },
  { name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: '₹373', image: '/belgian_dark_chocolate.png', hue: 0 },
  { name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: '₹373', image: '/strawberry_dream.png', hue: 0 },
  { name: 'Mint Choc Chip', category: 'Dairy', rating: 4.5, price: '₹373', image: '/mint_choc_chip.png', hue: 0 },
  { name: 'Cookies n Cream', category: 'Dairy', rating: 4.9, price: '₹373', image: '/cookies_n_cream.png', hue: 0 },
  { name: 'Butter Pecan', category: 'Dairy', rating: 4.6, price: '₹373', image: '/butter_pecan.png', hue: 0 },
  { name: 'Coffee Caramel', category: 'Dairy', rating: 4.8, price: '₹373', image: '/coffee_caramel.png', hue: 0 },
  { name: 'Rocky Road', category: 'Dairy', rating: 4.4, price: '₹373', image: '/rocky_road.png', hue: 0 },
  { name: 'Pistachio Delight', category: 'Dairy', rating: 4.7, price: '₹373', image: '/pistachio_delight.png', hue: 0 },
  { name: 'Cake Batter', category: 'Dairy', rating: 4.5, price: '₹373', image: '/cake_batter.png', hue: 0 },

  // VEGAN (10)
  { name: 'Oat Milk Vanilla', category: 'Vegan', rating: 4.6, price: '₹415', image: '/vegan.png', hue: 0 },
  { name: 'Coconut Matcha', category: 'Vegan', rating: 4.8, price: '₹415', image: '/coconut_matcha.png', hue: 0 },
  { name: 'Cashew Caramel', category: 'Vegan', rating: 4.7, price: '₹415', image: '/cashew_caramel.png', hue: 0 },
  { name: 'Almond Butter Crunch', category: 'Vegan', rating: 4.9, price: '₹415', image: '/almond_butter_crunch.png', hue: 0 },
  { name: 'Oat Milk Strawberry', category: 'Vegan', rating: 4.4, price: '₹415', image: '/oat_milk_strawberry.png', hue: 0 },
  { name: 'Vegan Mint Chip', category: 'Vegan', rating: 4.5, price: '₹415', image: '/mint_choc_chip.png', hue: -40 },
  { name: 'Dark Chocolate Cherry', category: 'Vegan', rating: 4.8, price: '₹415', image: '/belgian_dark_chocolate.png', hue: 320 },
  { name: 'Coconut Pineapple', category: 'Vegan', rating: 4.6, price: '₹415', image: '/vegan.png', hue: 60 },
  { name: 'Vegan Peanut Butter', category: 'Vegan', rating: 4.7, price: '₹415', image: '/butter_pecan.png', hue: -20 },
  { name: 'Maple Pecan Oat', category: 'Vegan', rating: 4.5, price: '₹415', image: '/coffee_caramel.png', hue: 45 },

  // SORBET (10)
  { name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: '₹332', image: '/sorbet.png', hue: 0 },
  { name: 'Raspberry Lemonade', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/strawberry_dream.png', hue: -40 },
  { name: 'Passionfruit Paradise', category: 'Sorbet', rating: 4.8, price: '₹332', image: '/sorbet.png', hue: -30 },
  { name: 'Blood Orange', category: 'Sorbet', rating: 4.6, price: '₹332', image: '/sorbet.png', hue: -60 },
  { name: 'Zesty Lemon', category: 'Sorbet', rating: 4.5, price: '₹332', image: '/cake_batter.png', hue: 30 },
  { name: 'Wild Berry', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/oat_milk_strawberry.png', hue: -80 },
  { name: 'Watermelon Mint', category: 'Sorbet', rating: 4.8, price: '₹332', image: '/mint_choc_chip.png', hue: 140 },
  { name: 'Pineapple Basil', category: 'Sorbet', rating: 4.4, price: '₹332', image: '/coconut_matcha.png', hue: 60 },
  { name: 'Peach Cobbler Sorbet', category: 'Sorbet', rating: 4.6, price: '₹332', image: '/cashew_caramel.png', hue: -25 },
  { name: 'Grapefruit Campari', category: 'Sorbet', rating: 4.7, price: '₹332', image: '/sorbet.png', hue: 30 },

  // SPECIALTY (10)
  { name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: '₹498', image: '/specialty.png', hue: 0 },
  { name: 'Salted Caramel Truffle', category: 'Specialty', rating: 5.0, price: '₹498', image: '/cashew_caramel.png', hue: 20 },
  { name: 'Bourbon Pecan Pie', category: 'Specialty', rating: 4.8, price: '₹498', image: '/butter_pecan.png', hue: 10 },
  { name: 'Earl Grey Tea', category: 'Specialty', rating: 4.7, price: '₹498', image: '/coffee_caramel.png', hue: -20 },
  { name: 'Saffron Pistachio', category: 'Specialty', rating: 4.9, price: '₹498', image: '/pistachio_delight.png', hue: 30 },
  { name: 'Rosewater Cardamom', category: 'Specialty', rating: 4.6, price: '₹498', image: '/specialty.png', hue: 200 },
  { name: 'Black Sesame', category: 'Specialty', rating: 4.8, price: '₹498', image: '/rocky_road.png', hue: -180 },
  { name: 'Matcha White Chocolate', category: 'Specialty', rating: 4.7, price: '₹498', image: '/coconut_matcha.png', hue: -20 },
  { name: 'Balsamic Strawberry', category: 'Specialty', rating: 4.5, price: '₹498', image: '/strawberry_dream.png', hue: -20 },
  { name: 'Tiramisu Gelato', category: 'Specialty', rating: 4.9, price: '₹498', image: '/coffee_caramel.png', hue: 15 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas for seeding');
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    await Product.insertMany(products);
    console.log(`🍦 Successfully seeded ${products.length} products`);
    
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
