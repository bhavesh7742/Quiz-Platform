const express = require('express');
const router = express.Router();
const {
  getStats,
  getHistory,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes

router.get('/stats', getStats);
router.get('/history', getHistory);

module.exports = router;
