const router = require('express').Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .get(getTasks)
  .post(authorize('mentor', 'admin'), createTask);
router.route('/:id')
  .put(updateTask)
  .delete(authorize('mentor', 'admin'), deleteTask);

module.exports = router;