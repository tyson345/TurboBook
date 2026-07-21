import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back! 👋');
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-purple-700 flex items-center justify-center mb-3 shadow-lg shadow-purple-700/30"
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Turbo<span className="text-purple-700">Book</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
          </div>

          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">Demo credentials</p>
            <p className="text-xs text-purple-600 dark:text-purple-300 mt-0.5">admin@turbobook.com / 123456</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@turbobook.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 dark:text-white ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-200 dark:border-gray-700 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 dark:text-white ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-300'
                      : 'border-gray-200 dark:border-gray-700 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-end">
              <Link to="#" className="text-xs text-purple-700 dark:text-purple-400 hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-lg shadow-purple-700/30 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="#" className="text-purple-700 dark:text-purple-400 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
