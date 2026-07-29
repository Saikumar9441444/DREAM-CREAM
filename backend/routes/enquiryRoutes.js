const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// POST a new enquiry
router.post('/', async (req, res) => {
  try {
    const savedEnquiry = await Enquiry.create(req.body);
    res.status(201).json(savedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({ order: [['timestamp', 'DESC']] });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update enquiry status
router.put('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    
    await enquiry.update(req.body);
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
