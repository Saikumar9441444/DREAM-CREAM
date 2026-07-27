const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// POST a new enquiry
router.post('/', async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const savedEnquiry = await newEnquiry.save();
    res.status(201).json(savedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ timestamp: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update enquiry status
router.put('/:id', async (req, res) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    res.json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
