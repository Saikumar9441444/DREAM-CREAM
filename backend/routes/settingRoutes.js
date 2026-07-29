const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get settings (we'll just use one document for the whole app)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Create default settings if none exist
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      await settings.update({
        storeName: req.body.storeName || settings.storeName,
        whatsappNumber: req.body.whatsappNumber || settings.whatsappNumber,
        openingHours: req.body.openingHours || settings.openingHours,
        currency: req.body.currency || settings.currency
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
