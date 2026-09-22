import React from 'react';
import { 
  Search, Flame, Zap, Moon, Sun, Volume2, VolumeX, BookOpen, Menu
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenSearch, onToggleSidebar, activeTab }) {
  const { theme, toggleTheme } = useTheme();
  const { user, soundEnabled, setSoundEnabled } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Brand indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              AI Study Buddy
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar Trigger (Ctrl+K) */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-sm text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search topics, quizzes, flashcards, code...</span>
          </div>
          <kbd className="px-2 py-0.5 text-xs font-mono font-semibold bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Gamification Badges, Controls & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Badge */}
        <div 
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-bold"
          title={`${user.streak_days} Day Study Streak`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span>{user.streak_days}d</span>
        </div>

        {/* XP Badge */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold"
          title={`Level ${user.level} (${user.xp} XP)`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{user.xp} XP</span>
          <span className="hidden sm:inline opacity-75 font-normal">| Lv {user.level}</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Dark/Light Mode */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-8 h-8 rounded-full border border-indigo-400 dark:border-indigo-500 bg-slate-100 dark:bg-slate-800"
          />
        </div>
      </div>
    </header>
  );
}
