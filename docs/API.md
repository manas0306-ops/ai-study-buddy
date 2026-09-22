# REST API Specification — AI Study Buddy

All backend endpoints return JSON responses. Interactive Swagger UI is available at `/docs` when the backend is running.

## 1. AI Core Services (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ai/status` | Reports active AI provider and connection state |
| `POST` | `/api/ai/tutor` | Chat with AI Tutor across 6 pedagogical modes |
| `POST` | `/api/ai/explain` | Generates 11-step structured concept breakdown |
| `POST` | `/api/ai/debug` | Pedagogical code debugger (hint, explain, solution) |
| `POST` | `/api/ai/summarize` | Summarizes notes or lecture text |
| `POST` | `/api/ai/study-pack` | Builds complete 360-degree study pack in one click |

## 2. Quizzes & Diagnostics (`/api/quizzes`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quizzes` | List all quizzes with difficulty and question count |
| `GET` | `/api/quizzes/{id}` | Fetch quiz questions and options |
| `POST` | `/api/quizzes/generate` | Generate custom AI quiz for any topic |
| `POST` | `/api/quizzes/{id}/submit` | Grade attempt, award XP, and return diagnosis |
| `POST` | `/api/quizzes/why-was-i-wrong` | Misconception analysis for wrong answers |

## 3. Flashcards & Spaced Repetition (`/api/flashcards`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/flashcards/decks` | List all decks with due review counts |
| `GET` | `/api/flashcards/decks/{id}` | Fetch deck cards and SM-2 review parameters |
| `POST` | `/api/flashcards/decks` | Create manual flashcard deck |
| `POST` | `/api/flashcards/generate` | Generate AI flashcard deck |
| `POST` | `/api/flashcards/cards/{id}/review`| SuperMemo SM-2 interval update (`again`, `hard`, `good`, `easy`) |

## 4. Coding Lab (`/api/coding`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/coding/problems` | List problems filtered by category/difficulty |
| `GET` | `/api/coding/problems/{slug}` | Problem specs, boilerplates, hints, and tests |
| `POST` | `/api/coding/run` | Execute code snippet in sandboxed runner |
| `POST` | `/api/coding/submit` | Evaluate code against all hidden test cases |

## 5. Learning Games Arcade (`/api/games`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/games` | Metadata, icons, categories for all 10 games |
| `GET` | `/api/games/{type}/content` | Dynamic challenge dataset for selected game |
| `POST` | `/api/games/submit` | Record game session score, award XP, update stats |

## 6. Notes & Documents (`/api/notes`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | List user notes sorted by pinned status |
| `POST` | `/api/notes` | Create new note |
| `PUT` | `/api/notes/{id}` | Update note title, content, folder |
| `DELETE` | `/api/notes/{id}` | Delete note |
| `POST` | `/api/notes/upload-document` | Upload PDF, DOCX, TXT and extract study pack |

## 7. Study Planner (`/api/planner`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/planner` | Fetch user active study plans |
| `POST` | `/api/planner/generate` | Generate day-by-day exam syllabus plan |
| `POST` | `/api/planner/toggle-task` | Toggle completion for a specific day |
| `POST` | `/api/planner/quick-revision` | Blitz revision session (5m, 15m, 30m, 1h) |

## 8. Analytics & Profile (`/api/analytics`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard` | Streak, XP, daily goal, weak areas, next steps |
| `GET` | `/api/analytics/progress` | Weekly study time charts, accuracy trend |
| `GET` | `/api/analytics/leaderboard` | Diamond Scholar League rankings |
| `GET` | `/api/analytics/achievements` | List of 12 badges and unlocked status |
