const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
const QuizAttempt = require('./models/QuizAttempt');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz-platform');
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();
    await QuizAttempt.deleteMany();
    console.log('Database cleared.');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@quiz.com',
        password: hashedAdminPassword,
        isAdmin: true,
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedUserPassword,
        isAdmin: false,
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: hashedUserPassword,
        isAdmin: false,
      },
      {
        username: 'quizmaster',
        email: 'master@example.com',
        password: hashedUserPassword,
        isAdmin: false,
      },
    ]);
    console.log('Users seeded.');

    // 2. Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Web Development',
        description: 'HTML, CSS, JavaScript, React, and general full-stack engineering questions.',
      },
      {
        name: 'Science & Tech',
        description: 'General science, physics, chemistry, space exploration, and technology trivia.',
      },
      {
        name: 'History & Geography',
        description: 'Ancient civilizations, world wars, geography, countries, and capitals.',
      },
    ]);
    console.log('Categories seeded.');

    const webDevId = categories[0]._id;
    const scienceId = categories[1]._id;
    const historyId = categories[2]._id;

    // 3. Create Questions
    const questionsList = [
      // === Web Development ===
      // Easy
      {
        category: webDevId,
        difficulty: 'easy',
        questionText: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'Hyper Text Markdown Language',
          'Hyper Loop Markup Language',
          'High Text Markup Language',
        ],
        correctAnswer: 0,
      },
      {
        category: webDevId,
        difficulty: 'easy',
        questionText: 'Which HTML element is used to insert a line break?',
        options: ['<lb>', '<break>', '<br>', '<link>'],
        correctAnswer: 2,
      },
      // Medium
      {
        category: webDevId,
        difficulty: 'medium',
        questionText: 'Which JS keyword can be used to declare block-scoped variables?',
        options: ['var', 'let', 'const', 'Both let and const'],
        correctAnswer: 3,
      },
      {
        category: webDevId,
        difficulty: 'medium',
        questionText: 'What is the purpose of React\'s useState hook?',
        options: [
          'To manage global app state',
          'To declare local state variables in a functional component',
          'To fetch API data on page mount',
          'To perform DOM updates directly',
        ],
        correctAnswer: 1,
      },
      // Hard
      {
        category: webDevId,
        difficulty: 'hard',
        questionText: 'What is the event loop in JavaScript?',
        options: [
          'A loop that executes all async functions synchronously',
          'A mechanism that coordinates callbacks, execution context stacks, and task queues',
          'A feature that compiles JavaScript code to binary format at runtime',
          'A database event listener used in Node.js framework',
        ],
        correctAnswer: 1,
      },
      {
        category: webDevId,
        difficulty: 'hard',
        questionText: 'In MongoDB, what is the default primary key field name created for documents?',
        options: ['_id', 'id', 'pk', 'uid'],
        correctAnswer: 0,
      },

      // === Science & Tech ===
      // Easy
      {
        category: scienceId,
        difficulty: 'easy',
        questionText: 'What is the chemical symbol for water?',
        options: ['O2', 'H2O', 'CO2', 'HO2'],
        correctAnswer: 1,
      },
      {
        category: scienceId,
        difficulty: 'easy',
        questionText: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Earth', 'Mars', 'Mercury'],
        correctAnswer: 3,
      },
      // Medium
      {
        category: scienceId,
        difficulty: 'medium',
        questionText: 'What is the approximate speed of light in a vacuum?',
        options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
        correctAnswer: 0,
      },
      {
        category: scienceId,
        difficulty: 'medium',
        questionText: 'Which subatomic particle carries a negative charge?',
        options: ['Proton', 'Neutron', 'Electron', 'Positron'],
        correctAnswer: 2,
      },
      // Hard
      {
        category: scienceId,
        difficulty: 'hard',
        questionText: 'Who proposed the General Theory of Relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Niels Bohr'],
        correctAnswer: 1,
      },
      {
        category: scienceId,
        difficulty: 'hard',
        questionText: 'What is the name of the first artificial satellite launched into orbit around the Earth?',
        options: ['Apollo 11', 'Voyager 1', 'Sputnik 1', 'Hubble'],
        correctAnswer: 2,
      },

      // === History & Geography ===
      // Easy
      {
        category: historyId,
        difficulty: 'easy',
        questionText: 'Which is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Southern Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
      },
      {
        category: historyId,
        difficulty: 'easy',
        questionText: 'What is the capital city of France?',
        options: ['London', 'Berlin', 'Paris', 'Rome'],
        correctAnswer: 2,
      },
      // Medium
      {
        category: historyId,
        difficulty: 'medium',
        questionText: 'In which year did World War II end?',
        options: ['1918', '1939', '1945', '1950'],
        correctAnswer: 2,
      },
      {
        category: historyId,
        difficulty: 'medium',
        questionText: 'Which river is the longest in the world?',
        options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
        correctAnswer: 1,
      },
      // Hard
      {
        category: historyId,
        difficulty: 'hard',
        questionText: 'Who was the first official Emperor of the Roman Empire?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Marcus Aurelius'],
        correctAnswer: 1,
      },
      {
        category: historyId,
        difficulty: 'hard',
        questionText: 'Which country is home to the ancient ruins of Machu Picchu?',
        options: ['Mexico', 'Peru', 'Chile', 'Colombia'],
        correctAnswer: 1,
      },
    ];

    await Question.insertMany(questionsList);
    console.log('Questions seeded.');

    // 4. Create Quiz Attempts for Leaderboard and Dashboard History
    const johnId = users[1]._id;
    const janeId = users[2]._id;
    const masterId = users[3]._id;

    await QuizAttempt.insertMany([
      {
        user: johnId,
        category: webDevId,
        difficulty: 'easy',
        score: 100,
        totalQuestions: 2,
        correctAnswers: 2,
        timeTaken: 15,
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      },
      {
        user: johnId,
        category: webDevId,
        difficulty: 'medium',
        score: 50,
        totalQuestions: 2,
        correctAnswers: 1,
        timeTaken: 28,
        createdAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
      },
      {
        user: janeId,
        category: webDevId,
        difficulty: 'easy',
        score: 50,
        totalQuestions: 2,
        correctAnswers: 1,
        timeTaken: 22,
        createdAt: new Date(Date.now() - 1800000), // 30 mins ago
      },
      {
        user: masterId,
        category: scienceId,
        difficulty: 'medium',
        score: 100,
        totalQuestions: 2,
        correctAnswers: 2,
        timeTaken: 18,
        createdAt: new Date(Date.now() - 600000), // 10 mins ago
      },
      {
        user: janeId,
        category: scienceId,
        difficulty: 'medium',
        score: 50,
        totalQuestions: 2,
        correctAnswers: 1,
        timeTaken: 35,
        createdAt: new Date(Date.now() - 300000), // 5 mins ago
      },
      {
        user: masterId,
        category: historyId,
        difficulty: 'hard',
        score: 100,
        totalQuestions: 2,
        correctAnswers: 2,
        timeTaken: 40,
        createdAt: new Date(Date.now() - 100000), // ~1 min ago
      },
    ]);
    console.log('Quiz attempts seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data: ', error);
    process.exit(1);
  }
};

seedData();
