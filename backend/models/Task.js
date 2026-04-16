const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate:     { type: Date, required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status:      { type: String, enum: ['pending', 'in-progress', 'completed', 'overdue'], default: 'pending' },
  submissionLink: { type: String },
  feedback:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);