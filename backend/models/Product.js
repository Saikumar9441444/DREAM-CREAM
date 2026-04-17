const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true }, // Stored as number, e.g. 373
  image: { type: String, required: true },
  hue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
