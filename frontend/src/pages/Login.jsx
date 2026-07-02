import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, Brain } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      addToast('Logged in successfully! Welcome back.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-slide-up">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
        
        {/* Branding header */}
        <div className="text-center">
          <div className="inline-flex bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <Brain size={28} className="stroke-[2.5]" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account to resume your quest
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} id="login-form">
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  placeholder="Email address"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              id="btn-login-submit"
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-200/50 dark:shadow-none disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Alert Info */}
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 rounded-2xl text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-indigo-600 dark:text-indigo-400">💡 Quick Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <span className="font-semibold block text-[10px] text-slate-400">ADMIN:</span>
              <p>email: <code className="text-[10px] py-0.5">admin@quiz.com</code></p>
              <p>pass: <code className="text-[10px] py-0.5">admin123</code></p>
            </div>
            <div>
              <span className="font-semibold block text-[10px] text-slate-400">CHALLENGER:</span>
              <p>email: <code className="text-[10px] py-0.5">john@example.com</code></p>
              <p>pass: <code className="text-[10px] py-0.5">password123</code></p>
            </div>
          </div>
        </div>

        {/* Register Redirect */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline" id="link-to-register">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
