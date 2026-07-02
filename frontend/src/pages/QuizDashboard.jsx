import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Brain, Star, ArrowRight, BookOpen, Clock, AlertCircle } from 'lucide-react';

const QuizDashboard = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [loading, setLoading] = useState(true);

  // Fetch quiz categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/quizzes/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to retrieve categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        addToast(error.message || 'Error fetching categories', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token, addToast]);

  const handleStartQuiz = () => {
    if (!selectedCategory) {
      addToast('Please select a quiz category first', 'warning');
      return;
    }

    // Direct to the play zone with queries
    navigate(`/quiz-play?categoryId=${selectedCategory._id}&difficulty=${selectedDifficulty}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Assembling topics...</p>
      </div>
    );
  }

  const difficulties = [
    {
      level: 'easy',
      name: 'Easy',
      desc: 'Great for beginners. 30 seconds per question.',
      timer: 30,
      color: 'border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
      activeColor: 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500',
    },
    {
      level: 'medium',
      name: 'Medium',
      desc: 'Standard challenge. 20 seconds per question.',
      timer: 20,
      color: 'border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 bg-amber-500/5',
      activeColor: 'ring-2 ring-amber-500 bg-amber-500/10 border-amber-500',
    },
    {
      level: 'hard',
      name: 'Hard',
      desc: 'Time crunch. 15 seconds per question.',
      timer: 15,
      color: 'border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 bg-rose-500/5',
      activeColor: 'ring-2 ring-rose-500 bg-rose-500/10 border-rose-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Play Zone</span>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-slate-100 tracking-tight mt-1">
          Prepare Your Challenge
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Select your category of choice and set your desired difficulty level. Speed is rewarded on the leaderboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1: Select Topic (Col-span 2) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" />
            1. Select Category
          </h2>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory?._id === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-700' 
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}>
                        Topic
                      </span>
                      <h3 className="font-display font-bold text-base mt-3 text-slate-800 dark:text-slate-100">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <AlertCircle className="mx-auto mb-2 text-slate-300" size={32} />
              No categories seeded in database.
            </div>
          )}
        </div>

        {/* Step 2: Select Difficulty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              2. Select Difficulty
            </h2>

            <div className="space-y-3">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.level;
                return (
                  <button
                    key={diff.level}
                    onClick={() => setSelectedDifficulty(diff.level)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected ? diff.activeColor : diff.color + ' border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm capitalize">{diff.name}</span>
                      <span className="text-[10px] font-mono flex items-center gap-0.5 opacity-80">
                        <Clock size={10} />
                        {diff.timer}s/q
                      </span>
                    </div>
                    <p className="text-xs opacity-70 mt-1 leading-normal">{diff.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action trigger */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={handleStartQuiz}
              id="btn-arena-start"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Enter the Arena
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizDashboard;
