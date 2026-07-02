# Questify: Quiz Platform With Leaderboard

Questify is a complete, production-quality, responsive MERN-stack web application designed for interactive test-taking, real-time scoring, analytics tracking, and leaderboard competition.

## Project Details
* **Intern Name**: `Bhavesh Kumar`
* **Intern ID**: `CITS5188`
* **Project Name**: **Quiz Platform With Leaderboard**
* **Target Company**: CodTech IT Solutions
* **Domain**: Full Stack Web Development (MERN)

---

## Features

### 1. User Authentication
* **Registration & Login**: Secure credential capture with email and unique username validation.
* **Security**: Multi-round password hashing with `bcryptjs` on the backend.
* **Session Persistence**: JWT-based stateless authorization, synced and saved securely via browser LocalStorage.
* **Role Management**: Separate challenger credentials and administrator tokens.

### 2. Interactive Quiz Engine
* **Topic Categorization**: Dynamically loaded topics (Web Development, Science & Tech, History & Geography).
* **Selectable Difficulties**: Easy, Medium, and Hard, each mapped to different per-question countdowns (30s, 20s, 15s).
* **Cheat Prevention**: Correct option indices are omitted from client payloads and evaluated strictly on the backend.
* **Auto-Submission**: Active progress bar timers that automatically skip or submit if a player times out.
* **Interactive Choices**: Animated multiple-choice (MCQ) option selection cards.

### 3. Real-Time Leaderboard
* **Global Ranking**: Aggregated standings sorted by highest accuracy percentage and then by fastest average response time.
* **Filtering**: View rankings filtered by quiz categories or difficulty grades.
* **Recent Activity Feed**: A live feed showing recent attempts by other competitors.

### 4. Dashboards & Analytics
* **Challenger Dashboard**: Greets users, lists past performance history, and displays visual statistics.
* **SVG Analytics Visualizer**: A custom, dependency-free responsive SVG dashboard displaying:
  * Total Quizzes Taken.
  * Highest Score.
  * Average Accuracy percentage dial (interactive SVG ring chart).
  * Topic Mastery breakdown (horizontal SVG bar charts representing scores by category).

### 5. Administrative Control Panel
* **Protected Routes**: Restricts views using React Router role guards.
* **Question Database Management**: Full CRUD operations to create, edit, or delete questions.
* **Categories Manager**: Create new quiz categories dynamically.

### 6. Visual Polish & Extra Features
* **Dark/Light Mode Theme**: Styled transitions stored in LocalStorage.
* **Toast Notification Context**: Responsive popups for successes, errors, and validation alerts.
* **Responsive Layout**: Seamless, premium visual experience on Mobile, Tablet, and Desktop.

---

## Directory Structure

```text
/
├── backend/
│   ├── config/          # Database connection settings
│   ├── controllers/     # API request handlers
│   ├── middleware/      # JWT auth, Admin role, and Error middleware
│   ├── models/          # Mongoose DB schemas (User, Category, Question, QuizAttempt)
│   ├── routes/          # API routing declarations
│   ├── .env             # Environment variables (Port, MongoDB Connection, JWT Secret)
│   ├── .env.example     # Environment template
│   ├── seed.js          # DB seeder script (realistic dummy data)
│   └── server.js        # Backend server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout, Protections, SVG Analytics, and Toast UI
│   │   ├── context/     # Auth, Theme, and Toast React Context providers
│   │   ├── pages/       # Login, Register, Dashboards, Quiz Zone, Leaderboards, Admin Panel
│   │   ├── App.jsx      # Route configurations
│   │   ├── index.css    # Tailwind CSS v4 & custom variables imports
│   │   └── main.jsx     # App mounting
│   ├── package.json     # Frontend dependencies (Vite, React Router, Tailwind)
│   └── vite.config.js   # Vite server settings & API proxies
├── package.json         # Root orchestrator to run backend & frontend together
└── README.md            # Detailed documentation
```

---

## API Routes Documentation

### Authentication Routes
* `POST /api/auth/register` - Registers a new challenger.
* `POST /api/auth/login` - Authenticates credentials and issues a JWT.
* `GET /api/auth/me` - Verifies current token and returns active profile.

### Quiz Engine Routes
* `GET /api/quizzes/categories` - Returns list of all active categories.
* `GET /api/quizzes/start` - Retrieves a randomized set of questions (excluding answers) for a given category and difficulty.
* `POST /api/quizzes/submit` - Scores answers, logs the attempt to DB, and returns evaluation feedback.

### Leaderboard Routes
* `GET /api/leaderboard` - Compiles ranked scores, optionally filtered by category/difficulty.
* `GET /api/leaderboard/recent` - Stream of recent quiz attempts globally.

### Dashboard Routes
* `GET /api/dashboard/stats` - Pulls cumulative statistics and category breakdown metrics for the user.
* `GET /api/dashboard/history` - Timeline of past attempts by the user.

### Admin-Only Routes
* `GET /api/admin/questions` - Pulls all questions in database (with answers).
* `POST /api/admin/questions` - Creates a new question.
* `PUT /api/admin/questions/:id` - Updates an existing question.
* `DELETE /api/admin/questions/:id` - Deletes a question.
* `POST /api/admin/categories` - Dynamically adds a new category.

---

## Setup & Running Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) running locally or an online cluster (MongoDB Atlas)

### Step 1: Clone the Repository
```bash
git clone <github-repository-link-placeholder>
cd "Quiz Platform With Leaderboard"
```

### Step 2: Set Up Backend Environment Variables
Create a `.env` file in the `/backend` folder. You can copy the template:
```bash
cp backend/.env.example backend/.env
```
Inside the `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quiz-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 3: Install Dependencies
Run the install script from the **root workspace directory**:
```bash
npm run install-all
```
This single command installs the required dependencies for the root orchestrator, the backend API, and the React frontend.

### Step 4: Seed the Database
Populate the database with dummy users, categories, questions, and attempt histories:
```bash
npm run seed
```
This runs `backend/seed.js`.

### Step 5: Start the Platform
Launch both the Express API and the Vite Dev server concurrently from the root directory:
```bash
npm run dev
```

* The **React Frontend** will run at: `http://localhost:5173/`
* The **Express API** will run at: `http://localhost:5000/` (Vite is preconfigured to proxy `/api` requests here).

---

## Demo Credentials
Use these preseeded credentials to test different user roles immediately after seeding:

### Administrator Access
* **Email**: `admin@quiz.com`
* **Password**: `admin123`
* *Allows viewing the Admin Panel to manage categories and questions.*

### Challenger Access
* **Email**: `john@example.com`
* **Password**: `password123`
* *Allows choosing categories, attempting quizzes, and submitting scores.*

---

## Outputs & Screenshots
*(Add your final execution screenshots and recordings in these sections)*

### 1. Welcome & Login Screen
*`[Placeholder for Login Screenshot]`*

### 2. Challenger Dashboard & SVG Analytics
*`[Placeholder for Dashboard & SVG Chart Screenshot]`*

### 3. Active Quiz Arena with Timer
*`[Placeholder for Active Quiz Card Screenshot]`*

### 4. Detailed Quiz Evaluation
*`[Placeholder for Quiz Feedback Review Screenshot]`*

### 5. Hall of Fame Leaderboards
*`[Placeholder for Leaderboard Standings Screenshot]`*

### 6. Administration Manager
*`[Placeholder for Admin Panel Screenshot]`*
