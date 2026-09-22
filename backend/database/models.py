from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, default="learner")
    email = Column(String(100), unique=True, index=True, default="learner@studybuddy.ai")
    full_name = Column(String(100), default="Alex Johnson")
    avatar_url = Column(String(255), default="/avatars/default.png")
    xp = Column(Integer, default=1240)
    level = Column(Integer, default=4)
    streak_days = Column(Integer, default=7)
    last_active_date = Column(String(20), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    preferred_language = Column(String(20), default="English")  # English, Hindi, Hinglish
    preferred_difficulty = Column(String(20), default="Intermediate")
    daily_goal_questions = Column(Integer, default=20)
    daily_goal_minutes = Column(Integer, default=45)
    learning_style = Column(String(50), default="Interactive & Visual")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    decks = relationship("FlashcardDeck", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    game_sessions = relationship("LearningGameSession", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("CodeSubmission", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    category = Column(String(50), index=True)  # Programming, Computer Science, Mathematics, Engineering, Career
    description = Column(Text)
    icon = Column(String(50), default="BookOpen")
    color = Column(String(20), default="blue")
    topics_count = Column(Integer, default=0)

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), index=True)
    name = Column(String(100), index=True)
    slug = Column(String(100), index=True)
    description = Column(Text)
    difficulty = Column(String(20), default="Beginner")  # Beginner, Intermediate, Advanced
    estimated_minutes = Column(Integer, default=20)
    mastery_percent = Column(Integer, default=0)
    order_index = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="topics")


class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(120), index=True)
    description = Column(Text, nullable=True)
    subject = Column(String(100), default="General")
    topic = Column(String(100), default="General")
    is_ai_generated = Column(Boolean, default=False)
    cards_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("flashcard_decks.id"), index=True)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)
    difficulty = Column(String(20), default="Medium")  # Easy, Medium, Hard
    # Spaced repetition metrics (SuperMemo SM-2 inspired)
    interval_days = Column(Integer, default=1)
    repetition = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5)
    last_reviewed = Column(DateTime, nullable=True)
    next_review = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    deck = relationship("FlashcardDeck", back_populates="cards")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), index=True)
    subject = Column(String(100), index=True)
    topic = Column(String(100), index=True)
    difficulty = Column(String(20), default="Intermediate")
    time_limit_seconds = Column(Integer, default=300)
    total_questions = Column(Integer, default=5)
    is_adaptive = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(30), default="mcq")  # mcq, true_false, fill_blank, code_output, debugging
    options = Column(JSON, nullable=True)  # List of string options
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    misconception = Column(Text, nullable=True)  # "Why was I wrong" analysis
    concept = Column(String(100), nullable=True)
    code_snippet = Column(Text, nullable=True)
    difficulty = Column(String(20), default="Medium")

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), index=True)
    score = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    time_taken_seconds = Column(Integer, default=0)
    answers_summary = Column(JSON, nullable=True)  # Detailed question-by-question response
    ai_recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")


class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), index=True)
    slug = Column(String(150), unique=True, index=True)
    category = Column(String(50), default="Arrays")  # Loops, Recursion, OOP, etc.
    difficulty = Column(String(20), default="Easy")  # Easy, Medium, Hard
    description = Column(Text, nullable=False)
    examples = Column(JSON, nullable=True)
    test_cases = Column(JSON, nullable=False)  # List of {input: str, expected: str, is_hidden: bool}
    boilerplates = Column(JSON, nullable=False)  # { "python": str, "javascript": str, "c": str, "cpp": str, "java": str }
    hints = Column(JSON, nullable=True)  # List of progressive hints
    solution = Column(JSON, nullable=True)  # Solutions in various languages
    xp_reward = Column(Integer, default=30)

    submissions = relationship("CodeSubmission", back_populates="problem", cascade="all, delete-orphan")


class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    problem_id = Column(Integer, ForeignKey("coding_problems.id"), index=True)
    language = Column(String(20), default="python")
    code = Column(Text, nullable=False)
    status = Column(String(30), default="Accepted")  # Accepted, Wrong Answer, Runtime Error, Timeout
    passed_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    runtime_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="submissions")
    problem = relationship("CodingProblem", back_populates="submissions")


class LearningGameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    game_type = Column(String(50), index=True)  # code_rush, bug_hunter, output_predictor, memory_match, etc.
    score = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    level_reached = Column(Integer, default=1)
    details = Column(JSON, nullable=True)
    played_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="game_sessions")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String(200), default="Untitled Note")
    content = Column(Text, default="")
    folder = Column(String(50), default="General")
    tags = Column(JSON, default=list)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notes")


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String(150), default="Exam Preparation")
    subject = Column(String(100), default="Computer Science")
    exam_date = Column(String(30), nullable=True)
    days_remaining = Column(Integer, default=30)
    daily_hours = Column(Float, default=2.0)
    current_level = Column(String(20), default="Beginner")
    schedule_data = Column(JSON, nullable=False)  # List of daily tasks with completion state
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="study_plans")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="Award")
    xp_reward = Column(Integer, default=50)
    category = Column(String(50), default="General")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    achievement_code = Column(String(50), index=True)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="achievements")


class DailyActivity(Base):
    __tablename__ = "daily_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    date = Column(String(20), index=True)  # YYYY-MM-DD
    minutes_spent = Column(Integer, default=0)
    questions_completed = Column(Integer, default=0)
    xp_gained = Column(Integer, default=0)
    cards_reviewed = Column(Integer, default=0)
    games_played = Column(Integer, default=0)
