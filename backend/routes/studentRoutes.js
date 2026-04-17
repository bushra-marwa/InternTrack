const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Internship = require('../models/Internship');

router.use(protect);
router.get('/my-students', authorize('mentor'), async (req, res) => {
  try {
    // 1. Find all approved/in-progress/completed internships for this mentor
    const internships = await Internship.find({ 
      mentor: req.user._id, 
      status: { $in: ['approved', 'In Progress', 'completed'] } 
    })
      .populate('student', 'name email');

    // 2. Get the unique student details
    const results = [];
    const seen = new Set();

    for (const i of internships) {
      if (!i.student) continue;
      const studentId = i.student._id.toString();
      
      // If we haven't seen this student for this mentor yet, add their profile
      if (!seen.has(studentId)) {
        const profile = await Student.findOne({ user: i.student._id });
        if (profile) {
          results.push({
            ...profile.toObject(),
            user: i.student,
            internshipDomain: i.domain // Show the domain specific to this mentor's assignment
          });
          seen.add(studentId);
        }
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin sees all students
router.get('/', authorize('admin'), async (req, res) => {
  try {
   const students = await Student.find()
      .populate('user', 'name email')
      .populate('mentor', 'name email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student sees their own profile
router.get('/me', async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('mentor', 'name email');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('admin'), async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/requests', authorize('admin'), async (req, res) => {
  try {
    const students = await Student.find({ status: 'pending' })
      .populate('user', 'name email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email')
      .populate('mentor', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;