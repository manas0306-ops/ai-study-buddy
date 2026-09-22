import React, { useState, useEffect } from 'react';
import { 
  Layers, RotateCw, Plus, Sparkles, Check, X, 
  HelpCircle, Calendar, ArrowRight, ArrowLeft, Award
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Flashcards({ initialDeckId = null }) {
  const { user, addXP, playSound } = useAuth();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // New deck forms
  const [newTopic, setNewTopic] = useState('Operating Systems');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [genCount, setGenCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const fetchDecks = () => {
    setLoading(true);
    api.getDecks()
      .then(res => {
        setDecks(res);
        if (res.length > 0) {
          const targetId = initialDeckId || res[0].id;
          loadDeck(targetId);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadDeck = (id) => {
    api.getDeck(id).then(d => {
      setSelectedDeck(d);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    });
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSM2Review = async (rating) => {
    if (!selectedDeck || !selectedDeck.cards[currentCardIndex]) return;
    const card = selectedDeck.cards[currentCardIndex];

    try {
      const res = await api.reviewCard(card.id, rating);
      addXP(15);
      playSound('success');

      // Move to next card
      if (currentCardIndex < selectedDeck.cards.length - 1) {
        setIsFlipped(false);
        setCurrentCardIndex(prev => prev + 1);
      } else {
        playSound('level_up');
        alert("🎉 Deck complete! You've reviewed all flashcards in this session.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateDeck = async () => {
    if (!newTopic.trim()) return;
    setGenerating(true);
    try {
      const newDeck = await api.generateAIDeck(newTopic, newSubject, 'Intermediate', genCount);
      setShowGenerateModal(false);
      fetchDecks();
      setSelectedDeck(newDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      playSound('level_up');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-48" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  const currentCard = selectedDeck?.cards[currentCardIndex];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Flashcard Engine 🃏
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            SuperMemo SM-2 Spaced Repetition optimizes review intervals for permanent retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate AI Deck</span>
          </button>
        </div>
      </div>

      {/* Decks Pill List */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => loadDeck(deck.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              selectedDeck?.id === deck.id
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <span>{deck.title}</span>
            <span className="ml-2 text-[10px] opacity-75">({deck.cards_count})</span>
          </button>
        ))}
      </div>

      {/* 3D Flashcard Section */}
      {selectedDeck && currentCard ? (
        <div className="space-y-6">
          {/* Deck progress indicators */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">
              Card {currentCardIndex + 1} of {selectedDeck.cards.length}
            </span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Difficulty: {currentCard.difficulty}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / selectedDeck.cards.length) * 100}%` }}
            />
          </div>

          {/* 3D Flip Card */}
          <div 
            className="perspective-1000 w-full h-80 sm:h-96 cursor-pointer select-none"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden rounded-3xl p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Question / Concept</span>
                  <span className="flex items-center gap-1 text-indigo-500">
                    <RotateCw className="w-3.5 h-3.5" />
                    Click to flip
                  </span>
                </div>

                <div className="text-center my-auto px-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                    {currentCard.front}
                  </h3>
                  {currentCard.hint && (
                    <p className="text-xs text-slate-400 mt-4 italic flex items-center justify-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Hint: {currentCard.hint}
                    </p>
                  )}
                </div>

                <div className="text-center text-[11px] font-semibold text-slate-400">
                  Tap anywhere on the card to reveal the answer
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-8 bg-gradient-to-br from-indigo-900/90 to-slate-900 text-white border-2 border-indigo-500/50 shadow-xl flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <span>Answer / Explanation</span>
                  <span className="flex items-center gap-1 text-indigo-300">
                    <RotateCw className="w-3.5 h-3.5" />
                    Flipped
                  </span>
                </div>

                <div className="text-center my-auto px-4">
                  <p className="text-base sm:text-lg font-semibold leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="text-center text-[11px] font-semibold text-indigo-200/80">
                  Select your recall ease below to adjust spaced repetition
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleSM2Review('again')}
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:scale-105 active:scale-95 transition text-center"
            >
              <div className="font-extrabold text-sm">Again</div>
              <div className="text-[10px] opacity-80 mt-0.5">Reset (1 day)</div>
            </button>

            <button
              onClick={() => handleSM2Review('hard')}
              className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 font-bold text-xs hover:scale-105 active:scale-95 transition text-center"
            >
              <div className="font-extrabold text-sm">Hard</div>
              <div className="text-[10px] opacity-80 mt-0.5">+2 days</div>
            </button>

            <button
              onClick={() => handleSM2Review('good')}
              className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs hover:scale-105 active:scale-95 transition text-center"
            >
              <div className="font-extrabold text-sm">Good</div>
              <div className="text-[10px] opacity-80 mt-0.5">+4 days</div>
            </button>

            <button
              onClick={() => handleSM2Review('easy')}
              className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:scale-105 active:scale-95 transition text-center"
            >
              <div className="font-extrabold text-sm">Easy</div>
              <div className="text-[10px] opacity-80 mt-0.5">+7 days</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No Flashcards in this Deck</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create cards manually or let the AI instantly generate a tailored deck on any topic.
          </p>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
          >
            Generate AI Deck
          </button>
        </div>
      )}

      {/* Modal: Generate AI Deck */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Generate AI Flashcards
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Topic or Concept
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g., Computer Networks, Red-Black Trees..."
                  className="w-full bg-slate-100 dark:bg-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Subject Category
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., Computer Science, Mathematics..."
                  className="w-full bg-slate-100 dark:bg-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Number of Cards: {genCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDeck}
                disabled={generating || !newTopic.trim()}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-40"
              >
                {generating ? 'Generating...' : 'Create Deck'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
