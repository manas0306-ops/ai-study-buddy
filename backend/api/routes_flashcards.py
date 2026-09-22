from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, FlashcardDeck, Flashcard
from backend.ai.flashcard_generator import ai_flashcard_gen
from backend.services.gamification import gamification_service

router = APIRouter(prefix="/api/flashcards", tags=["Flashcards"])

class CreateDeckRequest(BaseModel):
    title: str
    description: Optional[str] = None
    subject: str = "General"
    topic: str = "General"

class AddCardRequest(BaseModel):
    front: str
    back: str
    hint: Optional[str] = None
    difficulty: str = "Medium"

class GenerateDeckRequest(BaseModel):
    topic: str
    subject: str = "General"
    difficulty: str = "Intermediate"
    count: int = 5

class ReviewRatingRequest(BaseModel):
    rating: str  # again, hard, good, easy

@router.get("/decks")
def list_decks(db: Session = Depends(get_db)):
    """List all flashcard decks with card counts and due cards."""
    decks = db.query(FlashcardDeck).all()
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    result = []
    for d in decks:
        due_count = sum(
            1 for c in d.cards 
            if c.next_review and (c.next_review.replace(tzinfo=None) if hasattr(c.next_review, 'tzinfo') and c.next_review.tzinfo else c.next_review) <= now
        )
        result.append({
            "id": d.id,
            "title": d.title,
            "description": d.description,
            "subject": d.subject,
            "topic": d.topic,
            "is_ai_generated": d.is_ai_generated,
            "cards_count": len(d.cards),
            "due_count": due_count
        })
    return result

@router.get("/decks/{deck_id}")
def get_deck(deck_id: int, db: Session = Depends(get_db)):
    """Retrieve full deck with flashcard objects."""
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    return {
        "id": deck.id,
        "title": deck.title,
        "description": deck.description,
        "subject": deck.subject,
        "topic": deck.topic,
        "cards": [
            {
                "id": c.id,
                "front": c.front,
                "back": c.back,
                "hint": c.hint,
                "difficulty": c.difficulty,
                "interval_days": c.interval_days,
                "repetition": c.repetition,
                "ease_factor": c.ease_factor,
                "next_review": c.next_review.isoformat() if c.next_review else None
            }
            for c in deck.cards
        ]
    }

@router.post("/decks")
def create_deck(req: CreateDeckRequest, db: Session = Depends(get_db)):
    """Create a new manual flashcard deck."""
    user = db.query(User).first()
    deck = FlashcardDeck(
        user_id=user.id if user else None,
        title=req.title,
        description=req.description,
        subject=req.subject,
        topic=req.topic,
        is_ai_generated=False
    )
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return {"id": deck.id, "title": deck.title, "cards_count": 0}

@router.post("/decks/{deck_id}/cards")
def add_card_to_deck(deck_id: int, req: AddCardRequest, db: Session = Depends(get_db)):
    """Add a card to an existing deck."""
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    card = Flashcard(
        deck_id=deck.id,
        front=req.front,
        back=req.back,
        hint=req.hint,
        difficulty=req.difficulty,
        interval_days=1,
        repetition=0,
        ease_factor=2.5,
        next_review=datetime.now(timezone.utc)
    )
    db.add(card)
    deck.cards_count += 1
    db.commit()
    db.refresh(card)
    return {"id": card.id, "front": card.front, "back": card.back}

@router.post("/generate")
async def generate_ai_deck(req: GenerateDeckRequest, db: Session = Depends(get_db)):
    """Generate and persist an AI-curated flashcard deck."""
    cards_data = await ai_flashcard_gen.generate_deck(
        topic=req.topic,
        subject=req.subject,
        difficulty=req.difficulty,
        count=req.count
    )

    user = db.query(User).first()
    deck = FlashcardDeck(
        user_id=user.id if user else None,
        title=f"{req.topic} Mastery Deck",
        description=f"AI-generated high-yield flashcards for {req.topic}.",
        subject=req.subject,
        topic=req.topic,
        is_ai_generated=True,
        cards_count=len(cards_data)
    )
    db.add(deck)
    db.flush()

    for c in cards_data:
        db.add(Flashcard(
            deck_id=deck.id,
            front=c["front"],
            back=c["back"],
            hint=c.get("hint"),
            difficulty=c.get("difficulty", "Medium"),
            interval_days=1,
            repetition=0,
            ease_factor=2.5,
            next_review=datetime.now(timezone.utc)
        ))

    db.commit()
    db.refresh(deck)
    return get_deck(deck.id, db)

@router.post("/cards/{card_id}/review")
def review_flashcard(card_id: int, req: ReviewRatingRequest, db: Session = Depends(get_db)):
    """Update spaced repetition parameters using SuperMemo SM-2 logic."""
    card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    user = db.query(User).first()
    rating = req.rating.lower()

    # SM-2 calculation
    # Quality scale: again=1, hard=2, good=3, easy=4
    q_map = {"again": 1, "hard": 2, "good": 3, "easy": 4}
    quality = q_map.get(rating, 3)

    if quality >= 3:
        if card.repetition == 0:
            card.interval_days = 1
        elif card.repetition == 1:
            card.interval_days = 6
        else:
            card.interval_days = int(card.interval_days * card.ease_factor)
        card.repetition += 1
    else:
        card.repetition = 0
        card.interval_days = 1

    # Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    card.ease_factor = max(1.3, card.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    card.last_reviewed = datetime.now(timezone.utc)
    card.next_review = datetime.now(timezone.utc) + timedelta(days=card.interval_days)

    # Award XP for active recall review
    gamification_res = gamification_service.award_xp(db, user, "flashcard_session", custom_xp=15)

    db.commit()

    return {
        "card_id": card.id,
        "new_interval_days": card.interval_days,
        "repetition": card.repetition,
        "next_review": card.next_review.isoformat(),
        "xp_awarded": 15,
        "total_xp": user.xp
    }
