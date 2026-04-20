const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  loginCount: { type: Number, default: 1 },
  lastVisited: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
