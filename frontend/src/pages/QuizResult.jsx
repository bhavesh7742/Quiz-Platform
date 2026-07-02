import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Award, Clock, ArrowRight, LayoutDashboard, Brain, Check, X, ShieldAlert } from 'lucide-react';

const QuizResult = () => {
  const location = useLocation();
  const { resultData } = location.state || {};

  if (!resultData) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-slide-up">
        <div className="bg-red-500/5 p-4 rounded-full border border-red-500/10 text-red-500 inline-block">
          <ShieldAlert size={36} />
        </div>
        <h2 className="font-display font-extrabold text-2xl">No Results Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          It seems you reached this page directly without finishing a quiz. Navigate back to the dashboard to begin.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { score, totalQuestions, correctAnswers, timeTaken, feedback } = resultData;

  // Grade calculation
  const getGrade = () => {
    if (score >= 90) return { title: 'Grandmaster', badge: '👑 S', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (score >= 80) return { title: 'Challenger', badge: '🥇 A', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
    if (score >= 50) return { title: 'Competitor', badge: '🥈 B', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    return { title: 'Apprentice', badge: '🥉 C', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
  };

  const grade = getGrade();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      {/* Title Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Summary</span>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-slate-100 mt-1">
          Challenge Finished!
        </h1>
      </div>

      {/* Main Results Scorecard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Circular SVG Percentage Dial */}
          <div className="flex flex-col items-center text-center justify-center p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-3xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Overall Score</span>
            <div className="relative flex items-center justify-center w-28 h-28">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="44" strokeWidth="8" fill="transparent" className="stroke-slate-100 dark:stroke-slate-800" />
                <circle
                  cx="56"
                  cy="56"
                  r="44"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 - (score / 100) * (2 * Math.PI * 44)}
                  className="stroke-indigo-600 dark:stroke-indigo-500"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xl font-display font-black text-slate-800 dark:text-slate-100">{score}%</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Accuracy</span>
              <div className="flex items-baseline gap-1 mt-1 text-slate-800 dark:text-slate-100">
                <span className="text-3xl font-display font-black text-indigo-600 dark:text-indigo-400">{correctAnswers}</span>
                <span className="text-slate-400 font-bold">/</span>
                <span className="text-lg text-slate-500 font-bold">{totalQuestions} Questions</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-semibold block">Time taken</span>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-slate-700 dark:text-slate-300 font-bold">
                <Clock size={16} className="text-slate-400" />
                <span>{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</span>
              </div>
            </div>
          </div>

          {/* Placement Grade Badge */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-2">Quiz Standing</span>
            <span className={`px-4 py-2 rounded-2xl text-2xl font-display font-black border ${grade.color}`}>
              {grade.badge}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-2 capitalize">{grade.title}</span>
          </div>

        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            to="/dashboard"
            id="result-btn-dashboard"
            className="w-full sm:w-auto px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            to="/quiz-dashboard"
            id="result-btn-replay"
            className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Brain size={16} />
            Play Again
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Choice Corrections Accordion */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Award size={18} className="text-indigo-500" />
          Review Questions
        </h2>

        <div className="space-y-4">
          {feedback.map((item, index) => {
            const isCorrect = item.isCorrect;
            const isTimedOut = item.selectedOptionIndex === -1;
            
            return (
              <div
                key={item.questionId || index}
                className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm transition-all ${
                  isCorrect 
                    ? 'border-emerald-200 dark:border-emerald-950' 
                    : 'border-rose-200 dark:border-rose-950'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0 ${
                      isCorrect 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-rose-500 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">
                      {item.questionText}
                    </h3>
                  </div>

                  {/* Icon Check/X */}
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 block">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 block">
                        <X size={14} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Options review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-5">
                  {item.options.map((opt, oIdx) => {
                    const isCorrectAnswer = oIdx === item.correctAnswerIndex;
                    const isUserSelection = oIdx === item.selectedOptionIndex;

                    let optStyle = 'border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-950/10';
                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-300 dark:border-emerald-950 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 font-semibold';
                    } else if (isUserSelection && !isCorrect) {
                      optStyle = 'border-rose-300 dark:border-rose-950 text-rose-700 dark:text-rose-400 bg-rose-500/5 font-semibold';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <span className="truncate">{opt}</span>
                        {isCorrectAnswer && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Correct Answer
                          </span>
                        )}
                        {isUserSelection && !isCorrect && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Timed Out Warning */}
                {isTimedOut && (
                  <p className="mt-3 text-[10px] font-semibold text-rose-500 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10 inline-block">
                    ⏱️ Timed out! You didn't submit an answer within the limit.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
