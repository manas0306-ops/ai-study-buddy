import React, { useState, useEffect } from 'react';
import { 
  Compass, BookOpen, Layers, CheckCircle2, Lock, 
  ArrowRight, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = ['All', 'Programming', 'Computer Science', 'Mathematics', 'Career'];

export default function Learn({ onNavigate, initialTopic = null }) {
  const [subjects, setSubjects] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // "Teach Me From Zero" mode state
  const [zeroTopic, setZeroTopic] = useState('C++');
  const [zeroRoadmap, setZeroRoadmap] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getSubjects(), api.getLearningPaths()])
      .then(([subRes, pathRes]) => {
        setSubjects(subRes);
        setLearningPaths(pathRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTeachMeFromZero = (topicName) => {
    setZeroRoadmap([
      { step: 1, title: 'What is Programming & How Hardware Runs Code', status: 'Unlocked', duration: '15m' },
      { step: 2, title: `Syntax, Variables & Data Types in ${topicName}`, status: 'Unlocked', duration: '20m' },
      { step: 3, title: 'Conditional Logic: if, else & Truth Tables', status: 'Locked', duration: '25m' },
      { step: 4, title: 'Loops: while & for Iterations', status: 'Locked', duration: '30m' },
      { step: 5, title: 'Functions, Parameters & Call Stack', status: 'Locked', duration: '30m' },
      { step: 6, title: 'Arrays, Memory Pointers & Dynamic Allocation', status: 'Locked', duration: '40m' },
      { step: 7, title: 'Object-Oriented Programming (Classes & Objects)', status: 'Locked', duration: '45m' },
      { step: 8, title: 'Mini-Project & Capstone Assessment', status: 'Locked', duration: '60m' }
    ]);
  };

  const filteredSubjects = selectedCategory === 'All'
    ? subjects
    : subjects.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Subject Explorer & Learning Paths 🧭
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Structured curricula, beginner-to-advanced roadmaps, and topic libraries.
        </p>
      </div>

      {/* "Teach Me From Zero" Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/90 to-slate-900 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Feature
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            "Teach Me From Zero" Mode 🚀
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl leading-relaxed">
            Don't know anything about a subject? Pick any language or field, and AI Study Buddy generates a zero-prerequisite roadmap where topics unlock progressively.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={zeroTopic}
            onChange={(e) => setZeroTopic(e.target.value)}
            placeholder="e.g. C++, DSA, Rust"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 text-white text-xs border border-slate-700 focus:outline-none"
          />
          <button
            onClick={() => handleTeachMeFromZero(zeroTopic)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 transition"
          >
            Generate Roadmap
          </button>
        </div>
      </div>

      {/* Render Zero Roadmap if generated */}
      {zeroRoadmap && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Zero-to-Hero Roadmap: {zeroTopic}
            </h3>
            <button
              onClick={() => setZeroRoadmap(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Close Roadmap
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {zeroRoadmap.map((item) => (
              <div
                key={item.step}
                className={`p-4 rounded-2xl border transition ${
                  item.status === 'Unlocked'
                    ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-70'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-indigo-600 dark:text-indigo-400">Step {item.step}</span>
                  <span className="text-[10px] text-slate-400">{item.duration}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-3">
                  {item.title}
                </div>
                {item.status === 'Unlocked' ? (
                  <button
                    onClick={() => onNavigate('explainer', { topic: item.title })}
                    className="w-full py-1.5 rounded-xl bg-indigo-600 text-white text-[11px] font-bold"
                  >
                    Start Lesson
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 py-1.5">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          Structured Career Learning Paths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{path.category}</span>
                  <span className="text-slate-400 font-semibold">{path.estimated_hours}h estimated</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{path.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{path.description}</p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Progress: {path.completed_modules}/{path.total_modules} Modules</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{path.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${path.progress_percent}%` }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition"
              >
                <span>Continue Path</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Subject Library
          </h2>

          <div className="flex gap-1.5 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {sub.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{sub.topics_count} Topics</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{sub.description}</p>

                {/* Topics list preview */}
                <div className="space-y-1.5">
                  {sub.topics?.slice(0, 3).map((top) => (
                    <button
                      key={top.id}
                      onClick={() => onNavigate('explainer', { topic: top.name })}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs transition group"
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {top.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('explainer', { topic: sub.topics?.[0]?.name || sub.name })}
                className="mt-6 w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition text-center"
              >
                Explore All Topics
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
