from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User
from backend.ai.tutor import ai_tutor
from backend.ai.explainer import ai_explainer
from backend.ai.debugger import ai_debugger
from backend.ai.summarizer import ai_summarizer
from backend.ai.study_pack import ai_study_pack_gen
from backend.ai.provider import ai_provider

router = APIRouter(prefix="/api/ai", tags=["AI"])

class TutorRequest(BaseModel):
    query: str
    mode: str = "beginner"
    context: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

class ExplainRequest(BaseModel):
    topic: str
    level: str = "Beginner"
    language: str = "English"

class DebugRequest(BaseModel):
    code: str
    language: str = "python"
    context: Optional[str] = None
    mode: str = "hint"  # hint, explain, solution

class SummarizeRequest(BaseModel):
    text: str
    max_points: int = 5

class StudyPackRequest(BaseModel):
    topic: str
    subject: str = "Computer Science"
    difficulty: str = "Intermediate"
    language: str = "English"

@router.get("/status")
def get_ai_status():
    """Check currently active AI provider and connection."""
    return {
        "active_provider": ai_provider.get_active_provider_name(),
        "has_openai": bool(ai_provider.openai_key),
        "has_gemini": bool(ai_provider.gemini_key),
        "has_anthropic": bool(ai_provider.anthropic_key),
        "fallback_available": True
    }

@router.post("/tutor")
async def ask_ai_tutor(req: TutorRequest):
    """Interact with the context-aware AI Tutor across 6 modes."""
    try:
        res = await ai_tutor.get_response(req.query, req.mode, req.context, req.history)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain")
async def explain_concept(req: ExplainRequest):
    """Generate 11-part deep structured learning dossier with analogies, syntax, and practice problems."""
    try:
        return await ai_explainer.explain_topic(req.topic, req.level, req.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/debug")
async def debug_code(req: DebugRequest):
    """Pedagogical code debugging assistant providing hints, diagnostics, or clean solutions."""
    try:
        return await ai_debugger.analyze_code(req.code, req.language, req.context, req.mode)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize")
async def summarize_notes(req: SummarizeRequest):
    """Summarize text, extract formulas, definitions, and revision checklists."""
    try:
        return await ai_summarizer.summarize_text(req.text, req.max_points)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/study-pack")
async def create_study_pack(req: StudyPackRequest):
    """One-click 360-degree Study Pack generation."""
    try:
        return await ai_study_pack_gen.generate_study_pack(req.topic, req.subject, req.difficulty, req.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
