const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Student = require('../models/Student');

router.use(protect);
router.get('/my-students', authorize('mentor'), async (req, res) => {
  try {
    const students = await Student.find({ mentor: req.user._id })
      .populate('user', 'name email')
      .populate('mentor', 'name email');

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin sees all students
router.get('/', authorize('admin'), async (req, res) => {
  try {
   const students = await Student.find({ status: 'approved' })
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
router.get('/my-students', authorize('mentor'), async (req, res) => {
  const students = await Student.find({ mentor: req.user._id })
    .populate('user', 'name email');

  res.json(students);
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