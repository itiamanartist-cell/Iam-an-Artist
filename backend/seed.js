require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  const username = 'admin';
  const password = 'admin123';

  const existing = await User.findOne({ username });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  await User.create({ username, password: hashed, role: 'Admin' });
  console.log(`✅ Admin created!\n  Username: ${username}\n  Password: ${password}`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
