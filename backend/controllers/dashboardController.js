const QuizAttempt = require('../models/QuizAttempt');
const Category = require('../models/Category');

/**
 * @desc    Get current user's performance statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  const userId = req.user._id;

  try {
    // Total number of quizzes taken
    const totalAttempts = await QuizAttempt.countDocuments({ user: userId });

    // Aggregate average score, max score, total time spent
    const generalStats = await QuizAttempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          totalTimeTaken: { $sum: '$timeTaken' },
        },
      },
    ]);

    // Breakdown per category
    const categoryBreakdown = await QuizAttempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          _id: 1,
          categoryName: '$categoryDetails.name',
          count: 1,
          averageScore: { $round: ['$averageScore', 1] },
        },
      },
    ]);

    const statsObj = generalStats[0] || {
      averageScore: 0,
      highestScore: 0,
      totalTimeTaken: 0,
    };

    res.json({
      totalAttempts,
      averageScore: Math.round(statsObj.averageScore || 0),
      highestScore: statsObj.highestScore || 0,
      totalTimeTaken: statsObj.totalTimeTaken || 0,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving statistics: ' + error.message });
  }
};

/**
 * @desc    Get current user's quiz attempt history
 * @route   GET /api/dashboard/history
 * @access  Private
 */
const getHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const history = await QuizAttempt.find({ user: userId })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(30); // Return last 30 attempts

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attempt history: ' + error.message });
  }
};

module.exports = {
  getStats,
  getHistory,
};
