const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Call failed on ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Analytics & Dashboard
  getDashboard: () => fetchJSON(`${API_BASE}/analytics/dashboard`),
  getProgress: () => fetchJSON(`${API_BASE}/analytics/progress`),
  getLeaderboard: () => fetchJSON(`${API_BASE}/analytics/leaderboard`),
  getAchievements: () => fetchJSON(`${API_BASE}/analytics/achievements`),

  // AI Core
  getAIStatus: () => fetchJSON(`${API_BASE}/ai/status`),
  askTutor: (query, mode = 'beginner', context = null, history = []) =>
    fetchJSON(`${API_BASE}/ai/tutor`, {
      method: 'POST',
      body: JSON.stringify({ query, mode, context, history })
    }),
  explainTopic: (topic, level = 'Beginner', language = 'English') =>
    fetchJSON(`${API_BASE}/ai/explain`, {
      method: 'POST',
      body: JSON.stringify({ topic, level, language })
    }),
  debugCode: (code, language = 'python', context = null, mode = 'hint') =>
    fetchJSON(`${API_BASE}/ai/debug`, {
      method: 'POST',
      body: JSON.stringify({ code, language, context, mode })
    }),
  summarizeText: (text, maxPoints = 5) =>
    fetchJSON(`${API_BASE}/ai/summarize`, {
      method: 'POST',
      body: JSON.stringify({ text, max_points: maxPoints })
    }),
  generateStudyPack: (topic, subject = 'Computer Science', difficulty = 'Intermediate', language = 'English') =>
    fetchJSON(`${API_BASE}/ai/study-pack`, {
      method: 'POST',
      body: JSON.stringify({ topic, subject, difficulty, language })
    }),

  // Quizzes
  getQuizzes: () => fetchJSON(`${API_BASE}/quizzes`),
  getQuiz: (id) => fetchJSON(`${API_BASE}/quizzes/${id}`),
  generateQuiz: (subject, topic, difficulty = 'Intermediate', totalQuestions = 5, isAdaptive = false) =>
    fetchJSON(`${API_BASE}/quizzes/generate`, {
      method: 'POST',
      body: JSON.stringify({ subject, topic, difficulty, total_questions: totalQuestions, is_adaptive: isAdaptive })
    }),
  submitQuiz: (quizId, submissionData) =>
    fetchJSON(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    }),
  whyWasIWrong: (questionText, userAnswer, correctAnswer, concept = null) =>
    fetchJSON(`${API_BASE}/quizzes/why-was-i-wrong`, {
      method: 'POST',
      body: JSON.stringify({
        question_text: questionText,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        concept
      })
    }),

  // Flashcards
  getDecks: () => fetchJSON(`${API_BASE}/flashcards/decks`),
  getDeck: (id) => fetchJSON(`${API_BASE}/flashcards/decks/${id}`),
  createDeck: (data) =>
    fetchJSON(`${API_BASE}/flashcards/decks`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  addCard: (deckId, data) =>
    fetchJSON(`${API_BASE}/flashcards/decks/${deckId}/cards`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  generateAIDeck: (topic, subject = 'General', difficulty = 'Intermediate', count = 5) =>
    fetchJSON(`${API_BASE}/flashcards/generate`, {
      method: 'POST',
      body: JSON.stringify({ topic, subject, difficulty, count })
    }),
  reviewCard: (cardId, rating) =>
    fetchJSON(`${API_BASE}/flashcards/cards/${cardId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    }),

  // Coding Lab
  getCodingProblems: (category = null, difficulty = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    return fetchJSON(`${API_BASE}/coding/problems?${params.toString()}`);
  },
  getCodingProblem: (slug) => fetchJSON(`${API_BASE}/coding/problems/${slug}`),
  runCode: (code, language = 'python', inputData = null) =>
    fetchJSON(`${API_BASE}/coding/run`, {
      method: 'POST',
      body: JSON.stringify({ code, language, input_data: inputData })
    }),
  submitCode: (problemId, language, code, userId = 1) =>
    fetchJSON(`${API_BASE}/coding/submit`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, problem_id: problemId, language, code })
    }),

  // Games
  getGamesList: () => fetchJSON(`${API_BASE}/games`),
  getGameContent: (gameType) => fetchJSON(`${API_BASE}/games/${gameType}/content`),
  submitGameSession: (gameType, score, accuracy = 100, levelReached = 1, details = {}) =>
    fetchJSON(`${API_BASE}/games/submit`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: 1,
        game_type: gameType,
        score,
        accuracy,
        level_reached: levelReached,
        details
      })
    }),

  // Notes & Documents
  getNotes: (folder = null) => {
    const url = folder ? `${API_BASE}/notes?folder=${encodeURIComponent(folder)}` : `${API_BASE}/notes`;
    return fetchJSON(url);
  },
  createNote: (data) =>
    fetchJSON(`${API_BASE}/notes`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateNote: (id, data) =>
    fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteNote: (id) =>
    fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'DELETE'
    }),
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/notes/upload-document`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Document upload failed');
    return await res.json();
  },

  // Planner
  getStudyPlans: () => fetchJSON(`${API_BASE}/planner`),
  generateStudyPlan: (data) =>
    fetchJSON(`${API_BASE}/planner/generate`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  togglePlanTask: (planId, dayNumber, completed) =>
    fetchJSON(`${API_BASE}/planner/toggle-task`, {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, day_number: dayNumber, completed })
    }),
  getQuickRevision: (subject = 'Python', durationMinutes = 15) =>
    fetchJSON(`${API_BASE}/planner/quick-revision`, {
      method: 'POST',
      body: JSON.stringify({ subject, duration_minutes: durationMinutes })
    }),

  // Subjects, Paths, Projects & Search
  getSubjects: (category = null) => {
    const url = category ? `${API_BASE}/subjects?category=${encodeURIComponent(category)}` : `${API_BASE}/subjects`;
    return fetchJSON(url);
  },
  getSubject: (slug) => fetchJSON(`${API_BASE}/subjects/${slug}`),
  getLearningPaths: () => fetchJSON(`${API_BASE}/learning-paths`),
  getProjects: () => fetchJSON(`${API_BASE}/projects`),
  search: (query) => fetchJSON(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
};
