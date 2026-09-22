from typing import Dict, Any
from backend.ai.explainer import ai_explainer
from backend.ai.flashcard_generator import ai_flashcard_gen
from backend.ai.quiz_generator import ai_quiz_gen

class AIStudyPackGenerator:
    """Creates a full 360-degree study pack in one click."""

    async def generate_study_pack(
        self,
        topic: str,
        subject: str = "Computer Science",
        difficulty: str = "Intermediate",
        language: str = "English"
    ) -> Dict[str, Any]:
        """Orchestrates all AI modules to build an all-in-one cohesive learning bundle."""
        explanation = await ai_explainer.explain_topic(topic, difficulty, language)
        flashcards = await ai_flashcard_gen.generate_deck(topic, subject, difficulty, count=5)
        quiz = await ai_quiz_gen.generate_quiz(subject, topic, difficulty, num_questions=5)

        return {
            "topic": topic,
            "subject": subject,
            "difficulty": difficulty,
            "explanation": explanation,
            "flashcards": flashcards,
            "quiz": quiz,
            "coding_problems": [
                {
                    "title": f"Implement {topic} Core Algorithm",
                    "difficulty": difficulty,
                    "prompt": f"Write an efficient, cleanly structured implementation demonstrating {topic}.",
                    "expected_complexity": "O(N) time, O(1) space"
                }
            ],
            "game_challenge": {
                "recommended_game": "Code Rush",
                "challenge_mode": "Rapid Concept Recall",
                "target_score": 300,
                "xp_reward": 50
            },
            "quick_revision": {
                "time_minutes": 15,
                "checklist": [
                    f"Read 1-line definition of {topic}",
                    "Flip through 5 flashcards",
                    "Complete 5 quiz questions",
                    "Solve 1 coding challenge"
                ]
            }
        }

ai_study_pack_gen = AIStudyPackGenerator()
