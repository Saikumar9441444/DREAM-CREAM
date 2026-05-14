const express = require('express');
const router = express.Router();

// Mock CMS content - in a real app, this might come from a database collection
const cmsContent = [
  { key: 'storyText', value: 'It began with an exhausting search for ice cream that tasted like memories—not chemicals. We tore up the rules of mass production and built Cream Dream on a single, unwavering promise: If we wouldn\'t serve it to our own family, we won\'t serve it to you.' },
  { key: 'missionTitle', value: 'A Return to Real Craft.' },
  { key: 'locationName', value: 'MG Road, Nellore' }
];

// GET /api/content
router.get('/', (req, res) => {
  try {
    res.json(cmsContent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
