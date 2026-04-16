 const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  company: String,
  domain: String,
  location: String,
  duration: String,

  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminFeedback: {
  type: String,
  default: ''
},

  rejectionReason: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);