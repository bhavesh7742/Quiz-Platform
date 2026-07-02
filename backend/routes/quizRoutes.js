const express = require('express');
const router = express.Router();
const {
  getCategories,
  startQuiz,
  submitQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all quiz routes

router.get('/categories', getCategories);
router.get('/start', startQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
