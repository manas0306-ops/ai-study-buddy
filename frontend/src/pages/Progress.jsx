import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Flame, Zap, Award, Target, Clock, 
  CheckCircle2, TrendingUp, Calendar, BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Progress() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProgress()
      .then(res => setAnalytics(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  const weekly = analytics?.weekly_activity || [];
  const mastery = analytics?.topic_mastery || [];
  const summary = analytics?.summary || {
    total_xp: user.xp,
    current_streak: user.streak_days,
    problems_solved: 38,
    quizzes_completed: 14,
    average_accuracy: 78.4,
    total_study_hours: 18.5
  };

  const maxMinutes = Math.max(...weekly.map(w => w.minutes), 60);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Learning Analytics & Mastery 📊
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visual breakdowns of study time, accuracy trends, and topic-by-topic comprehension.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Study Time</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.total_study_hours} hrs</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">Top 5% consistency</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Accuracy</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{summary.average_accuracy}%</div>
          <div className="text-[11px] text-indigo-500 font-semibold mt-0.5">14 Quizzes Taken</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Problems</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{summary.problems_solved}</div>
          <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Solved across Python & JS</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</div>
          <div className="text-2xl font-black text-orange-500 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span>{summary.current_streak}d</span>
          </div>
          <div className="text-[11px] text-orange-500 font-semibold mt-0.5">Unbroken record</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Weekly Study Minutes
            </h3>
            <span className="text-xs text-slate-400 font-bold">Past 7 Days</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {weekly.map((day, idx) => {
              const heightPct = Math.max(15, (day.minutes / maxMinutes) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {day.minutes}m
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-36 rounded-2xl flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-xl transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topic Mastery Radar Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              Topic Mastery Profile
            </h3>
            <span className="text-xs text-slate-400 font-bold">Concept Retention</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {mastery.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.topic}</span>
                  <span className={`font-black ${item.mastery >= 75 ? 'text-emerald-500' : (item.mastery >= 60 ? 'text-amber-500' : 'text-rose-500')}`}>
                    {item.mastery}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.mastery >= 75
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : (item.mastery >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-pink-400')
                    }`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
