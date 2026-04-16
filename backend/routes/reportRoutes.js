const router = require('express').Router()
const multer = require('multer')
const path = require('path')

const {
  createReport,
  getReports,
  getMentorReports,
  evaluateReport
} = require('../controllers/reportController')

const { protect, authorize } = require('../middleware/authMiddleware')

// file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

router.use(protect)

// student
router.post('/', authorize('student'), upload.single('documentFile'), createReport)
router.get('/', authorize('student'), getReports)

// mentor
router.get('/mentor', authorize('mentor'), getMentorReports)

// evaluate
router.put('/:id/evaluate', authorize('mentor'), evaluateReport)

module.exports = router