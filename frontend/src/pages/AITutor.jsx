import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, User, BookOpen, GraduationCap, 
  Cpu, Briefcase, HelpCircle, Languages, RotateCcw, Copy, Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TUTOR_MODES = [
  { id: 'beginner', name: 'Beginner', desc: 'Simple analogies & jargon-free explanations', icon: BookOpen, color: 'text-emerald-500' },
  { id: 'exam', name: 'Exam Mode', desc: 'Concise high-scoring bullet points & formulas', icon: GraduationCap, color: 'text-amber-500' },
  { id: 'deep_dive', name: 'Deep Dive', desc: 'Systems internals, memory layout & Big-O', icon: Cpu, color: 'text-blue-500' },
  { id: 'interview', name: 'Interview', desc: 'Mock technical interviewer probing trade-offs', icon: Briefcase, color: 'text-purple-500' },
  { id: 'socratic', name: 'Socratic', desc: 'Guiding questions to discover answers yourself', icon: HelpCircle, color: 'text-cyan-500' },
  { id: 'bilingual', name: 'Hindi + English', desc: 'Bilingual & Hinglish explanations with Indian analogies', icon: Languages, color: 'text-rose-500' }
];

export default function AITutor() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState('beginner');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Alex! I am your AI Tutor. Choose any mode above—from Beginner to Exam or Bilingual Hindi—and ask me any question you'd like to master today!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customQuery = null) => {
    const q = customQuery || input;
    if (!q.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const res = await api.askTutor(q, activeMode, null, []);
      const aiReply = { id: Date.now() + 1, sender: 'ai', text: res.response };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: "Unable to process query at this time. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleModeChange = (modeId) => {
    setActiveMode(modeId);
    const modeObj = TUTOR_MODES.find(m => m.id === modeId);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'ai',
        text: `Switched to **${modeObj.name}** mode! ${modeObj.desc}. How can I help you now?`
      }
    ]);
  };

  const sampleQuestions = [
    "What is recursion in programming?",
    "Explain pointers and memory references",
    "How does QuickSort work and what is its worst case?",
    "Difference between WHERE and HAVING in SQL"
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Tutor 🧠
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Switch modes freely to match how your brain learns best.
        </p>
      </div>

      {/* 6 Modes Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {TUTOR_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${mode.color}`} />
              <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {mode.name}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {mode.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Conversation Container */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap relative group ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-br-xs shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {m.text}

                {m.sender === 'ai' && (
                  <button
                    onClick={() => copyToClipboard(m.text, m.id)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 opacity-0 group-hover:opacity-100 transition text-slate-600 dark:text-slate-300"
                    title="Copy to clipboard"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <Bot className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI Tutor is writing in {activeMode.replace('_', ' ')} mode...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex gap-2 overflow-x-auto scrollbar-none">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500 font-medium transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a question in ${activeMode.replace('_', ' ')} mode...`}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent dark:border-slate-700/60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-40 transition flex items-center gap-2 shadow-md shadow-indigo-500/20"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
