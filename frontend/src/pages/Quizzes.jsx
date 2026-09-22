import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Clock, AlertCircle, CheckCircle2, XCircle, 
  HelpCircle, ArrowRight, RotateCcw, Sparkles, Award
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Quizzes({ initialQuizId = null }) {
  const { user, addXP, playSound } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // "Why was I wrong?" modal state
  const [whyWrongModal, setWhyWrongModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getQuizzes()
      .then(res => {
        setQuizzes(res);
        if (res.length > 0) {
          const targetId = initialQuizId || res[0].id;
          startQuiz(targetId);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted, timeLeft]);

  const startQuiz = (id) => {
    api.getQuiz(id).then(q => {
      setActiveQuiz(q);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setResults(null);
      setTimeLeft(q.time_limit_seconds || 180);
    });
  };

  const handleSelectOption = (questionId, option) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || isSubmitted) return;
    const timeSpent = (activeQuiz.time_limit_seconds || 180) - timeLeft;

    try {
      const res = await api.submitQuiz(activeQuiz.id, {
        user_id: user.id,
        time_taken_seconds: timeSpent,
        answers: selectedAnswers
      });
      setResults(res);
      setIsSubmitted(true);
      addXP(res.xp_earned);
      if (res.accuracy >= 70) {
        playSound('level_up');
      } else {
        playSound('success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openWhyWasIWrong = (item) => {
    api.whyWasIWrong(item.question_text, item.user_answer, item.correct_answer, item.concept)
      .then(res => setWhyWrongModal(res))
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  const currentQ = activeQuiz?.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Quiz Engine & Diagnostics 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Adaptive questions, conceptual edge cases, and personalized error diagnosis.
          </p>
        </div>

        {activeQuiz && !isSubmitted && (
          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-rose-500 animate-bounce' : 'text-indigo-500'}`} />
            <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
          </div>
        )}
      </div>

      {/* Available Quiz Selectors */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {quizzes.map((qz) => (
          <button
            key={qz.id}
            onClick={() => startQuiz(qz.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              activeQuiz?.id === qz.id
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {qz.title}
          </button>
        ))}
      </div>

      {/* Main Quiz View */}
      {activeQuiz && !isSubmitted && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* Question Meta */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length} • {currentQ.question_type.replace('_', ' ')}
            </span>
            <span className="font-medium text-slate-400">
              Concept: {currentQ.concept || activeQuiz.topic}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text & Code Snippet */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question_text}
            </h3>

            {currentQ.code_snippet && (
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {currentQ.code_snippet}
              </pre>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, i) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30"
            >
              Previous
            </button>

            {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Post-Quiz Results & Diagnostic Summary */}
      {isSubmitted && results && (
        <div className="space-y-6 animate-in fade-in">
          {/* Score Header Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Assessment Complete!
              </h2>
              <div className="text-xs text-slate-500 mt-1">
                You earned <strong className="text-amber-500 font-bold">+{results.xp_earned} XP</strong>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {results.score} / {results.total_questions}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs text-slate-400">Accuracy</div>
                <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {results.accuracy}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs text-slate-400">Time Taken</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {results.time_taken_seconds}s
                </div>
              </div>
            </div>

            {/* AI Recommendation Message */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 font-medium max-w-lg mx-auto">
              🤖 <strong>AI Tutor Diagnosis:</strong> {results.ai_recommendation}
            </div>

            <button
              onClick={() => startQuiz(activeQuiz.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>

          {/* Question by Question Review with "Why Was I Wrong?" buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Detailed Question Analysis
            </h3>

            {results.detailed_results?.map((res, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition ${
                  res.is_correct
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10'
                    : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {res.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">
                        Question {idx + 1}
                      </div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {res.question_text}
                      </p>

                      <div className="mt-3 space-y-1 text-xs">
                        <div>
                          <span className="text-slate-500">Your Answer: </span>
                          <span className={res.is_correct ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {res.user_answer || 'No answer'}
                          </span>
                        </div>
                        {!res.is_correct && (
                          <div>
                            <span className="text-slate-500">Correct Answer: </span>
                            <span className="text-emerald-600 font-bold">{res.correct_answer}</span>
                          </div>
                        )}
                        <p className="text-slate-600 dark:text-slate-400 mt-2 italic">
                          {res.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* "Why Was I Wrong?" Button */}
                  {!res.is_correct && (
                    <button
                      onClick={() => openWhyWasIWrong(res)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 dark:hover:bg-rose-900 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why was I wrong?</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Why Was I Wrong?" Modal */}
      {whyWrongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-500">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-black text-base uppercase tracking-wider">
                Misconception Diagnostic
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Your Selection: </span>
                <span className="font-bold text-rose-500">{whyWrongModal.your_answer}</span>
              </div>
              <div>
                <span className="text-slate-400">Correct Answer: </span>
                <span className="font-bold text-emerald-500">{whyWrongModal.correct_answer}</span>
              </div>
              <div>
                <span className="text-slate-400">Core Concept: </span>
                <span className="font-bold text-indigo-500">{whyWrongModal.concept_involved}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Why Yours Was Incorrect
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {whyWrongModal.why_yours_was_wrong}
              </p>
            </div>

            {/* Practice Similar Question Targeting Same Misconception */}
            {whyWrongModal.practice_similar_question && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Practice Similar Question
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {whyWrongModal.practice_similar_question.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {whyWrongModal.practice_similar_question.options.map((opt, i) => (
                    <div key={i} className="p-2 rounded-xl bg-white dark:bg-slate-900 text-xs font-medium border border-slate-200 dark:border-slate-800">
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setWhyWrongModal(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
            >
              Got It, Continue Reviewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
