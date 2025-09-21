const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// Get daily questions
router.get('/daily', authMiddleware, async (req, res) => {
  res.json({ message: 'Daily questions endpoint', questions: [] });
});

module.exports = router;