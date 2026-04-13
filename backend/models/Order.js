import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    name: String,
    quantity: Number,
    price: String
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
