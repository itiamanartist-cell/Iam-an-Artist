const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Video', 'Image', 'Document'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    // Store Cloudinary public_id to enable easy deletion
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
