import React, { useState, useEffect } from 'react';
import { 
  Award, Flame, Zap, Crown, Target, Brain, 
  Terminal, Languages, Calendar, CheckCircle2, Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getAchievements(), api.getLeaderboard()])
      .then(([achRes, leadRes]) => {
        setAchievements(achRes);
        setLeaderboard(leadRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const xpRules = [
    { action: 'Quiz Correct Answer', xp: '+10 XP' },
    { action: 'Hard Question Solved', xp: '+20 XP' },
    { action: 'Daily Streak Bonus', xp: '+25 XP' },
    { action: 'Complete Full Lesson', xp: '+50 XP' },
    { action: 'Arcade Game Victory', xp: '+30 XP' },
    { action: 'Coding Problem Solved', xp: '+40 XP' },
    { action: 'Boss Slayer Raid', xp: '+100 XP' }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Achievements & Leaderboard 🏆
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Earn XP, climb the Diamond Scholar League, and unlock badges for milestones.
        </p>
      </div>

      {/* Grid: Achievements Badges + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 12 Badges Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Achievement Badges
            </h2>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              {achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((ach) => (
              <div
                key={ach.code}
                className={`p-4 rounded-3xl border transition flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-sm'
                    : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    ach.unlocked
                      ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {ach.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {ach.title}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-500">
                      +{ach.xp_reward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* XP Rules Reference Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 mt-6">
            <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              XP Rules & Level Multipliers
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {xpRules.map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">{rule.action}</div>
                  <div className="font-black text-slate-900 dark:text-white mt-0.5">{rule.xp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Diamond Scholar League Leaderboard (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {leaderboard?.league || 'Diamond Scholar League'}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {leaderboard?.days_left_in_season || 3} days left
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Top 3 learners advance to the Grandmaster tier at the end of the weekly sprint.
          </p>

          <div className="space-y-2 pt-2">
            {leaderboard?.ranks?.map((entry) => {
              const isYou = entry.name.includes('You');
              return (
                <div
                  key={entry.rank}
                  className={`p-3 rounded-2xl flex items-center justify-between transition ${
                    isYou
                      ? 'border border-indigo-300 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-black text-xs ${
                        entry.rank === 1 ? 'text-amber-500' : (entry.rank === 2 ? 'text-slate-400' : (entry.rank === 3 ? 'text-amber-700' : 'text-slate-500'))
                      }`}
                    >
                      #{entry.rank}
                    </span>

                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-200"
                    />

                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {entry.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{entry.streak}d streak</span>
                        <span>•</span>
                        <span className="text-indigo-500 font-semibold">{entry.badge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="font-black text-xs text-amber-500">
                    {entry.xp.toLocaleString()} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
