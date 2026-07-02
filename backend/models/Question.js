const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate a category with this question'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty'],
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Please provide options'],
      validate: {
        validator: function (val) {
          return val.length === 4;
        },
        message: 'A question must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify the index of the correct answer (0-3)'],
      min: [0, 'Correct answer index cannot be less than 0'],
      max: [3, 'Correct answer index cannot be greater than 3'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
