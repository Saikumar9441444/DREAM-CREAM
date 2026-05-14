const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// GET all visitors (for Admin Analytics)
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastVisited: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST or Update visitor (on login/access)
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    let visitor = await Visitor.findOne({ email });
    if (visitor) {
      visitor.loginCount += 1;
      visitor.lastVisited = Date.now();
      await visitor.save();
    } else {
      visitor = new Visitor({ email });
      await visitor.save();
    }
    res.status(200).json(visitor);
  } catch (err) {
    console.error("Visitor tracking error (safe bypass):", err.message);
    res.status(200).json({ email: req.body.email, status: 'bypass' }); // Safe bypass to keep UI working
  }
});

module.exports = router;
