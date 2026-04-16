const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week:            { type: Number, required: true },
  technicalSkills: { type: Number, min: 1, max: 10, required: true },
  communication:   { type: Number, min: 1, max: 10, required: true },
  teamwork:        { type: Number, min: 1, max: 10, required: true },
  punctuality:     { type: Number, min: 1, max: 10, required: true },
  overallScore:    { type: Number },
  remarks:         { type: String },
}, { timestamps: true });

evaluationSchema.pre('save', function (next) {
  this.overallScore = parseFloat(
    ((this.technicalSkills + this.communication + this.teamwork + this.punctuality) / 4).toFixed(1)
  );
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);