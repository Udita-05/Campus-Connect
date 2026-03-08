import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, Briefcase, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = "font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors";

  const navLinks = user ? (
    user.role === 'student' ? (
      <>
        <Link to="/jobs" className={linkClass}>Find Jobs</Link>
        <Link to="/applications" className={linkClass}>My Applications</Link>
      </>
    ) : user.role === 'recruiter' ? (
      <>
        <Link to="/recruiter-dashboard" className={linkClass}>Dashboard</Link>
        <Link to="/post-job" className="btn-primary flex items-center gap-2">
          <Briefcase size={18} /> Post a Job
        </Link>
      </>
    ) : (
      <>
        <Link to="/admin-dashboard" className={linkClass}>Admin Dashboard</Link>
      </>
    )
  ) : (
    <>
      <Link to="/login" className={linkClass}>Login</Link>
      <Link to="/signup" className="btn-primary">Sign Up</Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-1.5 rounded-lg shadow-lg shadow-primary-500/30">
              <Briefcase size={24} />
            </div>
            <span>Campus<span className="text-primary-600 dark:text-primary-500">Connect</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks}
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && (
              <div className="flex items-center gap-4 border-l pl-6 border-slate-200 dark:border-slate-800">
                <Link to={user.role === 'student' ? '/profile' : user.role === 'recruiter' ? '/recruiter-profile' : '/admin-dashboard'} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 mb-4 space-y-4 flex flex-col">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2 border-b dark:border-gray-800">
                    <User size={20} />
                    <span className="font-medium text-lg">{user.name}</span>
                  </div>
                  {user.role === 'student' ? (
                    <>
                      <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="py-2">Find Jobs</Link>
                      <Link to="/applications" onClick={() => setIsMenuOpen(false)} className="py-2">My Applications</Link>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="py-2">Profile</Link>
                    </>
                  ) : user.role === 'recruiter' ? (
                    <>
                      <Link to="/recruiter-dashboard" onClick={() => setIsMenuOpen(false)} className="py-2">Dashboard</Link>
                      <Link to="/post-job" onClick={() => setIsMenuOpen(false)} className="py-2 text-primary-600 font-medium">Post a Job</Link>
                      <Link to="/recruiter-profile" onClick={() => setIsMenuOpen(false)} className="py-2">Profile</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)} className="py-2">Admin Dashboard</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="text-left text-red-500 py-2 flex items-center gap-2">
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-2">Login</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
