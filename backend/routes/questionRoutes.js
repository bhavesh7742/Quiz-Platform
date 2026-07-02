const express = require('express');
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createCategory,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Protect all routes with auth + admin check
router.use(protect);
router.use(admin);

router.route('/questions')
  .get(getQuestions)
  .post(createQuestion);

router.route('/questions/:id')
  .put(updateQuestion)
  .delete(deleteQuestion);

router.post('/categories', createCategory);

module.exports = router;
