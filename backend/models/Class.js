const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  tutorIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  }],
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);
