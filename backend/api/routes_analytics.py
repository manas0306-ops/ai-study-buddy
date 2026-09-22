from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import (
    User, DailyActivity, Topic, QuizAttempt, Achievement, UserAchievement
)
from backend.ai.recommender import ai_recommender

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Progress"])

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    """Comprehensive personalized user dashboard statistics and AI recommendations."""
    user = db.query(User).first()
    if not user:
        return {}

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_act = db.query(DailyActivity).filter_by(user_id=user.id, date=today_str).first()
    questions_today = today_act.questions_completed if today_act else 12

    # Recommendations & weak areas from AI recommender
    rec_pack = ai_recommender.get_user_recommendations(db, user)

    return {
        "greeting": f"Good morning, {user.full_name} 👋",
        "subtitle": "Ready to continue mastering computer science today?",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "xp": user.xp,
            "level": user.level,
            "streak_days": user.streak_days,
            "preferred_language": user.preferred_language,
            "preferred_difficulty": user.preferred_difficulty
        },
        "today_goal": {
            "target_questions": user.daily_goal_questions,
            "completed_questions": questions_today,
            "progress_percent": min(100, int((questions_today / user.daily_goal_questions) * 100))
        },
        "continue_learning": {
            "subject": "Python",
            "topic": "Loops & Iteration",
            "progress_percent": 62,
            "estimated_minutes": 15,
            "slug": "loops-iteration"
        },
        "weak_areas": rec_pack["weak_areas"],
        "strong_areas": rec_pack["strong_areas"],
        "ai_recommendation": rec_pack["primary_recommendation"],
        "action_items": rec_pack["action_items"]
    }

@router.get("/progress")
def get_progress_analytics(db: Session = Depends(get_db)):
    """Historical charts, weekly study time, accuracy trends, and topic mastery radar."""
    user = db.query(User).first()
    if not user:
        return {}

    # Get last 7 days activities
    activities = (
        db.query(DailyActivity)
        .filter_by(user_id=user.id)
        .order_by(DailyActivity.date.desc())
        .limit(7)
        .all()
    )
    activities.reverse()

    weekly_study_time = [
        {"date": a.date[-5:], "minutes": a.minutes_spent, "xp": a.xp_gained, "questions": a.questions_completed}
        for a in activities
    ]

    # Topic mastery radar data
    topics = db.query(Topic).limit(6).all()
    topic_radar = [
        {"topic": t.name, "mastery": t.mastery_percent, "difficulty": t.difficulty}
        for t in topics
    ]

    return {
        "weekly_activity": weekly_study_time,
        "topic_mastery": topic_radar,
        "summary": {
            "total_xp": user.xp,
            "current_streak": user.streak_days,
            "problems_solved": 38,
            "quizzes_completed": 14,
            "average_accuracy": 78.4,
            "total_study_hours": 18.5
        }
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """Global and weekly study league leaderboard."""
    return {
        "current_user_rank": 3,
        "league": "Diamond Scholar League",
        "days_left_in_season": 3,
        "ranks": [
            {"rank": 1, "name": "Priya Sharma", "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Priya", "xp": 2840, "streak": 19, "badge": "Grandmaster"},
            {"rank": 2, "name": "Devin Chen", "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Devin", "xp": 2190, "streak": 14, "badge": "Code Ninja"},
            {"rank": 3, "name": "Alex Johnson (You)", "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=studybuddy", "xp": 1240, "streak": 7, "badge": "Speed Learner"},
            {"rank": 4, "name": "Rohan Patel", "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan", "xp": 1150, "streak": 5, "badge": "Scholar"},
            {"rank": 5, "name": "Sofia Rossi", "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Sofia", "xp": 980, "streak": 8, "badge": "Bug Hunter"}
        ]
    }

@router.get("/achievements")
def get_achievements(db: Session = Depends(get_db)):
    """List all achievement badges with user unlocked status."""
    user = db.query(User).first()
    achievements = db.query(Achievement).all()
    user_unlocked = {ua.achievement_code for ua in user.achievements} if user else set()

    return [
        {
            "code": a.code,
            "title": a.title,
            "description": a.description,
            "icon": a.icon,
            "xp_reward": a.xp_reward,
            "category": a.category,
            "unlocked": a.code in user_unlocked
        }
        for a in achievements
    ]
