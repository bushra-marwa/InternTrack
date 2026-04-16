const express = require('express')
const router = express.Router()
const { register, login, getMe, getMentors } = require('../controllers/authController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/mentors', protect, authorize('admin','mentor'), getMentors)

module.exports = router