import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, Circle, Sparkles, 
  ArrowRight, Flame, Target, BookOpen, Zap
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudyPlanner({ onNavigate }) {
  const { user, addXP, playSound } = useAuth();
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick revision state
  const [quickRevDuration, setQuickRevDuration] = useState(15);
  const [quickRevData, setQuickRevData] = useState(null);
  const [revLoading, setRevLoading] = useState(false);

  // New plan modal form
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [examSubject, setExamSubject] = useState('Data Structures & Algorithms');
  const [daysRemaining, setDaysRemaining] = useState(30);
  const [dailyHours, setDailyHours] = useState(2);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    setLoading(true);
    api.getStudyPlans()
      .then(res => {
        setPlans(res);
        if (res.length > 0) setActivePlan(res[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleToggleTask = async (dayNumber, currentStatus) => {
    if (!activePlan) return;
    try {
      await api.togglePlanTask(activePlan.id, dayNumber, !currentStatus);
      if (!currentStatus) {
        addXP(25);
        playSound('success');
      }
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickRevision = async (duration) => {
    setQuickRevDuration(duration);
    setRevLoading(true);
    try {
      const data = await api.getQuickRevision('Python', duration);
      setQuickRevData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRevLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    try {
      const newPlan = await api.generateStudyPlan({
        user_id: user.id,
        subject: examSubject,
        days_remaining: daysRemaining,
        daily_hours: dailyHours,
        current_level: 'Beginner'
      });
      setShowPlanModal(false);
      fetchPlans();
      playSound('level_up');
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Planner & Blitz Revision 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Day-by-day exam roadmaps with automated rescheduling and timed revision blitzes.
          </p>
        </div>

        <button
          onClick={() => setShowPlanModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Exam Plan</span>
        </button>
      </div>

      {/* QUICK REVISION MODE SECTION (Prompt Section 23) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              Quick Revision Mode ⚡
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Select available study time:
          </span>
        </div>

        {/* 4 Time Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[5, 15, 30, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleQuickRevision(mins)}
              className={`p-3 rounded-2xl border text-center font-bold text-xs transition ${
                quickRevDuration === mins && quickRevData
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-lg font-black">{mins} mins</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Blitz Session</div>
            </button>
          ))}
        </div>

        {/* Quick Revision Output */}
        {quickRevData && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>{quickRevData.duration_minutes}-Minute Review: {quickRevData.subject}</span>
              <span className="text-emerald-500 font-bold">+20 XP on completion</span>
            </div>

            {/* Definitions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickRevData.definitions?.map((d, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{d.term}: </span>
                  <span className="text-slate-600 dark:text-slate-300">{d.def}</span>
                </div>
              ))}
            </div>

            {/* Rapid Quiz Question */}
            {quickRevData.rapid_quiz?.length > 0 && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {quickRevData.rapid_quiz[0].q}
                </div>
                <div className="flex gap-2">
                  {quickRevData.rapid_quiz[0].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => alert(`Correct answer: ${quickRevData.rapid_quiz[0].a}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold hover:bg-indigo-50 text-slate-700 dark:text-slate-300"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACTIVE STUDY PLAN (Prompt Section 15) */}
      {activePlan && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Exam Preparation Plan
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {activePlan.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Exam Date: {activePlan.exam_date || 'Upcoming'} • {activePlan.daily_hours} hours/day scheduled
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400">Completed</div>
                <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {activePlan.completed_tasks} / {activePlan.total_tasks} Days
                </div>
              </div>
            </div>
          </div>

          {/* Day by Day Syllabus Checklist */}
          <div className="space-y-3">
            {activePlan.schedule?.map((item) => (
              <div
                key={item.day}
                onClick={() => handleToggleTask(item.day, item.completed)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  item.completed
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Day {item.day}: {item.topic}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {item.hours}h • {item.notes || 'Core concepts, flashcards & practice quiz'}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold ${item.completed ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {item.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Generate New Exam Plan */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Create AI Exam Study Plan
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Subject / Examination Name
                </label>
                <input
                  type="text"
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Days Remaining: {daysRemaining} days
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={daysRemaining}
                  onChange={(e) => setDaysRemaining(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Available Study Hours per Day: {dailyHours}h
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowPlanModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePlan}
                disabled={generatingPlan}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-40"
              >
                {generatingPlan ? 'Generating...' : 'Build Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
