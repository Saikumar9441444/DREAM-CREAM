import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SiteContent from './models/SiteContent.js';

dotenv.config();

const contents = [
  { section: 'Hero', key: 'heroTitle', value: 'Experience the Magic in Every Scoop' },
  { section: 'Hero', key: 'heroSubtitle', value: 'Artisan flavors crafted with passion, served with a smile. Your cinematic escape into the world of premium desserts.' },
  { section: 'About', key: 'storyText', value: 'Born from a dream to create the most decadent ice cream experience on the planet. Our journey started in a small kitchen with a big vision: to blend the finest local ingredients with cinematic imagination.' },
  { section: 'Profile', key: 'adminName', value: 'Master Control Center' },
  { section: 'Profile', key: 'adminGender', value: 'male' }
];

const seedCMS = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected for CMS seeding');
    
    for (const item of contents) {
      await SiteContent.findOneAndUpdate(
        { section: item.section, key: item.key },
        item,
        { upsert: true }
      );
    }
    
    console.log('✨ CMS Content Initialized');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCMS();
