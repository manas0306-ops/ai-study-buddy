import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingModal() {
  const { showOnboarding, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [learningFocus, setLearningFocus] = useState('Python');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(45);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [mainGoal, setMainGoal] = useState('Interview');

  if (!showOnboarding) return null;

  const handleFinish = () => {
    completeOnboarding({
      learningFocus,
      preferred_difficulty: currentLevel,
      daily_goal_minutes: dailyGoalMinutes,
      preferred_language: preferredLanguage,
      mainGoal
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Welcome to AI Study Buddy 👋
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Let's personalize your learning journey in 30 seconds.
            </p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                What are you primarily learning?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Python', 'DSA & Algorithms', 'C / C++', 'Web Development', 'DBMS & SQL', 'Operating Systems'].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setLearningFocus(sub)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition ${
                      learningFocus === sub
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                What is your current experience level?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentLevel(lvl)}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition ${
                      currentLevel === lvl
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                What is your primary goal?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Interview', label: 'Tech Job / Interview' },
                  { id: 'Exam', label: 'College Exams & Midterms' },
                  { id: 'Coding', label: 'Practical Coding Mastery' },
                  { id: 'Competitive', label: 'Competitive Programming' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setMainGoal(g.id)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition ${
                      mainGoal === g.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Preferred Explanation Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['English', 'Hindi', 'Hinglish'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLanguage(lang)}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition ${
                      preferredLanguage === lang
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition"
              >
                <Check className="w-4 h-4" />
                <span>Launch My Study Space</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
