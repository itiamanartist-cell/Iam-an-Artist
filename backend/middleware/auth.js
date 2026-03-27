const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'temporary_jwt_secret_render_key_123';
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};

const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'Teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Teacher' });
  }
};

const isTeacherOrAdmin = (req, res, next) => {
  if (req.user && ['Admin', 'Teacher'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
};

module.exports = { verifyToken, isAdmin, isTeacher, isTeacherOrAdmin };
