import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Building, GraduationCap, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signup(name, email, password, role);
      navigate(role === 'student' ? '/profile' : '/recruiter-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex bg-slate-50 dark:bg-[#0B1120]">
      {/* Right side graphical split (swapped for Signup) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-[#090E17] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/80 via-[#0B1120] to-primary-900/60 opacity-90" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative h-full flex flex-col justify-center items-center text-white px-12 text-center pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">Start your journey <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary-300">today</span></h2>
            <p className="text-xl text-slate-300 max-w-md mx-auto leading-relaxed">Create your dynamic profile and get matched with top recruiters instantly.</p>
          </motion.div>
        </div>
      </div>

      {/* Left side Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md lg:w-[450px]"
        >
          <div className="mb-10 lg:text-left text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create an Account</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Join CampusConnect to begin 
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-8">
            
            {/* Role Selector Tabs */}
            <div className="flex rounded-xl p-1.5 bg-slate-100 dark:bg-slate-800/50 mb-8 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${role === 'student' ? 'bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={18} /> Student
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${role === 'recruiter' ? 'bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                onClick={() => setRole('recruiter')}
              >
                <Building size={18} /> Recruiter
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-100 dark:border-red-800/30">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name {role === 'recruiter' && <span className="text-slate-400 font-normal">(HR / Recruiter)</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-11"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex justify-center items-center gap-2 py-3 mt-6 shadow-lg hover:shadow-primary-500/40"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
              <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-500 hover:text-primary-500 dark:hover:text-primary-400">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
