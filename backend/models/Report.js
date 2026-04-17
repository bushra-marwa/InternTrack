const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },

  week: Number,
  title: String,
  summary: String,
  link: String,
  documentFile: String,

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'evaluated'],
    default: 'pending'
  },

  feedback: String,
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);