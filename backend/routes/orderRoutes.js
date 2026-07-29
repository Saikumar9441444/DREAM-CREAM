const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['timestamp', 'DESC']] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = await Order.create({
      id: req.body.id || `ORD-${Math.floor(Math.random() * 100000)}`,
      customerName: req.body.customerName || 'Guest',
      phone: req.body.phone || 'N/A',
      address: req.body.address || 'N/A',
      tableNumber: req.body.tableNumber || null,
      deliveryType: req.body.deliveryType,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod || 'cod',
      status: req.body.status || 'Order Placed',
      timestamp: req.body.timestamp || new Date()
    });
    
    // Emit real-time event for new order
    const io = req.app.get('io');
    if (io) {
      io.emit('new-order', newOrder);
    }
    
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    await order.update({ status: req.body.status });
    
    // Emit real-time event for order update
    const io = req.app.get('io');
    if (io) {
      io.emit('order-updated', order);
    }
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
