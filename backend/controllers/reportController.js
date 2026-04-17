const Report = require('../models/Report')
const Internship = require('../models/Internship')
const Student = require('../models/Student')
const Notification = require('../models/Notification')

// ✅ CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.body.internship,
      student: req.user._id,
      status: { $in: ['approved', 'In Progress'] }
    });

    if (!internship) {
      return res.status(403).json({ message: 'You need an approved internship for the selected id' });
    }

    const report = await Report.create({
      ...req.body,
      student: req.user._id,
      internship: internship._id,
      documentFile: req.file ? req.file.filename : null,
    })

    // Notify Mentor
    if (internship.mentor) {
      await Notification.create({
        recipient: internship.mentor,
        sender: req.user._id,
        message: `Student ${req.user.name} submitted Week ${report.week} report for ${internship.company}.`,
        type: 'report_submitted',
        link: `/reports`
      });
    }

    res.status(201).json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ STUDENT REPORTS
exports.getReports = async (req, res) => {
  try {
    const { internshipId } = req.query;
    const filter = { student: req.user._id };
    if (internshipId) filter.internship = internshipId;

    const reports = await Report.find(filter)
      .populate('student', 'name email')
      .populate('internship')
      .sort('-createdAt')

    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ MENTOR REPORTS (VERY IMPORTANT)
// ✅ MENTOR REPORTS (RETRIEVE ALL OR FILTER BY STUDENT)
exports.getMentorReports = async (req, res) => {
  try {
    const { studentId, internshipId } = req.query;
    
    // 1. Find all relevant internships for this mentor to determine which students they can access
    const mentorInternships = await Internship.find({ 
      mentor: req.user._id, 
      status: { $in: ['approved', 'In Progress', 'completed'] } 
    });
    const assignedStudentUserIds = [...new Set(mentorInternships.map(i => i.student.toString()))];

    // Case A: Filtering by a specific student
    if (studentId) {
      // Check if this mentor has ANY approved internship with this student
      if (!assignedStudentUserIds.includes(studentId)) {
        return res.status(403).json({ message: 'Student not assigned to you via any approved internship' });
      }
      
      const filter = { student: studentId };
      // If a specific internship is requested, use it, otherwise show all of Joe's reports for this mentor
      if (internshipId) {
        filter.internship = internshipId;
      } else {
        // Only show reports associated with internships assigned to THIS mentor
        const allowedInternshipIds = mentorInternships
          .filter(i => i.student.toString() === studentId)
          .map(i => i._id);
        filter.internship = { $in: allowedInternshipIds };
      }

      const reports = await Report.find(filter)
        .populate('student', 'name email')
        .populate('internship')
        .sort('-createdAt');
      return res.json(reports);
    }

    // Case B: Default - Get all reports for all students the mentor is responsible for
    const allowedInternshipIds = mentorInternships.map(i => i._id);
    const filter = { internship: { $in: allowedInternshipIds } };

    const reports = await Report.find(filter)
      .populate('student', 'name email')
      .populate('internship')
      .sort('-createdAt');

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    // Notify Student
    await Notification.create({
      recipient: report.student._id,
      sender: req.user._id,
      message: `Your Week ${report.week} report has been evaluated by your mentor.`,
      type: 'report_evaluated',
      link: `/my-reports`
    });

    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}