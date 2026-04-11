import { getDB } from './database.js';
import bcrypt from 'bcryptjs';

const photoUrls = {
  Dairy: '/dairy.png',
  Vegan: '/vegan.png',
  Sorbet: '/sorbet.png',
  Specialty: '/specialty.png',
  Chocolate: '/belgian_dark_chocolate.png',
  Strawberry: '/strawberry_dream.png',
  Mint: '/mint_choc_chip.png',
  Cookies: '/cookies_n_cream.png',
  Pecan: '/butter_pecan.png',
  Coffee: '/coffee_caramel.png',
  Rocky: '/rocky_road.png',
  Pistachio: '/pistachio_delight.png',
  Cake: '/cake_batter.png',
  Matcha: '/coconut_matcha.png',
  Cashew: '/cashew_caramel.png',
  Almond: '/almond_butter_crunch.png',
  OatStrawberry: '/oat_milk_strawberry.png',
  Milkshake: '/milkshake.png',
  ThickShake: '/thick_shake.png',
};

const products = [
  { name: 'Classic Vanilla Bean', category: 'Dairy', rating: 4.8, price: '₹373', image: photoUrls.Dairy, hue: 0 },
  { name: 'Belgian Dark Chocolate', category: 'Dairy', rating: 4.9, price: '₹373', image: photoUrls.Chocolate, hue: 0 },
  { name: 'Strawberry Dream', category: 'Dairy', rating: 4.7, price: '₹373', image: photoUrls.Strawberry, hue: 0 },
  { name: 'Mint Choc Chip', category: 'Dairy', rating: 4.5, price: '₹373', image: photoUrls.Mint, hue: 0 },
  { name: 'Cookies n Cream', category: 'Dairy', rating: 4.9, price: '₹373', image: photoUrls.Cookies, hue: 0 },
  { name: 'Butter Pecan', category: 'Dairy', rating: 4.6, price: '₹373', image: photoUrls.Pecan, hue: 0 },
  { name: 'Coffee Caramel', category: 'Dairy', rating: 4.8, price: '₹373', image: photoUrls.Coffee, hue: 0 },
  { name: 'Rocky Road', category: 'Dairy', rating: 4.4, price: '₹373', image: photoUrls.Rocky, hue: 0 },
  { name: 'Pistachio Delight', category: 'Dairy', rating: 4.7, price: '₹373', image: photoUrls.Pistachio, hue: 0 },
  { name: 'Cake Batter', category: 'Dairy', rating: 4.5, price: '₹373', image: photoUrls.Cake, hue: 0 },
  // ... Adding more key items for initial feel
  { name: 'Mango Tango', category: 'Sorbet', rating: 4.9, price: '₹332', image: photoUrls.Sorbet, hue: 0 },
  { name: 'Lavender Honey', category: 'Specialty', rating: 4.9, price: '₹498', image: photoUrls.Specialty, hue: 0 },
  { name: 'Nutella Brownie Thick Shake', category: 'Thick Shake', rating: 5.0, price: '₹350', image: photoUrls.ThickShake, hue: 0 },
];

export async function seedDB() {
  const db = await getDB();

  // 1. Seed Admin User
  const adminEmail = "saikumar89515@gmail.com";
  const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [adminEmail, hashedPassword, 'admin']
    );
    console.log('👤 Admin user seeded: saikumar89515@gmail.com / admin123');
  }

  // 2. Seed Products
  const productCount = await db.get('SELECT COUNT(*) as count FROM products');
  if (productCount.count === 0) {
    for (const p of products) {
      await db.run(
        'INSERT INTO products (name, category, price, rating, image, hue) VALUES (?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.price, p.rating, p.image, p.hue]
      );
    }
    console.log(`🍦 Seeded ${products.length} products`);
  }
}
