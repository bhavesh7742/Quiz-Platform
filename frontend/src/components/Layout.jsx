import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Trophy, 
  LayoutDashboard, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Settings,
  Brain,
  User as UserIcon
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Play Quiz', path: '/quiz-dashboard', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to={isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-2" id="nav-logo">
                <div className="bg-gradient-to-tr from-indigo-600 to-fuchsia-600 p-2 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none animate-pulse">
                  <Brain size={22} className="stroke-[2.5]" />
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  Questify
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-1" aria-label="Main Navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                          : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}

                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    id="nav-link-admin"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/admin')
                        ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200 dark:shadow-none'
                        : 'text-slate-600 hover:text-fuchsia-600 dark:text-slate-300 dark:hover:text-fuchsia-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <Settings size={16} />
                    Admin
                  </Link>
                )}
              </nav>
            )}

            {/* Right side operations: Theme and User */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Toggle theme"
                id="theme-toggler"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* User Dropdown / Profile (Desktop Only) */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold truncate max-w-[120px]">{user?.username}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {user?.isAdmin ? 'Administrator' : 'Challenger'}
                    </span>
                  </div>
                  
                  <div className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl border border-indigo-200/30">
                    <UserIcon size={16} />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Logout"
                    id="btn-logout-desktop"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    id="btn-login-desktop"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    id="btn-register-desktop"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none rounded-xl transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  aria-label="Toggle menu"
                  id="mobile-menu-toggler"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-900 glass px-4 pt-2 pb-4 space-y-1 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  id={`mobile-nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

            {user?.isAdmin && (
              <Link
                to="/admin"
                id="mobile-nav-link-admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                <Settings size={18} />
                Admin Panel
              </Link>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl">
                  <UserIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user?.username}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user?.isAdmin ? 'Admin' : 'Challenger'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-rose-500 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                id="mobile-btn-logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 mt-12 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Questify Inc. All rights reserved. Crafted with excellence.</p>
          <div className="flex gap-4">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">CodTech Intern Project</span>
            <span className="border-l border-slate-200 dark:border-slate-800 pl-4">Intern ID: CITS5188</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
