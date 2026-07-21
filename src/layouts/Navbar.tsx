import { useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState(3);

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() ?? 'A';

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
              {notifications}
            </span>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Admin</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50"
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { logout(); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
