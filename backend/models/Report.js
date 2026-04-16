const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  week: Number,
  title: String,
  summary: String,
  link: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  feedback: String,
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);