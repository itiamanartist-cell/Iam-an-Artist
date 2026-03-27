const express = require('express');
const router = express.Router();
const AnalyticsLog = require('../models/AnalyticsLog');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All analytics routes require Admin
router.use(verifyToken, isAdmin);

// @desc    Get all logs (populated)
// @route   GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const logs = await AnalyticsLog.find({})
      .populate('user', 'username email')
      .populate('contentId', 'title')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
