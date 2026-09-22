# Architecture Overview — AI Study Buddy

## High-Level System Architecture

AI Study Buddy is architected as a modern decoupled full-stack educational web platform, designed to be scalable, cloud-agnostic, and completely functional even without external paid API keys.

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  React 19 + Vite + Tailwind CSS v4 + Lucide Icons + Canvas + Web Audio  |
|                                                                         |
|  - Landing Page            - AI Tutor (6 Modes)     - 10 Learning Games |
|  - Student Dashboard       - 3D Flashcards (SM-2)   - Coding Lab & Run  |
|  - Concept Explainer       - Adaptive Quiz Engine   - Notes & PDF Study |
+------------------------------------+------------------------------------+
                                     | REST API (JSON / HTTP)
                                     v
+-------------------------------------------------------------------------+
|                              BACKEND TIER                               |
|                     FastAPI + Pydantic v2 + Uvicorn                     |
|                                                                         |
|  +--------------------+  +--------------------+  +--------------------+ |
|  |  API Route Layer   |  | AI Service Layer   |  | Services Layer     | |
|  |  - /api/ai         |  | - Provider (Multi) |  | - Code Sandbox     | |
|  |  - /api/quizzes    |  | - Tutor (6 Modes)  |  | - Doc Parser (PDF) | |
|  |  - /api/flashcards |  | - Explainer (11-pt)|  | - Gamification XP  | |
|  |  - /api/coding     |  | - Recommender      |  | - SM-2 Scheduler   | |
|  |  - /api/games      |  | - Debugger         |  |                    | |
|  |  - /api/notes      |  | - Offline Fallback |  |                    | |
|  +--------------------+  +--------------------+  +--------------------+ |
+------------------------------------+------------------------------------+
                                     | SQLAlchemy ORM
                                     v
+-------------------------------------------------------------------------+
|                              DATA TIER                                  |
|         SQLite (Development) / PostgreSQL (Cloud Production)            |
|                                                                         |
|  - Users & Profiles        - Flashcard Decks & Cards (SM-2 intervals)   |
|  - Subjects & Topics       - Quizzes, Questions & Attempt Diagnostics   |
|  - Notes & Uploads         - Coding Problems & Safe Submissions         |
|  - Study Plans & Tasks     - Arcade Game Sessions & XP Logs             |
+-------------------------------------------------------------------------+
```

## Security & Sandboxed Code Execution
- **Child Process Isolation**: Submissions are executed in separate temporary subprocesses with execution timeout limits (`CODE_RUN_TIMEOUT_SECONDS=5`).
- **Code Length Limit**: Rejects scripts larger than 10,000 characters to prevent memory exhaustion.
- **Environment Isolation**: No system credentials or database handles are accessible from the execution worker.
