const Internship = require('../models/Internship');
const Student = require('../models/Student');


// ✅ 1. SUBMIT INTERNSHIP (ONLY ONCE)
exports.submitInternship = async (req, res) => {
  try {
    const { company, domain, location, duration } = req.body;

    if (!company || !domain || !location || !duration) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // 🔒 Check if already submitted
    const existing = await Internship.findOne({ student: req.user._id });

    if (existing && existing.status !== 'rejected') {
      return res.status(400).json({
        message: `Already submitted. Status: ${existing.status}`
      });
    }

    // 🔁 If rejected → allow update instead of new create
    let internship;

    if (existing && existing.status === 'rejected') {
      internship = await Internship.findByIdAndUpdate(
        existing._id,
        {
          company,
          domain,
          location,
          duration,
          status: 'pending',
          adminFeedback: '',
          offerLetter: req.file ? req.file.filename : existing.offerLetter
        },
        { new: true }
      );
    } else {
      internship = await Internship.create({
        student: req.user._id,
        company,
        domain,
        location,
        duration,
        status: 'pending',
        adminFeedback: '',
        offerLetter: req.file ? req.file.filename : null
      });
    }

    res.status(201).json(internship);

  } catch (err) {
    console.log("SUBMIT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 2. GET MY INTERNSHIP (STUDENT)
exports.getMyInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({ student: req.user._id })
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    res.json(internship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 3. GET ALL INTERNSHIPS (ADMIN)
exports.getAllInternships = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const internships = await Internship.find(filter)
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort('-createdAt');

    res.json(internships);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 4. APPROVE INTERNSHIP (ADMIN)
exports.approveInternship = async (req, res) => {
  try {
    const { mentorId, feedback } = req.body;

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // ✅ Update internship
    internship.status = 'approved';
    internship.adminFeedback = feedback || 'Approved successfully';
    internship.mentor = mentorId || null;

    await internship.save();

    // ✅ Create or update student
    let student = await Student.findOne({ user: internship.student });

    if (!student) {
      student = await Student.create({
        user: internship.student,
        mentor: internship.mentor,
        internshipDomain: internship.domain,
        college: 'Not Provided',
        status: 'approved',
        enrollmentNumber: Date.now().toString(),
      });
    } else {
      student.mentor = internship.mentor || student.mentor;
      student.internshipDomain = internship.domain;
      student.status = 'approved';
      await student.save();
    }

    res.json(internship);

  } catch (err) {
    console.log("APPROVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 5. REJECT INTERNSHIP (ADMIN)
exports.rejectInternship = async (req, res) => {
  try {
    const { feedback } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminFeedback: feedback || 'Rejected by admin'
      },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);

  } catch (err) {
    console.log("REJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 6. ALLOT MENTOR (OPTIONAL - ADMIN)
exports.allotMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { mentor: mentorId },
      { new: true }
    ).populate('mentor', 'name email');

    res.json(internship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};