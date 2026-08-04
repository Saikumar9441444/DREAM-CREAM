const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ─── WhatsApp Notification via CallMeBot (free) ───────────────────────────────
const sendWhatsAppAlert = async (message, targetPhone = null) => {
  let phone = targetPhone || process.env.WHATSAPP_PHONE || '919014002314';
  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    console.log('[WhatsApp] No API key set — skipping WhatsApp notification.');
    return;
  }

  // Auto-format phone: If 10 digits, prepend 91 (India country code)
  if (phone && phone.replace(/\D/g, '').length === 10) {
    phone = '91' + phone.replace(/\D/g, '');
  } else if (phone) {
    phone = phone.replace(/\D/g, ''); // strip any + or spaces
  }

  try {
    const encoded = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (response.ok) {
      console.log(`[WhatsApp] Notification sent to ${phone} successfully.`);
    } else {
      console.warn(`[WhatsApp] Failed to send to ${phone}. Status:`, response.status);
    }
  } catch (err) {
    console.warn(`[WhatsApp] Error sending notification to ${phone}:`, err.message);
  }
};

// ─── Get all orders ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['timestamp', 'DESC']] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Create a new order ───────────────────────────────────────────────────────
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

    // Send WhatsApp alert to admin
    const itemsList = (req.body.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
    const source = req.body.tableNumber ? `Table ${req.body.tableNumber}` : (req.body.deliveryType || 'Takeaway');
    const waMessage =
      `🍦 *NEW ORDER - Cream Dream*\n` +
      `Order ID: ${newOrder.id}\n` +
      `Source: ${source}\n` +
      `Items: ${itemsList}\n` +
      `Total: ₹${req.body.totalAmount}\n` +
      `Payment: ${req.body.paymentMethod || 'COD'}\n` +
      `Customer: ${req.body.customerName || 'Guest'} | ${req.body.phone || 'N/A'}\n` +
      `👉 Open Admin Panel to approve!`;

    sendWhatsAppAlert(waMessage); // fire-and-forget

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── Approve order (admin sets ETA) ──────────────────────────────────────────
router.put('/:id/approve', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const estimatedMinutes = req.body.estimatedMinutes || 15;
    await order.update({ status: 'Approved', estimatedMinutes });

    // Notify customer in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('order-approved', {
        id: order.id,
        estimatedMinutes,
        customerName: order.customerName
      });
      io.emit('order-updated', order);
    }

    // Send customer WhatsApp confirmation alert
    if (order.phone && order.phone !== 'N/A') {
      try {
        let itemsList = '';
        if (Array.isArray(order.items)) {
          itemsList = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
        } else if (typeof order.items === 'string') {
          try {
            const parsedItems = JSON.parse(order.items);
            itemsList = parsedItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
          } catch (e) {
            itemsList = order.items;
          }
        }

        const customerMessage = 
          `🍦 *Cream Dream Confirmation*\n` +
          `Welcome to Cream Dream, ${order.customerName}! Thank you for your order.\n\n` +
          `Order ID: ${order.id}\n` +
          `Items: ${itemsList}\n` +
          `Estimated Prep Time: ~${estimatedMinutes} mins\n` +
          `Total Amount: ₹${order.totalAmount}\n\n` +
          `We will alert you as soon as it is ready! ✨`;

        sendWhatsAppAlert(customerMessage, order.phone);
      } catch (err) {
        console.warn('[WhatsApp Customer Confirmation] Error:', err.message);
      }
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── Mark order as Ready (kitchen done) ──────────────────────────────────────
router.put('/:id/ready', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status: 'Ready' });

    // Notify customer in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('order-ready', {
        id: order.id,
        deliveryType: order.deliveryType,
        tableNumber: order.tableNumber,
        customerName: order.customerName
      });
      io.emit('order-updated', order);
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── Update order status (generic) ───────────────────────────────────────────
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

// ─── Clear all orders (fresh reset) ──────────────────────────────────────────
router.post('/clear', async (req, res) => {
  try {
    await Order.destroy({ truncate: true, cascade: true });
    // Emit event to update all open admin dashboards instantly
    const io = req.app.get('io');
    if (io) {
      io.emit('order-updated', {});
    }
    res.json({ message: 'All orders cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
