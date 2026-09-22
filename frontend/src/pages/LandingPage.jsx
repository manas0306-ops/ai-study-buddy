import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, BookOpen, Layers, CheckSquare, Terminal, 
  Gamepad2, FileText, Calendar, BarChart3, Flame, Award, ChevronDown, Check, Star
} from 'lucide-react';

export default function LandingPage({ onStartLearning }) {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    { title: '🧠 AI Tutor', desc: '6 conversational tutoring modes including Exam, Socratic, Deep Dive & Bilingual Hindi.', color: 'from-indigo-500 to-purple-500' },
    { title: '🃏 AI Flashcards', desc: 'Active recall cards with SuperMemo SM-2 spaced repetition and 3D card flips.', color: 'from-purple-500 to-pink-500' },
    { title: '📝 Adaptive Quizzes', desc: 'Multi-format quizzes that dynamically scale difficulty and diagnose misconceptions.', color: 'from-blue-500 to-cyan-500' },
    { title: '💻 Coding Lab', desc: 'Interactive compiler sandbox for Python, JS, C, C++, Java with pedagogical AI debugger.', color: 'from-emerald-500 to-teal-500' },
    { title: '🎮 10 Learning Games', desc: 'Code Rush, Bug Hunter, Output Predictor, SQL Detective, AI Quiz Boss and more.', color: 'from-amber-500 to-orange-500' },
    { title: '📚 Smart Notes & Docs', desc: 'Upload PDF, DOCX, or TXT notes and instantly generate study packs and summaries.', color: 'from-rose-500 to-red-500' },
    { title: '🎯 Personalized Planner', desc: 'Day-by-day exam schedules, daily goals, and 5 to 60 minute blitz revision sessions.', color: 'from-violet-500 to-indigo-500' },
    { title: '📊 Progress Tracking', desc: 'Track streaks, XP leagues, mastery radar charts, and unlock 12+ achievement badges.', color: 'from-yellow-500 to-amber-500' },
  ];

  const steps = [
    { num: '01', title: 'Learn It', desc: 'Explore bite-sized explanations, real-world analogies, and bilingual translations.' },
    { num: '02', title: 'Understand It', desc: 'Ask the AI tutor follow-ups in Socratic, Beginner, or Deep Dive mode.' },
    { num: '03', title: 'Practice It', desc: 'Reinforce concepts using SM-2 spaced repetition flashcards and adaptive quizzes.' },
    { num: '04', title: 'Play It', desc: 'Sharpen syntax speed, find bugs, and battle AI bosses across 10 interactive games.' },
    { num: '05', title: 'Master It', desc: 'Solve multi-language coding challenges and follow targeted AI recommendations.' }
  ];

  const faqs = [
    { q: "What makes AI Study Buddy different from normal chatbots?", a: "AI Study Buddy is not just a chat window—it is a complete learning ecosystem combining spaced-repetition flashcards, 10 educational games, an isolated coding sandbox, adaptive quizzes with 'Why Was I Wrong?' diagnostics, and bilingual tutoring." },
    { q: "Does the platform require paid OpenAI API keys to work?", a: "No! AI Study Buddy features a comprehensive built-in offline educational engine. You can use all flashcards, quizzes, coding problems, games, and explanations right out of the box without any paid API credentials." },
    { q: "Can I upload my college lecture slides and PDF notes?", a: "Yes! In the Notes & Document Learning section, you can upload PDF, DOCX, and TXT files. The AI extracts definitions, formulas, creates flashcard decks, and generates practice quizzes from your material." },
    { q: "What programming languages are supported in the Coding Lab?", a: "The Coding Lab supports Python, JavaScript, C, C++, and Java with real-time test case verification, output diff inspection, and pedagogical debugging hints." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Banner Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            AI Study Buddy
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onStartLearning}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          The Centralized Learning Ecosystem for Students
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Learn Smarter. <br className="hidden sm:inline" />
          Practice Better. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Master Anything.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          "Learn it. Understand it. Practice it. Play it. Master it." <br />
          From Python and Data Structures to DBMS and exams, your personalized AI study companion is ready.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-base shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base border border-slate-200 dark:border-slate-800 transition"
          >
            Explore Features
          </a>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400">study-buddy: ~/python/recursion</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500" />
              7 Day Streak
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Concept Explainer</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">What is Recursion?</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                "Like Russian nesting dolls—each layer opens a smaller doll until the solid base case core is reached."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">3D Flashcard</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">Memory Address vs Value</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Interval: 4 days | Repetition: 2 | SM-2 Next Review: Today
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">10 Learning Games</div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">Code Rush & Boss Raid</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Score 500+ XP defeating Neural Overlord Alpha with algorithm mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black">
            Everything You Need in One Unified Platform
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base font-medium">
            Duolingo + Quizlet + LeetCode + an AI Tutor, engineered specifically for student success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-md hover:shadow-xl transition-all group"
            >
              <div className="text-2xl mb-3">{f.title.split(' ')[0]}</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {f.title.substring(f.title.indexOf(' ') + 1)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy: How It Works */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl my-10 border border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Our Learning Philosophy
          </span>
          <h2 className="text-3xl font-black mt-2">
            The 5-Step Mastery Cycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{s.num}</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{s.title}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">Everything you need to know about AI Study Buddy.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-slate-900 dark:text-white">AI Study Buddy</span>
        </div>
        <p>© 2026 AI Study Buddy. Built for students, engineers, and lifelong learners worldwide.</p>
      </footer>
    </div>
  );
}
