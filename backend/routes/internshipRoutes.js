const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const {
  submitInternship, getMyInternship, getAllInternships,
  approveInternship, rejectInternship, allotMentor,
  finalSubmit, finalEvaluate, adminUpdateEvaluate
} = require('../controllers/internshipController')
const { protect, authorize } = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// PDF-only filter for final certificates
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};
const uploadPdf = multer({ 
  storage, 
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.use(protect)

router.post('/', authorize('student'), upload.single('offerLetter'), submitInternship)
router.get('/my', authorize('student'), getMyInternship)
router.get('/', authorize('admin', 'mentor'), getAllInternships)
router.put('/:id/approve', authorize('admin'), approveInternship)
router.put('/:id/reject', authorize('admin'), rejectInternship)
router.put('/:id/mentor', authorize('admin'), allotMentor)

// NEW: Final Evaluation Routes
router.post('/:id/final-submit', authorize('student'), uploadPdf.single('finalCertificate'), finalSubmit)
router.put('/:id/final-evaluate', authorize('mentor'), finalEvaluate)
router.put('/:id/admin-evaluate', authorize('admin'), adminUpdateEvaluate)

module.exports = router