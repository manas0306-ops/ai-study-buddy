import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from backend.database.db import engine, Base, SessionLocal
from backend.database.seed_data import seed_database

# Routers
from backend.api.routes_ai import router as ai_router
from backend.api.routes_quizzes import router as quizzes_router
from backend.api.routes_flashcards import router as flashcards_router
from backend.api.routes_coding import router as coding_router
from backend.api.routes_games import router as games_router
from backend.api.routes_notes import router as notes_router
from backend.api.routes_planner import router as planner_router
from backend.api.routes_analytics import router as analytics_router
from backend.api.routes_subjects import router as subjects_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="AI Study Buddy API",
    description="Production-grade AI-powered student learning platform with adaptive quizzes, 10 learning games, coding lab, and spaced repetition.",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(ai_router)
app.include_router(quizzes_router)
app.include_router(flashcards_router)
app.include_router(coding_router)
app.include_router(games_router)
app.include_router(notes_router)
app.include_router(planner_router)
app.include_router(analytics_router)
app.include_router(subjects_router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "AI Study Buddy Backend", "version": "2.0.0"}

@app.get("/api")
def api_root():
    return {
        "message": "Welcome to AI Study Buddy API 🎓",
        "docs": "/docs",
        "status": "operational"
    }

# Mount static frontend build if dist folder exists for unified single-port production run
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.isdir(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/") or full_path == "api" or full_path.startswith("docs") or full_path.startswith("openapi"):
            return None
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend not built yet. Run `npm run build` in frontend/"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
