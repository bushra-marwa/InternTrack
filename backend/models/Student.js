const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  college:          { type: String, default: '' },
  department:       { type: String, default: '' },
  internshipDomain: { type: String, default: '' },
  startDate:        { type: Date, default: null },
  endDate:          { type: Date, default: null },
  status:           { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  progress:         { type: Number, default: 0, min: 0, max: 100 },
  enrollmentNumber: { type: String, required: true, unique: true }
}, { timestamps: true });


module.exports = mongoose.model('Student', studentSchema);