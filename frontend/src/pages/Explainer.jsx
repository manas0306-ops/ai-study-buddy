import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Copy, Check, BookOpen, AlertTriangle, 
  HelpCircle, Terminal, Lightbulb, Languages, FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function Explainer({ initialTopic = 'Recursion' }) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');

  const fetchExplanation = (targetTopic, lang = selectedLanguage, lvl = selectedLevel) => {
    if (!targetTopic.trim()) return;
    setLoading(true);
    api.explainTopic(targetTopic, lvl, lang)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExplanation(initialTopic);
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickActions = [
    { label: 'Explain simpler', action: () => fetchExplanation(topic, selectedLanguage, 'Beginner') },
    { label: 'Give another example', action: () => fetchExplanation(topic, selectedLanguage, 'Intermediate') },
    { label: 'Translate to Hindi / Hinglish', action: () => fetchExplanation(topic, 'Hindi', selectedLevel) },
    { label: 'Give exam answer', action: () => fetchExplanation(topic, selectedLanguage, 'Exam') },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Concept Explainer 📖
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep, 11-step structured concept breakdown with analogies, code, common pitfalls, and MCQs.
        </p>
      </div>

      {/* Topic Search Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); fetchExplanation(topic); }}
        className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3"
      >
        <div className="pl-3 text-indigo-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter concept (e.g., 'What is recursion?', 'Binary Search Tree', 'SQL Joins')..."
          className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-40 transition"
        >
          {loading ? 'Analyzing...' : 'Generate Breakdown'}
        </button>
      </form>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {quickActions.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      )}

      {/* Main 11-Part Dossier */}
      {!loading && data && (
        <div className="space-y-6">
          {/* 1. One-line Definition */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/60">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              1. One-Line Definition
            </span>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
              {data.one_line_definition}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. Beginner Explanation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>2. Beginner Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.beginner_explanation}
              </p>
            </div>

            {/* 3. Real-World Analogy */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>3. Real-World Analogy</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.real_world_analogy}
              </p>
            </div>
          </div>

          {/* 4 & 5. Syntax and Standard Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. General Syntax Structure
              </span>
              <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto">
                {data.syntax}
              </pre>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                5. Conceptual Example
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {data.example}
              </p>
            </div>
          </div>

          {/* 6. Code Example with Copy */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>6. Complete Code Example</span>
              </div>
              <button
                onClick={() => handleCopyCode(data.code_example)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              {data.code_example}
            </pre>
          </div>

          {/* 7. Common Mistakes */}
          <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>7. Common Pitfalls & Mistakes</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {data.common_mistakes?.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 8 & 10. Interview Question & Practice Problem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                8. Technical Interview Question
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {data.interview_question}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                10. Hands-on Practice Problem
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {data.practice_problem}
              </p>
            </div>
          </div>

          {/* 9. MCQs Check */}
          {data.mcqs?.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>9. Quick Check Multiple Choice Question</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {data.mcqs[0].question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.mcqs[0].options.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. Quick Revision Summary */}
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              11. Quick Revision Summary
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
              {data.quick_revision_summary}
            </p>
          </div>

          {/* Bilingual section if available */}
          {data.bilingual_hindi && (
            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Languages className="w-4 h-4" />
                <span>द्विभाषी / Bilingual Hindi & Hinglish Insights</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <strong>परिभाषा:</strong> {data.bilingual_hindi.definition}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <strong>सरल उदाहरण:</strong> {data.bilingual_hindi.analogy}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
