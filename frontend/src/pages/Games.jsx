import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Zap, Bug, Terminal, Grid, Swords, Compass, 
  Keyboard, Binary, Search, Crown, ArrowLeft, RotateCcw, Award, CheckCircle2, XCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Games({ initialGame = null }) {
  const { user, addXP, playSound } = useAuth();
  const [gamesList, setGamesList] = useState([]);
  const [activeGame, setActiveGame] = useState(initialGame);
  const [gameContent, setGameContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active game play state
  const [gameState, setGameState] = useState('menu'); // menu, playing, game_over
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(30);

  // AI Quiz Boss state
  const [bossHp, setBossHp] = useState(500);
  const [playerHp, setPlayerHp] = useState(100);

  // Memory Match state
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  // Code Rush / Bug Hunter / Output Predictor state
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Typing Code state
  const [typingInput, setTypingInput] = useState('');
  const sampleCodeSnippet = "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1";

  // Binary Battle state
  const [binaryQuestion, setBinaryQuestion] = useState({ dec: 13, bin: '1101' });
  const [binaryInput, setBinaryInput] = useState('');

  // SQL Detective state
  const [sqlSelectedSuspect, setSqlSelectedSuspect] = useState('');

  useEffect(() => {
    api.getGamesList()
      .then(res => setGamesList(res))
      .catch(err => console.error(err));
  }, []);

  const selectGame = (gameId) => {
    setActiveGame(gameId);
    setLoading(true);
    setScore(0);
    setRound(0);
    setFeedback(null);
    setGameState('playing');

    api.getGameContent(gameId)
      .then(content => {
        setGameContent(content);
        if (gameId === 'ai_quiz_boss') {
          setBossHp(500);
          setPlayerHp(100);
        } else if (gameId === 'memory_match') {
          setFlippedCards([]);
          setMatchedPairs([]);
        } else if (gameId === 'typing_code') {
          setTypingInput('');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFinishGame = async (finalScore = score) => {
    setGameState('game_over');
    try {
      const res = await api.submitGameSession(activeGame, finalScore, 100, 1);
      addXP(res.xp_earned);
      playSound('level_up');
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Code Rush Handler
  const handleCodeRushAnswer = (opt, correct) => {
    if (opt === correct) {
      setScore(prev => prev + 100);
      playSound('success');
      setFeedback('Correct! +100 Points');
    } else {
      playSound('error');
      setFeedback(`Incorrect! Answer was: ${correct}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (round < (gameContent?.questions?.length || 5) - 1) {
        setRound(prev => prev + 1);
      } else {
        handleFinishGame(score + (opt === correct ? 100 : 0));
      }
    }, 1000);
  };

  // 2. Bug Hunter Handler
  const handleBugHunterAnswer = (opt, correct) => {
    if (opt === correct) {
      setScore(prev => prev + 150);
      playSound('success');
      setFeedback('Bug Exterminated! 🐛 +150 Points');
    } else {
      playSound('error');
      setFeedback('Not the root bug!');
    }

    setTimeout(() => {
      setFeedback(null);
      if (round < (gameContent?.scenarios?.length || 3) - 1) {
        setRound(prev => prev + 1);
      } else {
        handleFinishGame(score + (opt === correct ? 150 : 0));
      }
    }, 1200);
  };

  // 3. Output Predictor Handler
  const handleOutputAnswer = (opt, correct) => {
    if (opt === correct) {
      setScore(prev => prev + 120);
      playSound('success');
      setFeedback('Exact Match! +120 Points');
    } else {
      playSound('error');
      setFeedback(`Incorrect. Correct Output: ${correct}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (round < (gameContent?.challenges?.length || 3) - 1) {
        setRound(prev => prev + 1);
      } else {
        handleFinishGame(score + (opt === correct ? 120 : 0));
      }
    }, 1200);
  };

  // 4. AI Quiz Boss Handler
  const handleBossAnswer = (opt, correct, damage) => {
    if (opt === correct) {
      const newBossHp = Math.max(0, bossHp - damage);
      setBossHp(newBossHp);
      playSound('success');
      setFeedback(`CRITICAL HIT! You dealt ${damage} damage to the Boss! ⚔️`);
      if (newBossHp <= 0) {
        setTimeout(() => handleFinishGame(600), 1200);
        return;
      }
    } else {
      const newPlayerHp = Math.max(0, playerHp - 35);
      setPlayerHp(newPlayerHp);
      playSound('error');
      setFeedback('Boss Attack hit you for 35 damage! 🛡️');
      if (newPlayerHp <= 0) {
        setTimeout(() => handleFinishGame(100), 1200);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      if (round < (gameContent?.boss?.questions?.length || 4) - 1) {
        setRound(prev => prev + 1);
      } else {
        handleFinishGame(score + 200);
      }
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-indigo-500" />
            Learning Games Arcade 🎮
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Learn through play: speed coding, bug hunting, output prediction, and AI boss raids.
          </p>
        </div>

        {activeGame && (
          <button
            onClick={() => setActiveGame(null)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games Hub</span>
          </button>
        )}
      </div>

      {/* GAMES HUB (If no active game chosen) */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {g.id === 'code_rush' && <Zap className="w-6 h-6 text-amber-500" />}
                    {g.id === 'bug_hunter' && <Bug className="w-6 h-6 text-rose-500" />}
                    {g.id === 'output_predictor' && <Terminal className="w-6 h-6 text-emerald-500" />}
                    {g.id === 'memory_match' && <Grid className="w-6 h-6 text-indigo-500" />}
                    {g.id === 'flashcard_battle' && <Swords className="w-6 h-6 text-purple-500" />}
                    {g.id === 'algorithm_maze' && <Compass className="w-6 h-6 text-cyan-500" />}
                    {g.id === 'typing_code' && <Keyboard className="w-6 h-6 text-teal-500" />}
                    {g.id === 'binary_battle' && <Binary className="w-6 h-6 text-blue-500" />}
                    {g.id === 'sql_detective' && <Search className="w-6 h-6 text-orange-500" />}
                    {g.id === 'ai_quiz_boss' && <Crown className="w-6 h-6 text-red-500" />}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {g.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-500 transition">
                  {g.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{g.tagline}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <button
                onClick={() => selectGame(g.id)}
                className="mt-6 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition text-center"
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE GAME PLAY ARENA */}
      {activeGame && gameContent && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          {/* Game Over Screen */}
          {gameState === 'game_over' ? (
            <div className="text-center py-12 space-y-4">
              <Award className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Game Complete!</h2>
              <div className="text-lg font-bold text-slate-600 dark:text-slate-300">
                Final Score: <span className="text-indigo-500">{score}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                XP and stats have been updated on your profile and leaderboards!
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => selectGame(activeGame)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Back to Games Hub
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Feedback toast banner */}
              {feedback && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center font-bold text-xs text-indigo-700 dark:text-indigo-300 animate-in fade-in">
                  {feedback}
                </div>
              )}

              {/* GAME 1: Code Rush */}
              {activeGame === 'code_rush' && gameContent.questions && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Question {round + 1} of {gameContent.questions.length}</span>
                    <span className="text-amber-500">Score: {score}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white text-center py-4">
                    {gameContent.questions[round]?.q}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gameContent.questions[round]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleCodeRushAnswer(opt, gameContent.questions[round]?.a)}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left font-bold text-sm hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 2: Bug Hunter */}
              {activeGame === 'bug_hunter' && gameContent.scenarios && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Bug #{round + 1}</span>
                    <span className="text-rose-500 font-extrabold">Score: {score}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 text-rose-300 font-mono text-xs border border-slate-800">
                    <pre>{gameContent.scenarios[round]?.code}</pre>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white text-center">
                    Where is the bug in this snippet?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gameContent.scenarios[round]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleBugHunterAnswer(opt, gameContent.scenarios[round]?.correct)}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left font-semibold text-xs hover:border-rose-500 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 3: Output Predictor */}
              {activeGame === 'output_predictor' && gameContent.challenges && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Challenge #{round + 1}</span>
                    <span className="text-emerald-500">Score: {score}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
                    <pre>{gameContent.challenges[round]?.code}</pre>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white text-center">
                    What does this code output to stdout?
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {gameContent.challenges[round]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOutputAnswer(opt, gameContent.challenges[round]?.correct)}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 9: SQL Detective */}
              {activeGame === 'sql_detective' && gameContent.mystery && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                    <h3 className="font-black text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      {gameContent.mystery.case_title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {gameContent.mystery.briefing}
                    </p>
                  </div>

                  {/* Suspects table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <tr>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Badge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameContent.mystery.tables.suspects.map(s => (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="p-2.5">{s.id}</td>
                            <td className="p-2.5 font-bold">{s.name}</td>
                            <td className="p-2.5">{s.role}</td>
                            <td className="p-2.5">{s.badge_color}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Access logs */}
                  <div className="p-3 bg-slate-950 rounded-2xl font-mono text-xs text-slate-300">
                    <div className="text-amber-400 font-bold mb-1">SELECT * FROM access_logs WHERE room = 'Vault';</div>
                    <div>Log 102: Suspect ID 3 entered Vault at 20:58.</div>
                  </div>

                  <div className="pt-2 text-center">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Who is the culprit?
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {gameContent.mystery.tables.suspects.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            if (s.name === gameContent.mystery.solution_suspect) {
                              playSound('level_up');
                              alert(`🕵️ Case Solved! ${s.name} was caught red-handed! +200 XP`);
                              handleFinishGame(200);
                            } else {
                              playSound('error');
                              alert(`Wrong suspect! Check the timestamps carefully.`);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-bold transition"
                        >
                          Accuse {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 10: AI Quiz Boss */}
              {activeGame === 'ai_quiz_boss' && gameContent.boss && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Boss HP Bar */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={gameContent.boss.avatar} alt="Boss" className="w-10 h-10 rounded-xl bg-slate-800" />
                        <div>
                          <div className="font-extrabold text-sm text-red-400">{gameContent.boss.name}</div>
                          <div className="text-[10px] text-slate-400">{gameContent.boss.title}</div>
                        </div>
                      </div>
                      <div className="text-sm font-black text-red-400">{bossHp} / 500 HP</div>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(bossHp / 500) * 100}%` }} />
                    </div>

                    {/* Player HP */}
                    <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                      <span>Your Shields:</span>
                      <span className="font-bold text-emerald-400">{playerHp} / 100 HP</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${playerHp}%` }} />
                    </div>
                  </div>

                  {/* Boss Question */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                      {gameContent.boss.questions[round]?.question}
                    </h3>

                    <div className="space-y-2">
                      {gameContent.boss.questions[round]?.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleBossAnswer(
                            opt,
                            gameContent.boss.questions[round]?.answer,
                            gameContent.boss.questions[round]?.damage
                          )}
                          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs font-semibold hover:border-red-500 hover:bg-red-50/20 transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Default generic game runner for remaining games */}
              {!['code_rush', 'bug_hunter', 'output_predictor', 'sql_detective', 'ai_quiz_boss'].includes(activeGame) && (
                <div className="text-center py-10 space-y-4">
                  <div className="text-3xl font-black text-indigo-500">{activeGame.replace('_', ' ').toUpperCase()}</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Challenge active! Complete this interactive round to earn +50 XP.
                  </p>
                  <button
                    onClick={() => handleFinishGame(250)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                  >
                    Complete Challenge (+250 Score)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
