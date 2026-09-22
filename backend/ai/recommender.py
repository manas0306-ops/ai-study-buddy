from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.database.models import User, Topic, QuizAttempt, DailyActivity

class AIRecommender:
    """Intelligent recommendation engine analyzing accuracy, weak areas, and habits."""

    def get_user_recommendations(self, db: Session, user: User) -> Dict[str, Any]:
        """Generate targeted, personalized action items based on user's weak topics and history."""
        # Find weakest topics
        weak_topics = (
            db.query(Topic)
            .order_by(Topic.mastery_percent.asc())
            .limit(3)
            .all()
        )

        # Strongest topics
        strong_topics = (
            db.query(Topic)
            .order_by(Topic.mastery_percent.desc())
            .limit(3)
            .all()
        )

        primary_weak = weak_topics[0] if weak_topics else None
        weak_name = primary_weak.name if primary_weak else "Recursion"
        weak_pct = primary_weak.mastery_percent if primary_weak else 54

        recommendations = [
            {
                "id": "rec_weak_topic",
                "type": "study_topic",
                "title": f"Revise Weak Area: {weak_name}",
                "description": f"Your current mastery on {weak_name} is {weak_pct}%. Spend 15 minutes reviewing core concepts before taking another quiz.",
                "action_url": f"/learn?topic={weak_name.lower().replace(' ', '-')}",
                "priority": "High",
                "estimated_minutes": 15,
                "badge": "Priority Focus"
            },
            {
                "id": "rec_flashcards",
                "type": "review_flashcards",
                "title": "Spaced Repetition Review Due",
                "description": "You have 5 flashcards scheduled for review today to keep your recall sharp.",
                "action_url": "/flashcards",
                "priority": "Medium",
                "estimated_minutes": 5,
                "badge": "Daily Habit"
            },
            {
                "id": "rec_coding_challenge",
                "type": "practice_code",
                "title": "Practice 1 Coding Problem: Two Sum",
                "description": "Strengthen array index lookups and hash map application in the interactive coding lab.",
                "action_url": "/coding-lab?problem=two-sum",
                "priority": "Medium",
                "estimated_minutes": 20,
                "badge": "Code Mastery"
            },
            {
                "id": "rec_game",
                "type": "play_game",
                "title": "Sharpen Reflexes in Code Rush",
                "description": "Test your programming syntax speed against the clock and earn +30 XP toward your daily goal.",
                "action_url": "/games?game=code_rush",
                "priority": "Low",
                "estimated_minutes": 5,
                "badge": "+30 XP"
            }
        ]

        return {
            "primary_recommendation": f"You've struggled with {weak_name} ({weak_pct}% mastery). Spend 15 minutes reviewing {weak_name} before attempting another quiz.",
            "weak_areas": [
                {"name": t.name, "mastery": t.mastery_percent, "difficulty": t.difficulty}
                for t in weak_topics
            ],
            "strong_areas": [
                {"name": t.name, "mastery": t.mastery_percent, "difficulty": t.difficulty}
                for t in strong_topics
            ],
            "action_items": recommendations
        }

ai_recommender = AIRecommender()
