const router = require('express').Router();
const { createEvaluation, getEvaluations } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(getEvaluations)
  .post(authorize('mentor', 'admin'), createEvaluation);

module.exports = router;