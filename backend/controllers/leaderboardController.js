const mongoose = require('mongoose');
const QuizAttempt = require('../models/QuizAttempt');

/**
 * @desc    Get leaderboard rankings
 * @route   GET /api/leaderboard
 * @access  Private
 */
const getLeaderboard = async (req, res) => {
  const { categoryId, difficulty } = req.query;

  try {
    const match = {};

    // Filter by category if provided
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      match.category = new mongoose.Types.ObjectId(categoryId);
    }

    // Filter by difficulty if provided
    if (difficulty) {
      match.difficulty = difficulty;
    }

    // Run aggregation to get each user's maximum score
    const rankings = await QuizAttempt.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$user',
          highestScore: { $max: '$score' },
          totalAttempts: { $sum: 1 },
          averageTime: { $avg: '$timeTaken' },
        },
      },
      // Sort by highest score (descending), then by average time taken (ascending)
      { $sort: { highestScore: -1, averageTime: 1 } },
      { $limit: 20 },
      // Populate username
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          highestScore: 1,
          totalAttempts: 1,
          averageTime: { $round: ['$averageTime', 1] },
          username: '$user.username',
        },
      },
    ]);

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leaderboard: ' + error.message });
  }
};

/**
 * @desc    Get recent quiz attempts
 * @route   GET /api/leaderboard/recent
 * @access  Private
 */
const getRecentAttempts = async (req, res) => {
  try {
    const recent = await QuizAttempt.find({})
      .populate('user', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent attempts: ' + error.message });
  }
};

module.exports = {
  getLeaderboard,
  getRecentAttempts,
};
