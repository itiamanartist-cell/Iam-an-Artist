const mongoose = require('mongoose');

const analyticsLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['Login', 'ViewContent'],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsLog', analyticsLogSchema);
