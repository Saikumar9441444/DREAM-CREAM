import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  section: { type: String, required: true }, // e.g., 'Hero', 'About'
  key: { type: String, required: true },     // e.g., 'title', 'description'
  value: { type: String, required: true },
  type: { type: String, default: 'text' },   // 'text', 'image', 'color'
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('SiteContent', siteContentSchema);
