import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Bell, Lock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => toast('Profile editing coming soon!')}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-600" /> Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-purple-700' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => !isDark || toggleTheme()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${!isDark ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            onClick={() => isDark || toggleTheme()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isDark ? 'border-purple-400 bg-purple-900/20 text-purple-400' : 'border-gray-200 text-gray-500'}`}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-purple-600" /> Notifications
        </h2>
        {['Email notifications', 'SMS reminders', 'Browser push notifications'].map((item) => (
          <div key={item} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-700 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-purple-600" /> Security
        </h2>
        <button
          onClick={() => toast('Password change coming soon!')}
          className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold shadow-lg shadow-purple-700/25 transition-colors"
        >
          Change Password
        </button>
      </div>
    </motion.div>
  );
}
