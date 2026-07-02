const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getRecentAttempts,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes

router.get('/', getLeaderboard);
router.get('/recent', getRecentAttempts);

module.exports = router;
