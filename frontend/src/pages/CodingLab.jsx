import React, { useState, useEffect } from 'react';
import { 
  Terminal, Play, RotateCcw, Sparkles, CheckCircle2, 
  XCircle, Clock, Lightbulb, AlertTriangle, Check, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { id: 'python', label: 'Python 3' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' }
];

export default function CodingLab({ initialSlug = null }) {
  const { user, addXP, playSound } = useAuth();
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeTab, setActiveTab] = useState('problem'); // problem, test_cases, debugger

  // AI Debugger state
  const [debugOutput, setDebugOutput] = useState(null);
  const [debugging, setDebugging] = useState(false);

  useEffect(() => {
    api.getCodingProblems()
      .then(res => {
        setProblems(res);
        if (res.length > 0) {
          const targetSlug = initialSlug || res[0].slug;
          loadProblem(targetSlug);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const loadProblem = (slug) => {
    api.getCodingProblem(slug).then(p => {
      setActiveProblem(p);
      const boilerplate = p.boilerplates?.[selectedLanguage] || p.boilerplates?.['python'] || '# Write your code here\n';
      setCode(boilerplate);
      setRunResult(null);
      setSubmitResult(null);
      setDebugOutput(null);
    });
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (activeProblem?.boilerplates?.[lang]) {
      setCode(activeProblem.boilerplates[lang]);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await api.runCode(code, selectedLanguage);
      setRunResult(res);
      setActiveTab('test_cases');
    } catch (err) {
      setRunResult({ status: 'Error', stderr: err.message, runtime_ms: 0 });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!activeProblem) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await api.submitCode(activeProblem.id, selectedLanguage, code, user.id);
      setSubmitResult(res);
      setActiveTab('test_cases');
      if (res.all_passed) {
        addXP(res.xp_awarded);
        playSound('level_up');
      } else {
        playSound('error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIDebug = async (mode) => {
    setDebugging(true);
    try {
      const res = await api.debugCode(code, selectedLanguage, activeProblem?.title, mode);
      setDebugOutput(res);
      setActiveTab('debugger');
    } catch (err) {
      console.error(err);
    } finally {
      setDebugging(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Coding Lab 💻
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sandboxed execution environment with pedagogical AI debugging and test harnesses.
          </p>
        </div>

        {/* Problem selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={activeProblem?.slug || ''}
            onChange={(e) => loadProblem(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Split (Left: Problem Specs / Tests / Debugger, Right: Editor & Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Problem details / Tabs (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs bar */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 pt-3 gap-2 bg-slate-50/50 dark:bg-slate-950/20">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'problem'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('test_cases')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'test_cases'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Test Results
            </button>
            <button
              onClick={() => setActiveTab('debugger')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'debugger'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Debugger
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 text-xs sm:text-sm">
            {activeTab === 'problem' && activeProblem && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeProblem.title}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {activeProblem.difficulty}
                  </span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300">
                  {activeProblem.description}
                </div>

                {activeProblem.examples?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples:</h4>
                    {activeProblem.examples.map((ex, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 font-mono text-xs space-y-1">
                        <div><strong>Input:</strong> {ex.input}</div>
                        <div><strong>Output:</strong> {ex.output}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeProblem.hints?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
                      <Lightbulb className="w-4 h-4" />
                      Algorithmic Hint
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {activeProblem.hints[0]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'test_cases' && (
              <div className="space-y-4">
                {runResult && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Run Execution Result:</h4>
                    <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1">
                      <div>Status: <span className={runResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>{runResult.status}</span></div>
                      <div>Runtime: {runResult.runtime_ms} ms</div>
                      {runResult.stdout && <div>Output: <pre className="text-slate-300 mt-1">{runResult.stdout}</pre></div>}
                      {runResult.stderr && <div>Error: <pre className="text-rose-400 mt-1">{runResult.stderr}</pre></div>}
                    </div>
                  </div>
                )}

                {submitResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Test Suite Verdict</div>
                        <div className={`text-base font-black ${submitResult.all_passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {submitResult.status} ({submitResult.passed_tests}/{submitResult.total_tests} Passed)
                        </div>
                      </div>
                      {submitResult.all_passed && (
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white">
                          +{submitResult.xp_awarded} XP
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {submitResult.test_results?.map((tr, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Test Case #{idx + 1}</span>
                            {tr.passed ? (
                              <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passed</span>
                            ) : (
                              <span className="text-rose-500 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Failed</span>
                            )}
                          </div>
                          <div>Input: {tr.input}</div>
                          <div>Expected: {tr.expected}</div>
                          <div>Actual: {tr.actual || 'None'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!runResult && !submitResult && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Run or Submit your solution to see test harness evaluation.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'debugger' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase text-slate-400">AI Pedagogical Diagnostics</span>
                  {debugging && <span className="text-xs text-indigo-500 animate-pulse">Inspecting code...</span>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAIDebug('hint')}
                    disabled={debugging}
                    className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition"
                  >
                    Give Me a Hint
                  </button>
                  <button
                    onClick={() => handleAIDebug('explain')}
                    disabled={debugging}
                    className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-100 transition"
                  >
                    Explain Error
                  </button>
                  <button
                    onClick={() => handleAIDebug('solution')}
                    disabled={debugging}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 transition"
                  >
                    Show Solution
                  </button>
                </div>

                {debugOutput && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {debugOutput.content}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Actions (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
          {/* Editor Header Bar */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />

              <div className="ml-3 flex gap-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedLanguage === lang.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (activeProblem?.boilerplates?.[selectedLanguage]) {
                  setCode(activeProblem.boilerplates[selectedLanguage]);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Reset boilerplate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="flex-1 p-4 relative font-mono text-xs sm:text-sm leading-relaxed">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full h-full min-h-[380px] bg-transparent text-emerald-300 font-mono resize-none focus:outline-none leading-relaxed"
            />
          </div>

          {/* Footer Controls: Run & Submit */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              Sandboxed runtime • 5s timeout protection
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs disabled:opacity-40 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{running ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={running || submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-40 transition"
              >
                <span>{submitting ? 'Testing...' : 'Submit Solution'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
