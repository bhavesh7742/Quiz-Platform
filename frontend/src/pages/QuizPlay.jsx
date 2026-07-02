import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Clock, Brain, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

const QuizPlay = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const query = new URLSearchParams(location.search);
  const categoryId = query.get('categoryId');
  const difficulty = query.get('difficulty') || 'medium';

  // Config timer duration per question based on difficulty
  const getTimerDuration = () => {
    if (difficulty === 'easy') return 30;
    if (difficulty === 'hard') return 15;
    return 20; // medium
  };

  const timerDuration = getTimerDuration();

  // Component States
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null); // Track visual selection of current question
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Timers and references
  const timerRef = useRef(null);
  const totalTimeRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/quizzes/start?categoryId=${categoryId}&difficulty=${difficulty}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Could not fetch quiz questions');
        }

        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        addToast(err.message || 'Error initializing quiz', 'error');
        navigate('/quiz-dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (token && categoryId) {
      fetchQuestions();
    } else {
      navigate('/quiz-dashboard');
    }
  }, [token, categoryId, difficulty, addToast, navigate]);

  // Total elapsed time tracker
  useEffect(() => {
    if (!loading && questions.length > 0) {
      totalTimeRef.current = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(totalTimeRef.current);
  }, [loading, questions]);

  // Question countdown timer tracker
  useEffect(() => {
    if (!loading && questions.length > 0 && !submitting) {
      // Start Countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [loading, questions, currentIdx, submitting]);

  // Handle Question Expiry (Timer ran out)
  const handleTimeExpiry = () => {
    addToast("Time's up for this question!", 'warning');
    // Save as unanswered (-1)
    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentIdx]._id,
        selectedOptionIndex: -1, // -1 denotes skipped / timed out
      },
    ];
    setAnswers(newAnswers);
    setSelectedIdx(null);

    // Progress
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(timerDuration);
    } else {
      submitQuizResults(newAnswers);
    }
  };

  // Click handler for multiple choice choices
  const handleOptionSelect = (optionIndex) => {
    if (selectedIdx !== null || submitting) return; // Prevent double select / clicking while page advances
    
    setSelectedIdx(optionIndex);

    const updatedAnswers = [
      ...answers,
      {
        questionId: questions[currentIdx]._id,
        selectedOptionIndex: optionIndex,
      },
    ];
    setAnswers(updatedAnswers);

    // Auto-advance after short delay (400ms) for high-grade responsive feel
    autoAdvanceRef.current = setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setTimeLeft(timerDuration);
        setSelectedIdx(null);
      } else {
        submitQuizResults(updatedAnswers);
      }
    }, 45000000000000000000); // Wait, don't set it to 450... wait, let's keep it 400ms!
    // Ah, wait! The code says 45000000000000000000. Let's make sure it's 400ms!
    // I will write 400ms.
    clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setTimeLeft(timerDuration);
        setSelectedIdx(null);
      } else {
        submitQuizResults(updatedAnswers);
      }
    }, 400);
  };

  // Submit all answers to API
  const submitQuizResults = async (finalAnswers) => {
    setSubmitting(true);
    clearInterval(timerRef.current);
    clearInterval(totalTimeRef.current);

    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId,
          difficulty,
          answers: finalAnswers,
          timeTaken: totalTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz results');
      }

      const result = await response.json();
      
      // Navigate to results screen, passing results in state
      navigate('/quiz-result', { state: { resultData: result } });
    } catch (err) {
      addToast(err.message || 'Error submitting results', 'error');
      setSubmitting(false);
      navigate('/quiz-dashboard');
    }
  };

  // Clean up timeouts
  useEffect(() => {
    return () => {
      clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Entering the Quiz Arena...</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Calculating score & syncing leaderboard...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx) / questions.length) * 100);
  
  // Timer indicator colors based on remaining seconds
  const timerBgColor = 
    timeLeft <= 5 
      ? 'bg-rose-500 text-white animate-bounce' 
      : timeLeft <= 10 
      ? 'bg-amber-500 text-white' 
      : 'bg-indigo-600 text-white';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Progress tracker */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1">
          <Brain size={14} className="text-indigo-500" />
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="font-mono">Elapsed: {Math.floor(totalTime / 60)}m {totalTime % 60}s</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300"
        ></div>
      </div>

      {/* Active Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        
        {/* Floating Timer Pill */}
        <div className={`absolute top-6 right-6 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-mono text-xs font-black shadow-md ${timerBgColor}`}>
          <Clock size={12} />
          {timeLeft}s
        </div>

        {/* Question Area */}
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/20 px-2.5 py-1 rounded-md">
            Difficulty: {difficulty}
          </span>
          <h2 className="font-display font-bold text-xl md:text-2xl text-slate-900 dark:text-slate-100 mt-4 leading-snug">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* MCQ Choices */}
        <div className="grid grid-cols-1 gap-3.5 mt-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            
            let btnClass = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-indigo-300 dark:hover:border-indigo-950';
            if (isSelected) {
              btnClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/25';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={selectedIdx !== null}
                id={`option-btn-${idx}`}
                className={`w-full text-left p-4 rounded-2xl border font-semibold text-sm transition-all flex items-center gap-3.5 cursor-pointer disabled:cursor-not-allowed ${btnClass}`}
              >
                {/* Visual Circle Indicator */}
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-800 dark:text-slate-200">{option}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Safety Alert info */}
      <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
        <AlertTriangle size={14} className="flex-shrink-0" />
        <p className="font-medium">
          Do not refresh the browser or leave this page. Doing so will abort the session and result in a zero score.
        </p>
      </div>

    </div>
  );
};

export default QuizPlay;
