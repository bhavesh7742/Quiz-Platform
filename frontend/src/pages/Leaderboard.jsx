import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trophy, ShieldAlert, Award, Clock, Flame, Zap, HelpCircle } from 'lucide-react';

const Leaderboard = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  const [rankings, setRankings] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/quizzes/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.ok ? await res.json() : [];
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  // Fetch rankings whenever filters change
  useEffect(() => {
    const fetchRankingsAndRecent = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        let rankingsUrl = '/api/leaderboard';
        const params = [];
        if (selectedCategory) params.push(`categoryId=${selectedCategory}`);
        if (selectedDifficulty) params.push(`difficulty=${selectedDifficulty}`);
        if (params.length > 0) rankingsUrl += `?${params.join('&')}`;

        const [rankRes, recentRes] = await Promise.all([
          fetch(rankingsUrl, { headers }),
          fetch('/api/leaderboard/recent', { headers }),
        ]);

        if (!rankRes.ok || !recentRes.ok) {
          throw new Error('Failed to load leaderboard data');
        }

        const rankData = await rankRes.json();
        const recentData = await recentRes.json();

        setRankings(rankData);
        setRecentAttempts(recentData);
      } catch (err) {
        addToast(err.message || 'Error updating rankings', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRankingsAndRecent();
    }
  }, [token, selectedCategory, selectedDifficulty, addToast]);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Rankings</span>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-slate-100 flex items-center gap-3 mt-1">
            <Trophy className="text-amber-500 fill-amber-500/20" size={32} />
            Hall of Fame
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            View the top performers worldwide. Accuracy and speed determine the rank.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            aria-label="Filter by category"
            id="filter-category"
          >
            <option value="">All Topics</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            aria-label="Filter by difficulty"
            id="filter-difficulty"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rankings Table (Col-Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-400 font-medium">Re-calculating rankings...</p>
            </div>
          ) : rankings.length > 0 ? (
            <div className="space-y-6">
              
              {/* Top 3 Podiums Showcase */}
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80 items-end">
                {/* 2nd place */}
                {rankings[1] && (
                  <div className="flex flex-col items-center text-center p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl order-1">
                    <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-display font-black text-slate-800 dark:text-slate-200 text-sm shadow-inner">
                      2
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-2 truncate max-w-[80px]">
                      {rankings[1].username}
                    </span>
                    <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                      {rankings[1].highestScore}%
                    </span>
                  </div>
                )}

                {/* 1st place */}
                {rankings[0] && (
                  <div className="flex flex-col items-center text-center p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border-2 border-indigo-200/50 dark:border-indigo-900/30 rounded-3xl order-2 relative shadow-lg shadow-indigo-100/30 dark:shadow-none -translate-y-2">
                    <span className="absolute -top-3.5 text-xl">👑</span>
                    <span className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-display font-black text-amber-950 text-sm shadow-md">
                      1
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2.5 truncate max-w-[100px]">
                      {rankings[0].username}
                    </span>
                    <span className="font-extrabold text-base text-fuchsia-600 dark:text-fuchsia-400 mt-1">
                      {rankings[0].highestScore}%
                    </span>
                  </div>
                )}

                {/* 3rd place */}
                {rankings[2] && (
                  <div className="flex flex-col items-center text-center p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl order-3">
                    <span className="w-8 h-8 rounded-full bg-amber-700/30 dark:bg-amber-700/20 flex items-center justify-center font-display font-black text-amber-800 dark:text-amber-500 text-sm shadow-inner">
                      3
                    </span>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-2 truncate max-w-[80px]">
                      {rankings[2].username}
                    </span>
                    <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                      {rankings[2].highestScore}%
                    </span>
                  </div>
                )}
              </div>

              {/* General Rankings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-3 pr-4 text-center w-12">Rank</th>
                      <th className="pb-3 px-4">Player</th>
                      <th className="pb-3 px-4 text-center">High Score</th>
                      <th className="pb-3 px-4 text-center">Attempts</th>
                      <th className="pb-3 pl-4 text-right">Avg Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50 font-medium">
                    {rankings.map((player, idx) => {
                      const rank = idx + 1;
                      let badge = null;
                      if (rank === 1) badge = '🥇';
                      else if (rank === 2) badge = '🥈';
                      else if (rank === 3) badge = '🥉';

                      return (
                        <tr key={player._id} className="text-slate-700 dark:text-slate-300">
                          <td className="py-3.5 pr-4 text-center">
                            {badge ? (
                              <span className="text-lg">{badge}</span>
                            ) : (
                              <span className="font-mono text-slate-400 font-bold">#{rank}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            {player.username}
                          </td>
                          <td className="py-3.5 px-4 text-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                            {player.highestScore}%
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-500">
                            {player.totalAttempts}
                          </td>
                          <td className="py-3.5 pl-4 text-right font-mono text-slate-500 dark:text-slate-400">
                            {player.averageTime}s
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            <div className="text-center py-20">
              <ShieldAlert size={48} className="mx-auto text-slate-300 dark:text-slate-700" />
              <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200 mt-3">
                Board Empty
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                No attempt records meet the filtered criteria. Be the first to place on this board!
              </p>
            </div>
          )}
        </div>

        {/* Live Feed Sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Zap size={18} className="text-amber-500 fill-amber-500/10" />
            Live Feed
          </h2>

          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-slate-100 dark:divide-slate-800" role="list">
                {recentAttempts.map((attempt, index) => {
                  return (
                    <li key={attempt._id || index} className="py-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-display font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {attempt.user?.username?.substring(0, 2).toUpperCase() || 'Q'}
                          </div>
                          {attempt.score >= 80 && (
                            <span className="absolute -bottom-1 -right-1 block text-xs">🔥</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {attempt.user?.username || 'Challenger'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {attempt.category?.name || 'General Quiz'} ({attempt.difficulty})
                          </p>
                          <div className="flex items-center gap-2.5 mt-1.5">
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded-md">
                              Score: {attempt.score}%
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium">
                              <Clock size={10} />
                              {attempt.timeTaken}s
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-[9px] text-slate-400 font-medium">
                          {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-xs text-slate-400 font-medium block">No recent attempts.</span>
              <p className="text-[10px] text-slate-400 mt-1">Quiz action will appear here as it happens.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
