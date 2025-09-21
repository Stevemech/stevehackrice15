const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Get all videos
router.get('/', authMiddleware, async (req, res) => {
  res.json({ message: 'Videos endpoint', videos: [] });
});

module.exports = router;