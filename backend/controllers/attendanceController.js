const Attendance = require('../models/Attendance');

exports.markBulkAttendance = async (req, res) => {
  try {
    const { date, attendance } = req.body;
    const records = Object.entries(attendance).map(([student, status]) => ({
      student, status, date, markedBy: req.user._id,
    }));
    await Attendance.insertMany(records);
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id }).sort('date');
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.id })
      .populate('student', 'name email')
      .sort('date');
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};