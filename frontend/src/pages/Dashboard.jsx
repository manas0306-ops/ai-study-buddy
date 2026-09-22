import React, { useEffect, useState } from 'react';
import { 
  Flame, Zap, BookOpen, ArrowRight, Target, AlertCircle, 
  Sparkles, CheckCircle2, ChevronRight, Play, Terminal, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const greeting = data?.greeting || `Good morning, ${user.full_name} 👋`;
  const todayGoal = data?.today_goal || { target_questions: 20, completed_questions: 12, progress_percent: 60 };
  const continueLearning = data?.continue_learning || { subject: 'Python', topic: 'Loops & Iteration', progress_percent: 62 };
  const weakAreas = data?.weak_areas || [
    { name: 'Loops & Iteration', mastery: 62, difficulty: 'Intermediate' },
    { name: 'Lists & Dictionaries', mastery: 68, difficulty: 'Intermediate' },
    { name: 'Recursion', mastery: 54, difficulty: 'Advanced' }
  ];
  const aiRecommendation = data?.ai_recommendation || "You've struggled with recursion twice. Spend 15 minutes reviewing recursion before attempting another quiz.";
  const actionItems = data?.action_items || [];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Ready to continue learning today? Your study companion is customized to your pace.
          </p>
        </div>

        {/* Quick Study Pack Action */}
        <button
          onClick={() => onNavigate('explainer', { topic: 'Recursion' })}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>One-Click Study Pack</span>
        </button>
      </div>

      {/* 4 Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-500">
            <Flame className="w-6 h-6 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Streak</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{user.streak_days} Day Streak</div>
            <div className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">Active today! Keep it going 🔥</div>
          </div>
        </div>

        {/* XP & Level */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{user.xp.toLocaleString()} XP</div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Level {user.level} Scholar</div>
          </div>
        </div>

        {/* Today's Goal Progress */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Today's Goal</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{todayGoal.completed_questions}/{todayGoal.target_questions} Qs</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${todayGoal.progress_percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">{todayGoal.progress_percent}% completed</div>
          </div>
        </div>

        {/* Weak Areas Indicator */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weak Areas</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{weakAreas.length} Topics</div>
            <div className="text-[11px] text-rose-500 font-semibold">Priority: {weakAreas[0]?.name.split(' ')[0] || 'Recursion'}</div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              AI Study Recommendation
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
              {aiRecommendation}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('explainer', { topic: 'Recursion' })}
          className="self-start md:self-auto shrink-0 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition"
        >
          <span>Review Recursion Now</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
        </button>
      </div>

      {/* Main Grid: Continue Learning + Weak Areas Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning card (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Continue Learning</h3>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              {continueLearning.subject}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Current Module</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {continueLearning.topic}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Mastery: {continueLearning.progress_percent}% • Estimated review time: 15 mins
              </div>
            </div>

            <button
              onClick={() => onNavigate('learn', { topic: continueLearning.slug })}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume Lesson</span>
            </button>
          </div>

          {/* Action Items List */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Personalized Next Steps
            </h4>
            <div className="space-y-2">
              {actionItems.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition" />
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (item.type === 'study_topic') onNavigate('learn');
                      else if (item.type === 'review_flashcards') onNavigate('flashcards');
                      else if (item.type === 'practice_code') onNavigate('coding_lab');
                      else if (item.type === 'play_game') onNavigate('games');
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-hover:translate-x-0.5 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak Areas Breakdown (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Weak Areas</h3>
              <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                Needs Attention
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Concepts where recent quiz performance was below 70%.
            </p>

            <div className="space-y-4">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{area.name}</span>
                    <span className="font-bold text-rose-500">{area.mastery}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                      style={{ width: `${area.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('quizzes')}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition text-center"
          >
            Practice Weak Topics Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
