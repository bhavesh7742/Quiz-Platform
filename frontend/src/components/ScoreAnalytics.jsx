import React from 'react';

const ScoreAnalytics = ({ stats }) => {
  const { averageScore, highestScore, totalAttempts, categoryBreakdown } = stats;

  // Circle path math for SVG ring
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (averageScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      
      {/* 1. General Info & Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Summary</span>
          <h3 className="font-display font-bold text-2xl mt-1 text-slate-800 dark:text-slate-100">Performance Status</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            You have completed {totalAttempts} quizzes. Maintain your streak to climb the leaderboard rank!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Total Quizzes</span>
            <span className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
              {totalAttempts}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Highest Score</span>
            <span className="text-3xl font-display font-extrabold text-fuchsia-600 dark:text-fuchsia-400 mt-1 block">
              {highestScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. SVG Circular Progress Dial for Average Score */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4 block">Average Score</span>
        
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* SVG Circular Ring */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800/60"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated foreground indicator */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-black text-slate-800 dark:text-slate-100">
              {averageScore}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Accuracy
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 font-medium">
          {averageScore >= 80 ? '🏆 Exceptional performance!' : averageScore >= 50 ? '📈 Steady progress, keep practicing!' : '🎯 Practice makes perfect!'}
        </p>
      </div>

      {/* 3. SVG Bar Chart - Category Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 block">Topic Mastery</span>
        <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 mb-6">Category Breakdown</h3>
        
        {categoryBreakdown && categoryBreakdown.length > 0 ? (
          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={cat._id || idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{cat.categoryName}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{cat.averageScore}% ({cat.count} {cat.count === 1 ? 'quiz' : 'quizzes'})</span>
                </div>
                
                {/* SVG Horizontal Rounded Bar */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.averageScore}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-sm text-slate-400 font-medium">No category breakdown data available.</span>
            <p className="text-xs text-slate-400 mt-1">Take a quiz in any category to see analytics here.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ScoreAnalytics;
