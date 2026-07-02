import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Views
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import QuizDashboard from './pages/QuizDashboard';
import QuizPlay from './pages/QuizPlay';
import QuizResult from './pages/QuizResult';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public Access */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Challenger Protected Space */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-dashboard"
                  element={
                    <ProtectedRoute>
                      <QuizDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-play"
                  element={
                    <ProtectedRoute>
                      <QuizPlay />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-result"
                  element={
                    <ProtectedRoute>
                      <QuizResult />
                    </ProtectedRoute>
                  }
                />

                {/* Administration Protected Space */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Standard Catch-All redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
