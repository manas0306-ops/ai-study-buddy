from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, Quiz, Question, QuizAttempt, Topic
from backend.ai.quiz_generator import ai_quiz_gen
from backend.services.gamification import gamification_service

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])

class QuizSubmission(BaseModel):
    user_id: Optional[int] = 1
    time_taken_seconds: int
    answers: Dict[int, str]  # question_id -> user_selected_answer

class GenerateQuizRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "Intermediate"
    total_questions: int = 5
    is_adaptive: bool = False

class WhyWrongRequest(BaseModel):
    question_text: str
    user_answer: str
    correct_answer: str
    concept: Optional[str] = None

@router.get("")
def list_quizzes(db: Session = Depends(get_db)):
    """List all available pre-built and adaptive quizzes."""
    quizzes = db.query(Quiz).all()
    return [
        {
            "id": q.id,
            "title": q.title,
            "subject": q.subject,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "time_limit_seconds": q.time_limit_seconds,
            "total_questions": len(q.questions) if q.questions else q.total_questions,
            "is_adaptive": q.is_adaptive
        }
        for q in quizzes
    ]

@router.get("/{quiz_id}")
def get_quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    """Retrieve full quiz with question details."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "id": quiz.id,
        "title": quiz.title,
        "subject": quiz.subject,
        "topic": quiz.topic,
        "difficulty": quiz.difficulty,
        "time_limit_seconds": quiz.time_limit_seconds,
        "is_adaptive": quiz.is_adaptive,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "code_snippet": q.code_snippet,
                "options": q.options,
                "concept": q.concept,
                "difficulty": q.difficulty
            }
            for q in quiz.questions
        ]
    }

@router.post("/generate")
async def generate_custom_quiz(req: GenerateQuizRequest, db: Session = Depends(get_db)):
    """Dynamically generate an AI quiz for any subject and topic."""
    questions_data = await ai_quiz_gen.generate_quiz(
        req.subject, req.topic, req.difficulty, req.total_questions
    )

    new_quiz = Quiz(
        title=f"{req.topic} ({req.difficulty}) Quiz",
        subject=req.subject,
        topic=req.topic,
        difficulty=req.difficulty,
        time_limit_seconds=req.total_questions * 40,
        total_questions=len(questions_data),
        is_adaptive=req.is_adaptive
    )
    db.add(new_quiz)
    db.flush()

    for q in questions_data:
        db.add(Question(
            quiz_id=new_quiz.id,
            question_text=q["question_text"],
            question_type=q.get("question_type", "mcq"),
            code_snippet=q.get("code_snippet"),
            options=q.get("options", []),
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation"),
            misconception=q.get("misconception"),
            concept=q.get("concept", req.topic),
            difficulty=q.get("difficulty", req.difficulty)
        ))

    db.commit()
    db.refresh(new_quiz)

    return get_quiz_details(new_quiz.id, db)

@router.post("/{quiz_id}/submit")
def submit_quiz_attempt(quiz_id: int, sub: QuizSubmission, db: Session = Depends(get_db)):
    """Evaluate quiz submission, compute score, award XP, and generate AI performance diagnostics."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    user = db.query(User).filter(User.id == sub.user_id).first()
    if not user:
        user = db.query(User).first()

    score = 0
    total = len(quiz.questions)
    detailed_results = []
    weak_concepts = []

    for q in quiz.questions:
        user_ans = sub.answers.get(q.id, "").strip()
        is_correct = (user_ans.lower() == q.correct_answer.strip().lower())
        if is_correct:
            score += 1
        else:
            if q.concept and q.concept not in weak_concepts:
                weak_concepts.append(q.concept)

        detailed_results.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "user_answer": user_ans,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation,
            "misconception": q.misconception,
            "concept": q.concept
        })

    accuracy = round((score / total * 100) if total > 0 else 0, 1)

    # Award XP
    xp_to_award = score * 10
    if accuracy >= 80:
        xp_to_award += 20  # high accuracy bonus
    gamification_res = gamification_service.award_xp(db, user, "quiz_correct", custom_xp=xp_to_award)

    # AI Personalized recommendation
    if accuracy >= 80:
        ai_recommendation = f"Outstanding work! You demonstrated strong mastery ({accuracy}%). Ready to advance to harder problems."
    elif accuracy >= 50:
        ai_recommendation = f"Good effort ({accuracy}%). You did well, but review {', '.join(weak_concepts[:2]) if weak_concepts else 'missed questions'} to lock down this topic."
    else:
        ai_recommendation = f"You struggled with {', '.join(weak_concepts[:2]) if weak_concepts else 'this quiz'} ({accuracy}%). Spend 15 minutes reviewing before re-attempting."

    # Record Attempt
    attempt = QuizAttempt(
        user_id=user.id,
        quiz_id=quiz.id,
        score=score,
        total_questions=total,
        accuracy=accuracy,
        time_taken_seconds=sub.time_taken_seconds,
        answers_summary=detailed_results,
        ai_recommendation=ai_recommendation
    )
    db.add(attempt)

    # Update topic mastery if topic exists in db
    topic_obj = db.query(Topic).filter(Topic.name.ilike(f"%{quiz.topic}%")).first()
    if topic_obj:
        # Rolling update of topic mastery
        topic_obj.mastery_percent = min(100, int((topic_obj.mastery_percent * 0.7) + (accuracy * 0.3)))

    db.commit()

    return {
        "score": score,
        "total_questions": total,
        "accuracy": accuracy,
        "time_taken_seconds": sub.time_taken_seconds,
        "xp_earned": xp_to_award,
        "total_xp": user.xp,
        "level": user.level,
        "ai_recommendation": ai_recommendation,
        "detailed_results": detailed_results,
        "weak_concepts": weak_concepts
    }

@router.post("/why-was-i-wrong")
def why_was_i_wrong(req: WhyWrongRequest):
    """Deep misconception diagnostic for an incorrect answer."""
    return ai_quiz_gen.generate_why_was_i_wrong(
        req.question_text, req.user_answer, req.correct_answer, req.concept
    )
