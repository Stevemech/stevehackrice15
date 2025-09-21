const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Get user progress
router.get('/', authMiddleware, async (req, res) => {
  res.json({ message: 'Progress endpoint', progress: {} });
});

module.exports = router;