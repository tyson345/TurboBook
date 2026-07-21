import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User as UserIcon, Phone, MapPin, ArrowLeft, ShieldCheck, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICE_TYPES, SIGNUP_PURPOSES, downloadExcel } from '../lib/excelStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

type Mode = 'login' | 'signup' | 'forgot' | 'forgot-verify' | 'forgot-reset';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serviceType, setServiceType] = useState<string>('');

  // signup
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [location, setLocation] = useState('');
  const [purpose, setPurpose] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState('');

  // forgot password
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetFields = () => {
    setErrors({});
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    resetFields();
  };

  /* ----------------------------- Sign In ----------------------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    if (!serviceType) errs.serviceType = 'Please select a service type';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await login(email, password, serviceType);
      if (res.ok) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(res.error || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Sign Up ----------------------------- */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone is required';
    if (!signupEmail.trim()) errs.signupEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.signupEmail = 'Enter a valid email';
    if (!location.trim()) errs.location = 'Current location is required';
    if (!purpose) errs.purpose = 'Please select what you are here for';
    if (!signupPassword.trim()) errs.signupPassword = 'Password is required';
    else if (signupPassword.length < 6) errs.signupPassword = 'Password must be at least 6 characters';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await signup({
        fullName,
        phone,
        email: signupEmail,
        location,
        purpose,
        password: signupPassword,
      });
      if (res.ok) {
        toast.success('Account created! Welcome to TurboBook');
        navigate('/dashboard');
      } else {
        toast.error(res.error || 'Could not create account');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Forgot Password ----------------------- */
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!contact.trim()) errs.contact = 'Enter your email or phone number';
    else if (!/\S+@\S+\.\S+/.test(contact) && contact.replace(/\D/g, '').length < 7)
      errs.contact = 'Enter a valid email or phone number';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setLoading(false);
      setMode('forgot-verify');
      toast.success(`Verification code sent (demo): ${code}`);
    }, 700);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) {
      setErrors({ enteredCode: 'Enter the verification code' });
      return;
    }
    if (enteredCode !== verificationCode) {
      setErrors({ enteredCode: 'Incorrect verification code' });
      return;
    }
    setErrors({});
    setMode('forgot-reset');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setErrors({ newPassword: 'Enter a new password' });
      return;
    }
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await resetPassword(contact, newPassword);
      if (res.ok) {
        toast.success('Password reset successfully. Please sign in.');
        setContact('');
        setEnteredCode('');
        setNewPassword('');
        setVerificationCode('');
        switchMode('login');
      } else {
        toast.error(res.error || 'Could not reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Render ----------------------------- */
  const inputClass = (err?: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-800 dark:text-white ${
      err
        ? 'border-red-400 focus:ring-red-300'
        : 'border-gray-200 dark:border-gray-700 focus:ring-purple-500/30 focus:border-purple-400'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
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
          <div className="flex flex-col items-center mb-6">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'login' && 'Sign in to your account'}
              {mode === 'signup' && 'Create a new account'}
              {mode === 'forgot' && 'Reset your password'}
              {mode === 'forgot-verify' && 'Verify the code'}
              {mode === 'forgot-reset' && 'Set a new password'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ---------------- Sign In ---------------- */}
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass(errors.email)}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass(errors.password)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    What service are you here for?
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className={inputClass(errors.serviceType)}
                  >
                    <option value="">Select a service…</option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && <p className="mt-1 text-xs text-red-500">{errors.serviceType}</p>}
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs text-purple-700 dark:text-purple-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
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
                      <span>Signing in…</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* ---------------- Sign Up ---------------- */}
            {mode === 'signup' && (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSignup}
                className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className={inputClass(errors.fullName)}
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 000 1234"
                      className={inputClass(errors.phone)}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass(errors.signupEmail)}
                    />
                  </div>
                  {errors.signupEmail && <p className="mt-1 text-xs text-red-500">{errors.signupEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className={inputClass(errors.location)}
                    />
                  </div>
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    What are you here for?
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={inputClass(errors.purpose)}
                  >
                    <option value="">Select a purpose…</option>
                    {SIGNUP_PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.purpose && <p className="mt-1 text-xs text-red-500">{errors.purpose}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className={inputClass(errors.signupPassword)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.signupPassword && <p className="mt-1 text-xs text-red-500">{errors.signupPassword}</p>}
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
                      <span>Creating account…</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* ---------------- Forgot: send code ---------------- */}
            {mode === 'forgot' && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendCode}
                className="space-y-5"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter the email or phone number linked to your account. We'll send a verification code.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="you@example.com or +1 555 000 1234"
                      className={inputClass(errors.contact)}
                    />
                  </div>
                  {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
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
                      <span>Sending code…</span>
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* ---------------- Forgot: verify code ---------------- */}
            {mode === 'forgot-verify' && (
              <motion.form
                key="forgot-verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleVerifyCode}
                className="space-y-5"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A 6-digit code was sent. For this demo it is shown in the notification toast.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Verification Code
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      placeholder="123456"
                      className={inputClass(errors.enteredCode)}
                    />
                  </div>
                  {errors.enteredCode && <p className="mt-1 text-xs text-red-500">{errors.enteredCode}</p>}
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-lg shadow-purple-700/30 transition-all duration-200"
                >
                  Verify Code
                </motion.button>
              </motion.form>
            )}

            {/* ---------------- Forgot: new password ---------------- */}
            {mode === 'forgot-reset' && (
              <motion.form
                key="forgot-reset"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">Verified. Choose a new password for your account.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className={inputClass(errors.newPassword)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
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
                      <span>Resetting…</span>
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer links */}
          <div className="mt-6 space-y-2">
            {mode === 'login' && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-purple-700 dark:text-purple-400 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-purple-700 dark:text-purple-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {(mode === 'forgot' || mode === 'forgot-verify' || mode === 'forgot-reset') && (
              <button
                onClick={() => switchMode('login')}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 font-medium"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </button>
            )}

            <button
              onClick={() => downloadExcel()}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-purple-700 dark:hover:text-purple-400 font-medium pt-1"
            >
              <Download className="h-3.5 w-3.5" /> Download stored Excel file
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
