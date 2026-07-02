import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ScoreAnalytics from '../components/ScoreAnalytics';
import { Play, Calendar, Clock, Award, Star, History } from 'lucide-react';

const Dashboard = () => {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
        };

        const [statsRes, historyRes] = await Promise.all([
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/dashboard/history', { headers }),
        ]);

        if (!statsRes.ok || !historyRes.ok) {
          throw new Error('Failed to load dashboard data');
        }

        const statsData = await statsRes.json();
        const historyData = await historyRes.json();

        setStats(statsData);
        setHistory(historyData);
      } catch (err) {
        addToast(err.message || 'Error loading dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, addToast]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Assembling your stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white border border-slate-900">
        {/* Background visual decorations */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute right-12 bottom-0 w-24 h-24 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-2xl flex flex-col justify-between h-full">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
              Challenger Profile
            </span>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl mt-3 leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">{user?.username}</span>!
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2">
              Ready to test your knowledge today? Choose a topic, select your difficulty, and prove your rank on the leaderboards.
            </p>
          </div>
          
          <div className="mt-8">
            <Link
              to="/quiz-dashboard"
              id="dashboard-cta-play"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/35 transition-all hover:scale-[1.02] cursor-pointer text-sm"
            >
              <Play size={16} fill="currentColor" />
              Start New Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Scoreboard Widgets */}
      {stats && <ScoreAnalytics stats={stats} />}

      {/* History Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <History size={18} />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">Quiz History</h2>
        </div>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 px-4">Difficulty</th>
                  <th className="pb-3 px-4 text-center">Score</th>
                  <th className="pb-3 px-4 text-center">Accuracy</th>
                  <th className="pb-3 px-4 text-center">Time</th>
                  <th className="pb-3 pl-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50 font-medium">
                {history.map((attempt, index) => {
                  const percent = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
                  return (
                    <tr key={attempt._id || index} className="text-slate-700 dark:text-slate-300">
                      <td className="py-4 pr-4 font-semibold text-slate-900 dark:text-slate-100">
                        {attempt.category?.name || 'Unknown Category'}
                      </td>
                      <td className="py-4 px-4 capitalize">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          attempt.difficulty === 'easy'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                            : attempt.difficulty === 'medium'
                            ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                        }`}>
                          {attempt.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-indigo-600 dark:text-indigo-400 font-extrabold">
                        {attempt.score}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs">
                          <span className="text-slate-900 dark:text-slate-200 font-bold">{attempt.correctAnswers}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-400">{attempt.totalQuestions}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-slate-500 dark:text-slate-400">
                        {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                      </td>
                      <td className="py-4 pl-4 text-right text-xs text-slate-400 font-medium">
                        {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Award size={48} className="mx-auto text-slate-300 dark:text-slate-700" />
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200 mt-3">
              No Attempts Yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't completed any quizzes yet. Start playing quizzes to compile dashboard analytics.
            </p>
            <div className="mt-4">
              <Link
                to="/quiz-dashboard"
                id="btn-first-quiz-cta"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Launch First Quiz
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
