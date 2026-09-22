import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Layers, CheckSquare, Terminal, FileText, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggles
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.search(query.trim())
        .then(data => setResults(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a topic (e.g., 'recursion', 'pointer', 'sql')..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="text-center py-8 text-sm text-slate-400">
              Searching knowledge bank...
            </div>
          )}

          {!loading && results && results.total_results === 0 && (
            <div className="text-center py-8 text-sm text-slate-500">
              No matching resources found for "{query}".
            </div>
          )}

          {!loading && results && results.total_results > 0 && (
            <div className="space-y-4">
              {/* Topics */}
              {results.results.topics?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Topics ({results.results.topics.length})
                  </h4>
                  <div className="space-y-1">
                    {results.results.topics.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { onNavigate('explainer', { topic: t.name }); onClose(); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-sm group transition"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</span>
                          <span className="ml-2 text-xs text-slate-400">({t.difficulty})</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Coding Problems */}
              {results.results.coding_problems?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    Coding Problems ({results.results.coding_problems.length})
                  </h4>
                  <div className="space-y-1">
                    {results.results.coding_problems.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { onNavigate('coding_lab', { slug: p.slug }); onClose(); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-sm group transition"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{p.title}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                          {p.difficulty}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              {results.results.quizzes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    Quizzes ({results.results.quizzes.length})
                  </h4>
                  <div className="space-y-1">
                    {results.results.quizzes.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => { onNavigate('quizzes', { quizId: q.id }); onClose(); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-sm group transition"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{q.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flashcards */}
              {results.results.flashcard_decks?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    Flashcard Decks ({results.results.flashcard_decks.length})
                  </h4>
                  <div className="space-y-1">
                    {results.results.flashcard_decks.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => { onNavigate('flashcards', { deckId: d.id }); onClose(); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-sm group transition"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{d.title}</span>
                        <span className="text-xs text-slate-400">{d.cards_count} cards</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-xs text-slate-400">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">Tab</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">Enter</kbd> to explore suggestions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
