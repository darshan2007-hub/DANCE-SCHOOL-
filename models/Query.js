const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  },
  response: {
    type: String,
    default: ''
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Query', querySchema);