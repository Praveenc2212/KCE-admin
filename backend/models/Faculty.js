const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    enum: ["TUTOR", "STAFF", "HOD", "ADMIN", "PRINCIPLE", "SECURITY"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Faculty', facultySchema);
