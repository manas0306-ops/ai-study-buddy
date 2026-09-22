import React, { useState } from 'react';
import { 
  User, Flame, Zap, Award, Check, Settings, 
  Languages, Target, Shield, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser, playSound } = useAuth();

  const [fullName, setFullName] = useState(user.full_name);
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferred_language || 'English');
  const [preferredDifficulty, setPreferredDifficulty] = useState(user.preferred_difficulty || 'Intermediate');
  const [dailyGoalQuestions, setDailyGoalQuestions] = useState(user.daily_goal_questions || 20);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user.daily_goal_minutes || 45);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      full_name: fullName,
      preferred_language: preferredLanguage,
      preferred_difficulty: preferredDifficulty,
      daily_goal_questions: dailyGoalQuestions,
      daily_goal_minutes: dailyGoalMinutes
    }));
    setSaved(true);
    playSound('success');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Learner Profile & Settings 👤
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your daily targets, preferred language (English/Hindi/Hinglish), and learning style.
        </p>
      </div>

      {/* Top Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className="w-24 h-24 rounded-3xl border-2 border-indigo-500 bg-slate-100 dark:bg-slate-800 p-1 shadow-md"
        />

        <div className="space-y-1 text-center sm:text-left flex-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {user.full_name}
          </h2>
          <div className="text-xs text-slate-400">@{user.username} • {user.email || 'student@studybuddy.ai'}</div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              {user.streak_days} Day Streak
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              {user.xp.toLocaleString()} XP (Level {user.level})
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              <Languages className="w-3.5 h-3.5" />
              {preferredLanguage}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-500" />
          Study Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Preferred Language (Bilingual Mode)
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Hinglish">Hinglish (Hindi in Roman script)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Default Difficulty
            </label>
            <select
              value={preferredDifficulty}
              onChange={(e) => setPreferredDifficulty(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Daily Target Questions
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={dailyGoalQuestions}
              onChange={(e) => setDailyGoalQuestions(Number(e.target.value))}
              className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-emerald-500 font-bold">
            {saved && 'Preferences saved successfully!'}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
