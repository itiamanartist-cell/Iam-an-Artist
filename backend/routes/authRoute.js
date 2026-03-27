const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const AnalyticsLog = require('../models/AnalyticsLog');

// Generate JWT function
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'temporary_jwt_secret_render_key_123';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Log analytics
      await AnalyticsLog.create({
        user: user._id,
        action: 'Login'
      });

      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
