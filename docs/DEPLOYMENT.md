# Deployment Guide — AI Study Buddy

## Unified Production Deployment (Recommended)

In production, FastAPI can serve the built frontend static assets from a single port, simplifying deployment on VPS, Render, Railway, or Fly.io.

### Build and Run:
```bash
# 1. Build React frontend bundle
cd frontend
npm install
npm run build
cd ..

# 2. Start FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
FastAPI detects `frontend/dist/` and serves the web application directly at `http://localhost:8000/`.

## Cloud Providers

### Render / Railway / Fly.io (Single Container)
- **Build Command**: `pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..`
- **Start Command**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `DATABASE_URL`: Optional PostgreSQL URL (`postgresql://user:pass@host/dbname`), defaults to SQLite.
  - `GEMINI_API_KEY` or `OPENAI_API_KEY`: Optional external AI keys.
