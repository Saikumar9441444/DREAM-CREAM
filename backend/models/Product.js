import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  image: { type: String, default: '/dairy.png' },
  hue: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Performance Indexes for Ultra-Fast Queries
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: -1 });
productSchema.index({ name: 'text' }); 

export default mongoose.model('Product', productSchema);
