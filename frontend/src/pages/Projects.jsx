import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, Code2, Layers, CheckCircle2, 
  ExternalLink, ArrowRight, Sparkles, Terminal
} from 'lucide-react';
import { api } from '../services/api';

export default function Projects({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects()
      .then(res => {
        setProjects(res);
        if (res.length > 0) setSelectedProject(res[0]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Project Learning Blueprints 🛠️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Bridge theory and real-world engineering with step-by-step project architectures and GitHub guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`w-full p-4 rounded-3xl text-left border transition ${
                selectedProject?.id === proj.id
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {proj.level}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{proj.estimated_hours}h</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {proj.description}
              </p>
            </button>
          ))}
        </div>

        {/* Right: Detailed Project Blueprint Specification (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          {selectedProject && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {selectedProject.level} Project Blueprint
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedProject.title}
                  </h2>
                </div>

                <button
                  onClick={() => onNavigate('coding_lab')}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Start in Coding Lab</span>
                </button>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech_stack?.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Problem Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem Statement & Scope</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Required Core Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Features to Implement</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {selectedProject.features?.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture & GitHub Guidance */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs space-y-2">
                <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  Portfolio & GitHub Deployment Advice
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Include clean README documentation with setup commands, architectural diagrams, unit tests, and automated CI/CD GitHub Actions workflows to showcase this to recruiters.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
