const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message:   { type: String, required: true },
  type:      { 
    type: String, 
    enum: ['report_submitted', 'report_evaluated', 'internship_request', 'final_submission', 'final_evaluated'], 
    required: true 
  },
  isRead:    { type: Boolean, default: false },
  link:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
