const Internship = require('../models/Internship');
const Student = require('../models/Student');


// ✅ 1. SUBMIT INTERNSHIP (ONLY ONCE)
exports.submitInternship = async (req, res) => {
  try {
    const { company, domain, location, duration } = req.body;

    if (!company || !domain || !location || !duration) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // 🔁 Allow multiple internship submissions
    const internship = await Internship.create({
      student: req.user._id,
      company,
      domain,
      location,
      duration,
      status: 'pending',
      adminFeedback: '',
      offerLetter: req.file ? req.file.filename : null
    });

    // Notify admins
    const User = require('../models/User');
    const Notification = require('../models/Notification');
    const admins = await User.find({ role: 'admin' });
    
    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        sender: req.user._id,
        message: `${req.user.name || 'A student'} submitted a new internship request for ${company}.`,
        type: 'internship_request',
        link: '/internship-requests'
      }));
      await Notification.insertMany(notifications);
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
    const internships = await Internship.find({ student: req.user._id })
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    res.json(internships);

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

    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    internship.mentor = mentorId || null;
    await internship.save();

    // Sync with Student profile
    await Student.findOneAndUpdate(
      { user: internship.student },
      { mentor: internship.mentor },
      { new: true }
    );

    const updated = await Internship.findById(internship._id).populate('mentor', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 7. FINAL SUBMISSION (STUDENT)
exports.finalSubmit = async (req, res) => {
  try {
    const { summary } = req.body;
    const internship = await Internship.findOne({ _id: req.params.id, student: req.user._id });

    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    if (internship.status !== 'approved' && internship.status !== 'In Progress') {
      return res.status(400).json({ message: 'Internship must be approved/in progress to submit final docs' });
    }

    internship.finalSummary = summary;
    internship.finalCertificate = req.file ? req.file.filename : internship.finalCertificate;
    internship.finalEvaluationStatus = 'pending';
    
    await internship.save();

    // Create Notification for Mentor
    const Notification = require('../models/Notification');
    if (internship.mentor) {
      await Notification.create({
        recipient: internship.mentor,
        sender: req.user._id,
        message: `${req.user.name} has submitted their final certificate for ${internship.company}.`,
        type: 'final_submission',
        link: '/final-evaluations'
      });
    }

    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 9. ADMIN UPDATE EVALUATION (ADMIN)
exports.adminUpdateEvaluate = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const internship = await Internship.findById(req.params.id);

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    internship.finalScore = score;
    internship.finalMentorFeedback = feedback;
    internship.status = 'completed';
    internship.finalEvaluationStatus = 'completed';

    await internship.save();
    
    // Notify student about admin update
    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: internship.student,
      sender: req.user._id,
      message: `Your final internship evaluation for ${internship.company} was updated by admin. Score: ${score}/100`,
      type: 'final_evaluated',
      link: '/final-submission'
    });

    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 8. FINAL EVALUATION (MENTOR)
exports.finalEvaluate = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const internship = await Internship.findOne({ _id: req.params.id, mentor: req.user._id });

    if (!internship) return res.status(404).json({ message: 'Internship not found or not assigned to you' });

    internship.finalScore = score;
    internship.finalMentorFeedback = feedback;
    internship.finalEvaluationStatus = 'completed';
    internship.status = 'completed'; // Mark internship as officially completed

    await internship.save();

    // Create Notification for Student
    const Notification = require('../models/Notification');
    await Notification.create({
      recipient: internship.student,
      sender: req.user._id,
      message: `Your final internship evaluation for ${internship.company} is complete. Score: ${score}/100`,
      type: 'final_evaluated',
      link: '/final-submission'
    });

    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};