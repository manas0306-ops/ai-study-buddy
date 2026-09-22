import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  HelpCircle,
  Layers,
  CheckSquare,
  Terminal,
  Gamepad2,
  FileText,
  Calendar,
  BarChart3,
  Award,
  FolderGit2,
  User,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'learn', label: 'Learn & Paths', icon: Compass, badge: 'New' },
  { id: 'ai_tutor', label: 'AI Tutor', icon: Sparkles, badge: '6 Modes' },
  { id: 'explainer', label: 'Concept Explainer', icon: HelpCircle, badge: '11-Step' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: 'SM-2' },
  { id: 'quizzes', label: 'Quizzes', icon: CheckSquare, badge: 'Adaptive' },
  { id: 'coding_lab', label: 'Coding Lab', icon: Terminal, badge: 'Sandbox' },
  { id: 'games', label: 'Learning Games', icon: Gamepad2, badge: '10 Games' },
  { id: 'notes', label: 'Notes & Upload', icon: FileText, badge: 'PDF' },
  { id: 'planner', label: 'Study Planner', icon: Calendar, badge: null },
  { id: 'progress', label: 'Progress Analytics', icon: BarChart3, badge: null },
  { id: 'projects', label: 'Guided Projects', icon: FolderGit2, badge: null },
  { id: 'achievements', label: 'Achievements', icon: Award, badge: '12' },
  { id: 'profile', label: 'Profile & Settings', icon: User, badge: null },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => { setActiveTab('dashboard'); onClose(); }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                AI Study Buddy
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Personal Companion
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items scrollable list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              AI System Active
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Multi-provider & offline fallback ready.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
