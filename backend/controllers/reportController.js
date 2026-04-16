const Report = require('../models/Report')
const Internship = require('../models/Internship')
const Student = require('../models/Student')

// ✅ CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      student: req.user._id,
      status: 'approved'
    })

    if (!internship) {
      return res.status(403).json({ message: 'You need approved internship' })
    }

    const report = await Report.create({
      ...req.body,
      student: req.user._id,
      documentFile: req.file ? req.file.filename : null,
    })

    res.status(201).json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ STUDENT REPORTS
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ student: req.user._id })
      .populate('student', 'name email')
      .sort('-createdAt')

    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ MENTOR REPORTS (VERY IMPORTANT)
exports.getMentorReports = async (req, res) => {
  try {
    const students = await Student.find({ mentor: req.user._id })

    const studentIds = students.map(s => s.user)

    const reports = await Report.find({
      student: { $in: studentIds }
    })
      .populate('student', 'name email')
      .sort('-createdAt')

    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ EVALUATE REPORT
exports.evaluateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        feedback: req.body.feedback,
        score: req.body.score,
        status: 'evaluated',
        evaluatedBy: req.user._id
      },
      { new: true }
    ).populate('student', 'name email')

    if (!report) return res.status(404).json({ message: 'Report not found' })

    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}