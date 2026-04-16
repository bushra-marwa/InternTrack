const Evaluation = require('../models/Evaluation');

exports.createEvaluation = async (req, res) => {
  try {
    const ev = await Evaluation.create({ ...req.body, mentor: req.user._id });
    res.status(201).json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getEvaluations = async (req, res) => {
  try {
    const filter = req.user.role === 'student' ? { student: req.user._id } : {};
    const evals = await Evaluation.find(filter)
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort('-createdAt');
    res.json(evals);
  } catch (err) { res.status(500).json({ message: err.message }); }
};