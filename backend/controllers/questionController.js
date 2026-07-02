const Question = require('../models/Question');
const Category = require('../models/Category');

/**
 * @desc    Get all questions (with populated category details)
 * @route   GET /api/admin/questions
 * @access  Private/Admin
 */
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).populate('category', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving questions: ' + error.message });
  }
};

/**
 * @desc    Create a new question
 * @route   POST /api/admin/questions
 * @access  Private/Admin
 */
const createQuestion = async (req, res) => {
  const { category, difficulty, questionText, options, correctAnswer } = req.body;

  try {
    if (!category || !difficulty || !questionText || !options || correctAnswer === undefined) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404);
      throw new Error('Category not found');
    }

    const question = await Question.create({
      category,
      difficulty,
      questionText,
      options,
      correctAnswer,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Update a question
 * @route   PUT /api/admin/questions/:id
 * @access  Private/Admin
 */
const updateQuestion = async (req, res) => {
  const { category, difficulty, questionText, options, correctAnswer } = req.body;

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(404);
        throw new Error('Category not found');
      }
      question.category = category;
    }

    if (difficulty) question.difficulty = difficulty;
    if (questionText) question.questionText = questionText;
    if (options) question.options = options;
    if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

/**
 * @desc    Delete a question
 * @route   DELETE /api/admin/questions/:id
 * @access  Private/Admin
 */
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    await question.deleteOne();
    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a category
 * @route   POST /api/admin/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name || !description) {
      res.status(400);
      throw new Error('Please enter category name and description');
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createCategory,
};
