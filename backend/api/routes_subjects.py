from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from backend.database.db import get_db
from backend.database.models import Subject, Topic, CodingProblem, FlashcardDeck, Quiz, Note

router = APIRouter(tags=["Subjects, Paths & Search"])

@router.get("/api/subjects")
def list_subjects(category: Optional[str] = None, db: Session = Depends(get_db)):
    """List all subjects organized by category with topic counts."""
    query = db.query(Subject)
    if category:
        query = query.filter(Subject.category.ilike(f"%{category}%"))
    subjects = query.all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "slug": s.slug,
            "category": s.category,
            "description": s.description,
            "icon": s.icon,
            "color": s.color,
            "topics_count": len(s.topics),
            "topics": [
                {
                    "id": t.id,
                    "name": t.name,
                    "slug": t.slug,
                    "difficulty": t.difficulty,
                    "estimated_minutes": t.estimated_minutes,
                    "mastery_percent": t.mastery_percent
                }
                for t in s.topics
            ]
        }
        for s in subjects
    ]

@router.get("/api/subjects/{slug}")
def get_subject(slug: str, db: Session = Depends(get_db)):
    """Retrieve details and topics for a specific subject."""
    subject = db.query(Subject).filter(Subject.slug == slug).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    return {
        "id": subject.id,
        "name": subject.name,
        "slug": subject.slug,
        "category": subject.category,
        "description": subject.description,
        "icon": subject.icon,
        "color": subject.color,
        "topics": [
            {
                "id": t.id,
                "name": t.name,
                "slug": t.slug,
                "description": t.description,
                "difficulty": t.difficulty,
                "estimated_minutes": t.estimated_minutes,
                "mastery_percent": t.mastery_percent
            }
            for t in subject.topics
        ]
    }

@router.get("/api/learning-paths")
def get_learning_paths():
    """Curated structured career and mastery learning paths."""
    return [
        {
            "id": "path_python_dev",
            "title": "Python Developer Path",
            "category": "Software Engineering",
            "description": "Zero to production-ready Python programmer covering core syntax, data structures, OOP, and backend APIs.",
            "total_modules": 10,
            "completed_modules": 6,
            "progress_percent": 60,
            "estimated_hours": 35,
            "modules": [
                {"title": "Python Basics & Types", "status": "Completed"},
                {"title": "Conditions & Flow Control", "status": "Completed"},
                {"title": "Loops & Iterations", "status": "Completed"},
                {"title": "Functions & Variable Scope", "status": "Completed"},
                {"title": "Lists & Dict Comprehensions", "status": "Completed"},
                {"title": "Object-Oriented Programming (OOP)", "status": "Completed"},
                {"title": "File Handling & Modules", "status": "In Progress"},
                {"title": "Exception Handling & Unit Testing", "status": "Locked"},
                {"title": "Data Structures in Python", "status": "Locked"},
                {"title": "Capstone API Project", "status": "Locked"}
            ]
        },
        {
            "id": "path_dsa_master",
            "title": "Data Structures & Algorithms Interview Master",
            "category": "Interview Prep",
            "description": "Crack FAANG and top product company coding rounds with algorithmic patterns and Big-O mastery.",
            "total_modules": 8,
            "completed_modules": 3,
            "progress_percent": 38,
            "estimated_hours": 50,
            "modules": [
                {"title": "Time & Space Complexity (Big-O)", "status": "Completed"},
                {"title": "Two-Pointer & Sliding Window", "status": "Completed"},
                {"title": "Fast & Slow Pointers (Linked Lists)", "status": "Completed"},
                {"title": "Stack & Monotonic Stack Patterns", "status": "In Progress"},
                {"title": "Binary Trees & BST Traversals", "status": "Locked"},
                {"title": "Graph BFS & DFS", "status": "Locked"},
                {"title": "Dynamic Programming Essentials", "status": "Locked"},
                {"title": "Mock Technical Interview Rounds", "status": "Locked"}
            ]
        }
    ]

@router.get("/api/projects")
def get_guided_projects():
    """Step-by-step guided project blueprints."""
    return [
        {
            "id": "proj_calc",
            "title": "CLI Smart Calculator with History",
            "level": "Beginner",
            "tech_stack": ["Python"],
            "description": "Build an interactive command-line calculator that parses math expressions and saves transaction history to disk.",
            "features": ["Operator precedence", "Memory recall", "Error handling for zero-division"],
            "estimated_hours": 4
        },
        {
            "id": "proj_weather",
            "title": "Weather Dashboard & Forecast App",
            "level": "Intermediate",
            "tech_stack": ["JavaScript", "HTML/CSS", "OpenWeather API"],
            "description": "Fetch live weather data from REST APIs, handle async promises, and display 7-day temperature trends with charts.",
            "features": ["Geolocation lookup", "Dynamic weather icons", "Local storage caching"],
            "estimated_hours": 8
        },
        {
            "id": "proj_study_buddy",
            "title": "AI Study Buddy & Spaced Repetition Engine",
            "level": "Advanced",
            "tech_stack": ["Python", "FastAPI", "React", "SQLite", "OpenAI / Gemini"],
            "description": "Create a full-stack educational web application with AI tutoring, SM-2 flashcards, and sandboxed code execution.",
            "features": ["Multi-provider AI service layer", "Code execution sandbox", "Interactive learning games"],
            "estimated_hours": 20
        }
    ]

@router.get("/api/search")
def global_search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """Global search across topics, quizzes, flashcards, coding problems, notes, and games."""
    term = f"%{q.strip()}%"
    results = {
        "topics": [],
        "quizzes": [],
        "coding_problems": [],
        "flashcard_decks": [],
        "notes": []
    }

    # Search Topics
    topics = db.query(Topic).filter(Topic.name.ilike(term)).limit(5).all()
    results["topics"] = [{"id": t.id, "name": t.name, "slug": t.slug, "difficulty": t.difficulty} for t in topics]

    # Search Quizzes
    quizzes = db.query(Quiz).filter(Quiz.title.ilike(term) | Quiz.topic.ilike(term)).limit(5).all()
    results["quizzes"] = [{"id": qz.id, "title": qz.title, "difficulty": qz.difficulty} for qz in quizzes]

    # Search Coding Problems
    problems = db.query(CodingProblem).filter(CodingProblem.title.ilike(term) | CodingProblem.category.ilike(term)).limit(5).all()
    results["coding_problems"] = [{"id": p.id, "title": p.title, "slug": p.slug, "difficulty": p.difficulty} for p in problems]

    # Search Flashcard Decks
    decks = db.query(FlashcardDeck).filter(FlashcardDeck.title.ilike(term) | FlashcardDeck.topic.ilike(term)).limit(5).all()
    results["flashcard_decks"] = [{"id": d.id, "title": d.title, "cards_count": len(d.cards)} for d in decks]

    # Search Notes
    notes = db.query(Note).filter(Note.title.ilike(term) | Note.content.ilike(term)).limit(5).all()
    results["notes"] = [{"id": n.id, "title": n.title, "folder": n.folder} for n in notes]

    total_matches = sum(len(items) for items in results.values())
    return {
        "query": q,
        "total_results": total_matches,
        "results": results
    }
