# AI Study Buddy 🎓 — Personal AI Learning Companion

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.13-blue.svg?logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/Tests-10%20Passed-brightgreen.svg)]()

> *"Learn it. Understand it. Practice it. Play it. Master it."*

**AI Study Buddy** is a centralized, production-grade learning ecosystem for students and software engineers. Combining the active recall of **Quizlet**, gamified streaks of **Duolingo**, code execution of **LeetCode**, and an adaptive **AI Tutor**, AI Study Buddy provides everything needed for computer science, engineering, and exam preparation in one beautiful platform.

---

## 🌟 Key Highlights

- **🧠 Dedicated AI Tutor with 6 Modes**:
  - *Beginner Mode*: Plain-English, jargon-free explanations with everyday analogies.
  - *Exam Mode*: High-scoring bulleted definitions and formulas.
  - *Deep Dive*: Low-level systems mechanics, call stack, and asymptotic Big-O.
  - *Interview Mode*: Mock technical interviewer probing algorithmic trade-offs.
  - *Socratic Mode*: Asks guiding questions to help you arrive at the answer yourself.
  - *Bilingual Mode*: English technical concepts paired with conversational Hindi & Hinglish.
- **🃏 SuperMemo SM-2 Spaced Repetition**: 3D flip flashcards scheduled with scientifically proven recall intervals (`Again`, `Hard`, `Good`, `Easy`).
- **📝 Adaptive Quizzes & "Why Was I Wrong?" Diagnostics**: Identifies conceptual errors, pinpoints the underlying misconception, and generates similar follow-up questions.
- **💻 Sandboxed Multi-Language Coding Lab**: Interactive compiler environment supporting **Python**, **JavaScript**, **C**, **C++**, and **Java** with test harnesses and a pedagogical AI Debugger (*"Give Hint"*, *"Explain Error"*, *"Show Solution"*).
- **🎮 10 Educational Learning Games**:
  1. *Code Rush* — Speed trivia against an accelerating timer.
  2. *Bug Hunter* — Identify syntax and logical bugs in code.
  3. *Output Predictor* — Predict console output for tricky code blocks.
  4. *Memory Match* — Tile-flipping game pairing CS concepts to definitions.
  5. *Flashcard Battle* — Rapid-fire flashcards with combo multipliers.
  6. *Algorithm Maze* — Navigate a dungeon by answering algorithmic puzzles.
  7. *Typing Code* — Practice syntax muscle memory and measure WPM.
  8. *Binary Battle* — Number system conversions against the clock.
  9. *SQL Detective* — Solve a crime at Silicon Manor through SQL database queries.
  10. *AI Quiz Boss* — RPG boss battle with HP bars against Neural Overlord Alpha!
- **📚 Smart Notes & Document Upload**: Upload PDF, DOCX, or TXT lecture notes and automatically extract summaries, key definitions, flashcards, and quizzes.
- **🎯 AI Study Planner & Blitz Revision**: Day-by-day auto-scheduled exam syllabi and 5 to 60 minute timed revision sessions.
- **⚡ Zero-API-Key Offline Fallback**: Features a comprehensive built-in offline educational engine. The entire platform works 100% out of the box with or without external paid API keys.

---

## 🏗️ Architecture

```
ai-study-buddy/
├── backend/
│   ├── api/             # REST endpoints (AI, quizzes, flashcards, coding, games, notes, planner)
│   ├── ai/              # Multi-provider layer (OpenAI, Gemini, Claude, Offline Fallback Engine)
│   ├── database/        # SQLAlchemy ORM models, SQLite engine, starter seed data
│   ├── services/        # Sandboxed code execution, PDF/DOCX parser, gamification XP
│   ├── tests/           # Automated pytest suite (10/10 passing)
│   └── main.py          # FastAPI application entrypoint with unified static serving
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Sidebar, Global Search (Ctrl+K), Onboarding, Floating AI Chat
│   │   ├── pages/       # LandingPage, Dashboard, Learn, AITutor, Explainer, Flashcards,
│   │   │                # Quizzes, CodingLab, Games (10 modes), Notes, Planner, Progress, etc.
│   │   └── services/    # Frontend API client
│   └── dist/            # Production client bundle
├── docs/                # Architectural, API, AI, Games, and Deployment documentation
├── start.bat            # One-click Windows launch script
├── start.sh             # One-click Unix/macOS launch script
└── PROGRESS.md          # Complete project development checklist
```

---

## 🚀 Quick Start

### 1. One-Click Launch (Windows)
Double click `start.bat` or run:
```bat
start.bat
```

### 2. Manual Startup

#### Backend:
```bash
pip install -r requirements.txt
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API & App: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

#### Frontend Development Server:
```bash
cd frontend
npm install
npm run dev
```
- Frontend Dev Server: `http://localhost:5173`

---

## 🧪 Automated Testing

AI Study Buddy includes a comprehensive backend automated test suite:

```bash
python -m pytest backend/tests
```

```
backend/tests/test_ai.py .....                                           [ 50%]
backend/tests/test_learning.py .....                                     [100%]
============================= 10 passed in 1.24s ==============================
```

To verify the frontend build:
```bash
cd frontend && npm run build
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (see `.env.example`):

```ini
PORT=8000
HOST=127.0.0.1
DEBUG=True
DATABASE_URL=sqlite:///./study_buddy.db

# Optional External AI Providers (Platform includes rich offline fallback engine!)
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
DEFAULT_AI_PROVIDER=auto

# Code Execution Limits
CODE_RUN_TIMEOUT_SECONDS=5
MAX_CODE_LENGTH=10000
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Reference](docs/API.md)
- [AI Engine & Modes](docs/AI.md)
- [10 Learning Games Guide](docs/GAMES.md)
- [Development Setup](docs/DEVELOPMENT.md)
- [Production Deployment](docs/DEPLOYMENT.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
