const Category = require('../models/Category');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

/**
 * @desc    Get all quiz categories
 * @route   GET /api/quizzes/categories
 * @access  Private
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories: ' + error.message });
  }
};

/**
 * @desc    Get random questions for a category & difficulty
 * @route   GET /api/quizzes/start
 * @access  Private
 */
const startQuiz = async (req, res) => {
  const { categoryId, difficulty } = req.query;

  try {
    if (!categoryId || !difficulty) {
      res.status(400);
      throw new Error('Please provide categoryId and difficulty');
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Find questions matching category and difficulty
    const questions = await Question.find({ category: categoryId, difficulty });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this category and difficulty' });
    }

    // Randomize the order of questions and take up to 10
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    // Map questions to exclude the correctAnswer index for security
    const sanitizedQuestions = selectedQuestions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty,
      category: q.category,
    }));

    res.json(sanitizedQuestions);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Submit answers and calculate score
 * @route   POST /api/quizzes/submit
 * @access  Private
 */
const submitQuiz = async (req, res) => {
  const { categoryId, difficulty, answers, timeTaken } = req.body;

  try {
    if (!categoryId || !difficulty || !Array.isArray(answers)) {
      res.status(400);
      throw new Error('Invalid submission format');
    }

    // Fetch the correct answers from database for validation
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let correctAnswersCount = 0;
    const feedback = [];

    // Evaluate answers
    answers.forEach((ans) => {
      const question = questions.find((q) => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedOptionIndex;
        if (isCorrect) {
          correctAnswersCount++;
        }
        feedback.push({
          questionId: question._id,
          questionText: question.questionText,
          options: question.options,
          selectedOptionIndex: ans.selectedOptionIndex,
          correctAnswerIndex: question.correctAnswer,
          isCorrect,
        });
      }
    });

    const totalQuestions = answers.length;
    // Score is percentage (out of 100) or raw score. Let's do standard score as percentage
    const score = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

    // Save attempt to database
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      category: categoryId,
      difficulty,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      timeTaken: timeTaken || 0,
    });

    res.status(201).json({
      attemptId: attempt._id,
      score,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      timeTaken: attempt.timeTaken,
      feedback,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  startQuiz,
  submitQuiz,
};
