from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, Note, FlashcardDeck, Flashcard, Quiz, Question
from backend.services.doc_parser import doc_parser
from backend.ai.summarizer import ai_summarizer
from backend.ai.flashcard_generator import ai_flashcard_gen
from backend.ai.quiz_generator import ai_quiz_gen

router = APIRouter(prefix="/api/notes", tags=["Notes & Document Learning"])

class NoteCreateRequest(BaseModel):
    user_id: Optional[int] = 1
    title: str
    content: str
    folder: str = "General"
    tags: List[str] = []
    is_pinned: bool = False

class NoteUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder: Optional[str] = None
    tags: Optional[List[str]] = None
    is_pinned: Optional[bool] = None

class ConvertNoteRequest(BaseModel):
    action: str  # summarize, flashcards, quiz

@router.get("")
def list_notes(folder: Optional[str] = None, db: Session = Depends(get_db)):
    """List all notes, sorted by pinned status and updated date."""
    query = db.query(Note)
    if folder:
        query = query.filter(Note.folder == folder)
    notes = query.order_by(Note.is_pinned.desc(), Note.updated_at.desc()).all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "folder": n.folder,
            "tags": n.tags,
            "is_pinned": n.is_pinned,
            "created_at": n.created_at.isoformat() if n.created_at else None,
            "updated_at": n.updated_at.isoformat() if n.updated_at else None
        }
        for n in notes
    ]

@router.post("")
def create_note(req: NoteCreateRequest, db: Session = Depends(get_db)):
    """Create a new study note."""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        user = db.query(User).first()

    note = Note(
        user_id=user.id if user else None,
        title=req.title,
        content=req.content,
        folder=req.folder,
        tags=req.tags,
        is_pinned=req.is_pinned
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"id": note.id, "title": note.title, "folder": note.folder}

@router.put("/{note_id}")
def update_note(note_id: int, req: NoteUpdateRequest, db: Session = Depends(get_db)):
    """Update note content or metadata."""
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if req.title is not None:
        note.title = req.title
    if req.content is not None:
        note.content = req.content
    if req.folder is not None:
        note.folder = req.folder
    if req.tags is not None:
        note.tags = req.tags
    if req.is_pinned is not None:
        note.is_pinned = req.is_pinned

    note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(note)
    return {"id": note.id, "title": note.title, "status": "updated"}

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note."""
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"status": "deleted", "id": note_id}

@router.post("/upload-document")
async def upload_document_for_study(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload PDF, DOCX, or TXT file, parse content, and return full AI extraction."""
    file_bytes = await file.read()
    extracted_text = doc_parser.extract_text(file.filename, file_bytes)

    # Summarize with AI
    summary_pack = await ai_summarizer.summarize_text(extracted_text, max_points=6)

    # Save as a note automatically
    user = db.query(User).first()
    new_note = Note(
        user_id=user.id if user else None,
        title=f"Doc Notes: {file.filename}",
        content=f"# Document Analysis: {file.filename}\n\n{summary_pack['summary']}\n\n### Key Extracted Content:\n{extracted_text[:2000]}...",
        folder="Uploaded Documents",
        tags=["document", file.filename.split(".")[-1]],
        is_pinned=False
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "filename": file.filename,
        "note_id": new_note.id,
        "text_preview": extracted_text[:1000],
        "total_characters": len(extracted_text),
        "summary": summary_pack["summary"],
        "key_points": summary_pack["key_points"],
        "definitions": summary_pack["important_definitions"],
        "formulas": summary_pack["important_formulas"],
        "checklist": summary_pack["revision_checklist"]
    }
