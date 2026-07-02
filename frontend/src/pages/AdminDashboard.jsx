import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Settings, Plus, Edit2, Trash2, BookOpen, HelpCircle, Save, X } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const { addToast } = useToast();

  // Navigation state (questions vs categories tab)
  const [activeTab, setActiveTab] = useState('questions');

  // Backend data
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category creation form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Question form states (handles both Create and Edit)
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [qCategory, setQCategory] = useState('');
  const [qDifficulty, setQDifficulty] = useState('medium');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qSubmitting, setQSubmitting] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [catRes, questRes] = await Promise.all([
        fetch('/api/quizzes/categories', { headers }),
        fetch('/api/admin/questions', { headers }),
      ]);

      if (!catRes.ok || !questRes.ok) {
        throw new Error('Failed to load administration data');
      }

      const catData = await catRes.json();
      const questData = await questRes.json();

      setCategories(catData);
      setQuestions(questData);

      // Pre-select first category in option state if available
      if (catData.length > 0) {
        setQCategory(catData[0]._id);
      }
    } catch (err) {
      addToast(err.message || 'Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catDesc) {
      addToast('Please fill in all category fields', 'warning');
      return;
    }

    setCatSubmitting(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: catName, description: catDesc }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }

      addToast(`Category "${data.name}" added successfully!`, 'success');
      setCatName('');
      setCatDesc('');
      
      // Refresh list
      setCategories((prev) => [...prev, data]);
      if (qCategory === '') {
        setQCategory(data._id);
      }
    } catch (err) {
      addToast(err.message || 'Error creating category', 'error');
    } finally {
      setCatSubmitting(false);
    }
  };

  // Option input change handler
  const handleOptionChange = (idx, value) => {
    const updatedOptions = [...qOptions];
    updatedOptions[idx] = value;
    setQOptions(updatedOptions);
  };

  // Reset Question Form state
  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect(0);
    setQDifficulty('medium');
    if (categories.length > 0) {
      setQCategory(categories[0]._id);
    }
  };

  // Submit Question handler (Create or Update)
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    
    if (!qCategory || !qText || qOptions.some((opt) => !opt.trim())) {
      addToast('Please fill in all question fields (including all 4 options)', 'warning');
      return;
    }

    setQSubmitting(true);
    try {
      const url = editingQuestionId 
        ? `/api/admin/questions/${editingQuestionId}` 
        : '/api/admin/questions';
      
      const method = editingQuestionId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: qCategory,
          difficulty: qDifficulty,
          questionText: qText,
          options: qOptions,
          correctAnswer: qCorrect,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Question update failed');
      }

      addToast(
        editingQuestionId 
          ? 'Question updated successfully!' 
          : 'Question added successfully!', 
        'success'
      );
      
      resetQuestionForm();
      
      // Refresh data
      const headers = { 'Authorization': `Bearer ${token}` };
      const qRes = await fetch('/api/admin/questions', { headers });
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData);
      }
    } catch (err) {
      addToast(err.message || 'Error processing question', 'error');
    } finally {
      setQSubmitting(false);
    }
  };

  // Edit action trigger
  const handleEditClick = (q) => {
    setEditingQuestionId(q._id);
    setQCategory(q.category?._id || q.category);
    setQDifficulty(q.difficulty);
    setQText(q.questionText);
    setQOptions([...q.options]);
    setQCorrect(q.correctAnswer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Question handler
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/admin/questions/${qId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      addToast('Question removed successfully!', 'success');
      setQuestions((prev) => prev.filter((q) => q._id !== qId));
    } catch (err) {
      addToast(err.message || 'Error deleting question', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Entering control tower...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Title Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Settings</span>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-slate-100 flex items-center gap-3 mt-1">
          <Settings className="text-indigo-600 dark:text-indigo-400" size={32} />
          Administration Control
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure game categories and compose/edit multi-choice questionnaire cards.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-4">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-4 px-2 font-display font-bold text-sm tracking-tight border-b-2 cursor-pointer transition-all ${
            activeTab === 'questions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-btn-questions"
        >
          Questions Pool ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 font-display font-bold text-sm tracking-tight border-b-2 cursor-pointer transition-all ${
            activeTab === 'categories'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-btn-categories"
        >
          Categories Manager ({categories.length})
        </button>
      </div>

      {/* Tabs View Content */}
      {activeTab === 'questions' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Question Form (Left Column, col-span 1) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
              <Plus size={18} className="text-indigo-500" />
              {editingQuestionId ? 'Edit Question' : 'Compose Question'}
            </h2>

            <form onSubmit={handleQuestionSubmit} className="space-y-4" id="question-form">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Category Association</label>
                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Difficulty Grade</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Question Content</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Enter the question text..."
                />
              </div>

              {/* MCQ Options (A, B, C, D) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block mb-1">Answer Options</label>
                {qOptions.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer Select */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-400">Correct Answer Choice</label>
                <select
                  value={qCorrect}
                  onChange={(e) => setQCorrect(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-4">
                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={resetQuestionForm}
                    className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X size={12} />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={qSubmitting}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-200/50 dark:shadow-none"
                >
                  <Save size={12} />
                  {qSubmitting ? 'Syncing...' : editingQuestionId ? 'Update' : 'Publish'}
                </button>
              </div>

            </form>
          </div>

          {/* Question List (Right, col-span 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle size={18} className="text-indigo-500" />
              Active Question Database
            </h2>

            {questions.length > 0 ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="p-4 border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl flex flex-col justify-between md:flex-row md:items-start gap-4 text-xs font-medium"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold">
                        <span className="bg-indigo-50 border border-indigo-200/20 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded">
                          {q.category?.name || 'Uncategorized'}
                        </span>
                        <span className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 px-2 py-0.5 rounded capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold leading-relaxed">
                        {q.questionText}
                      </p>
                      
                      {/* Choices preview */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded border truncate ${
                                isCorrect 
                                  ? 'border-emerald-300 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-bold' 
                                  : 'border-slate-100 bg-white/40 dark:border-slate-900 dark:bg-transparent text-slate-500'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operations */}
                    <div className="flex md:flex-col gap-2 flex-shrink-0 self-end md:self-start">
                      <button
                        onClick={() => handleEditClick(q)}
                        className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-2 border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No questions exist in database. Add a question to start!
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Category tab view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Create Category Form (Left) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
              <Plus size={18} className="text-indigo-500" />
              Add Category
            </h2>

            <form onSubmit={handleCreateCategory} className="space-y-4" id="category-form">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Science & Tech"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Summarize what topics this category covers..."
                />
              </div>

              <button
                type="submit"
                disabled={catSubmitting}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-200/50 dark:shadow-none"
              >
                <Plus size={12} />
                {catSubmitting ? 'Syncing...' : 'Add Category'}
              </button>
            </form>
          </div>

          {/* Category List (Right, col-span 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-500" />
              Active Categories List
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div
                  key={c._id}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[9px]">
                      Topic ID: {c._id}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">
                      {c.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
