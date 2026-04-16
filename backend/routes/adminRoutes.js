const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Student = require('../models/Student');
const { approveInternship, rejectInternship } = require('../controllers/internshipController');

// approve
router.put('/internship/:id/approve', protect, authorize('admin'), approveInternship);

// reject
router.put('/internship/:id/reject', protect, authorize('admin'), rejectInternship);


// ✅ GET APPROVED STUDENTS ONLY
router.get('/students', protect, authorize('admin'), async (req, res) => {
  try {
    const students = await Student.find({ status: 'approved' })   // ✅ only approved
      .populate('user', 'name email')
      .populate('mentor', 'name email department');

    res.json(students);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET ALL MENTORS
router.get('/mentors', protect, authorize('admin'), async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ ALLOT MENTOR TO STUDENT
router.put('/allot-mentor', protect, authorize('admin'), async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { mentor: mentorId },
      { returnDocument: 'after' }   // ✅ latest mongoose fix
    ).populate('mentor', 'name email department');

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE STUDENT
router.delete('/student/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 🔥 also delete linked user (clean DB)
    await User.findByIdAndDelete(student.user);

    await student.deleteOne();

    res.json({ message: 'Student deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;