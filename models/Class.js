const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 20
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: {
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: {
      type: String,
      required: true
    }
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  category: {
    type: String,
    required: true,
    enum: ['Ballet', 'Hip Hop', 'Contemporary', 'Jazz', 'Salsa', 'Ballroom', 'Classical']
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);