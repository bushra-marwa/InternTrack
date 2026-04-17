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
    enum: ['pending', 'approved', 'rejected', 'In Progress', 'completed'],
    default: 'pending'
  },
  adminFeedback: {
  type: String,
  default: ''
},

  rejectionReason: { type: String, default: '' },

  // Final Evaluation Fields
  finalCertificate: { type: String, default: null },
  finalSummary: { type: String, default: '' },
  finalScore: { type: Number, default: 0 },
  finalMentorFeedback: { type: String, default: '' },
  finalEvaluationStatus: {
    type: String,
    enum: ['none', 'pending', 'completed'],
    default: 'none'
  }

}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);