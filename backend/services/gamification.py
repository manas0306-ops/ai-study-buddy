from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.database.models import User, Achievement, UserAchievement, DailyActivity

class GamificationService:
    """Manages XP, streaks, levels, daily goals, and achievements."""

    XP_RULES = {
        "quiz_correct": 10,
        "hard_question": 20,
        "daily_streak": 25,
        "complete_lesson": 50,
        "game_win": 30,
        "flashcard_session": 15,
        "code_problem_solved": 40,
        "document_analyzed": 35
    }

    def award_xp(self, db: Session, user: User, action: str, custom_xp: Optional[int] = None) -> Dict[str, Any]:
        """Awards XP to user, updates level, and returns updated progress and newly unlocked achievements."""
        gained = custom_xp if custom_xp is not None else self.XP_RULES.get(action, 10)
        old_level = user.level
        user.xp += gained

        # Level calculation
        new_level = max(1, 1 + int((user.xp / 250) ** 0.5))
        leveled_up = new_level > old_level
        user.level = new_level

        # Update today's daily activity
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        daily = db.query(DailyActivity).filter_by(user_id=user.id, date=today_str).first()
        if not daily:
            daily = DailyActivity(user_id=user.id, date=today_str, xp_gained=gained)
            db.add(daily)
        else:
            daily.xp_gained += gained

        # Check for achievements
        newly_unlocked = self._check_achievements(db, user)

        db.commit()
        db.refresh(user)

        return {
            "xp_awarded": gained,
            "total_xp": user.xp,
            "level": user.level,
            "leveled_up": leveled_up,
            "newly_unlocked_achievements": newly_unlocked
        }

    def _check_achievements(self, db: Session, user: User) -> List[Dict[str, Any]]:
        unlocked = []
        already_earned = {ua.achievement_code for ua in user.achievements}

        # Check streak
        if user.streak_days >= 7 and "streak_7" not in already_earned:
            unlocked.append(self._unlock_achievement(db, user, "streak_7"))

        # Check XP levels
        if user.xp >= 1000 and "boss_slayer" not in already_earned and user.xp > 2000:
            unlocked.append(self._unlock_achievement(db, user, "boss_slayer"))

        return [u for u in unlocked if u]

    def _unlock_achievement(self, db: Session, user: User, code: str) -> Optional[Dict[str, Any]]:
        ach = db.query(Achievement).filter_by(code=code).first()
        if ach:
            ua = UserAchievement(user_id=user.id, achievement_code=code)
            db.add(ua)
            return {"code": ach.code, "title": ach.title, "xp_reward": ach.xp_reward, "icon": ach.icon}
        return None

gamification_service = GamificationService()
