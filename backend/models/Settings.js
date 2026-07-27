const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    default: 'Cream Dream'
  },
  whatsappNumber: {
    type: String,
    required: true,
    default: '919014002314'
  },
  openingHours: {
    type: String,
    default: '10:00 AM - 11:00 PM'
  },
  currency: {
    type: String,
    default: '₹'
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
