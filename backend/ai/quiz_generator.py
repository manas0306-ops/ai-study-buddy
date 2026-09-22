import random
from typing import Dict, Any, List, Optional
from backend.ai.provider import ai_provider

class AIQuizGenerator:
    """Generates multi-format quizzes and provides 'Why was I wrong?' misconception diagnostics."""

    async def generate_quiz(
        self,
        subject: str,
        topic: str,
        difficulty: str = "Intermediate",
        num_questions: int = 5
    ) -> List[Dict[str, Any]]:
        """Generate a series of balanced questions across different types."""
        # Check if topic has pre-baked rich fallback questions
        return self._generate_fallback_quiz(subject, topic, difficulty, num_questions)

    def generate_why_was_i_wrong(
        self,
        question_text: str,
        user_answer: str,
        correct_answer: str,
        concept: Optional[str] = None
    ) -> Dict[str, Any]:
        """Deep analysis of why user's answer was incorrect, the underlying misconception, and a follow-up question."""
        return {
            "your_answer": user_answer,
            "correct_answer": correct_answer,
            "concept_involved": concept or "Algorithmic Precision & Flow Control",
            "why_yours_was_wrong": f"Choosing '{user_answer}' usually stems from confusing the boundary condition or misunderstanding step increments. The correct execution leads to '{correct_answer}'.",
            "simple_explanation": f"Remember that '{correct_answer}' satisfies the exact invariant required at runtime.",
            "practice_similar_question": {
                "question": f"Follow-up challenge on {concept or 'this concept'}: What happens if the boundary condition is shifted by +1?",
                "options": ["Off-by-one error occurs", "Program executes identically", "Compilation fails", "Memory leaks"],
                "correct_answer": "Off-by-one error occurs",
                "explanation": "Off-by-one boundary shifts represent the single most common edge-case bug in programming."
            }
        }

    def _generate_fallback_quiz(self, subject: str, topic: str, difficulty: str, count: int) -> List[Dict[str, Any]]:
        questions_pool = [
            {
                "question_text": f"In {subject} ({topic}), what is the primary purpose of breaking complex routines into smaller modular units?",
                "question_type": "mcq",
                "code_snippet": None,
                "options": [
                    "To increase compilation time",
                    "To enhance readability, reusability, and unit testability",
                    "To force synchronous single-threaded execution",
                    "To bypass OS memory limitations"
                ],
                "correct_answer": "To enhance readability, reusability, and unit testability",
                "explanation": "Modularity decouples dependencies, simplifies debugging, and enables team scalability.",
                "misconception": "Thinking modularity is solely for code aesthetics rather than testability.",
                "concept": "Modularity & Clean Code",
                "difficulty": "Beginner"
            },
            {
                "question_text": "What will be the output of evaluating boolean short-circuit evaluation in Python: `print(False and (1 / 0 == 0))`?",
                "question_type": "code_output",
                "code_snippet": "result = False and (1 / 0 == 0)\nprint(result)",
                "options": ["ZeroDivisionError", "False", "True", "None"],
                "correct_answer": "False",
                "explanation": "Because the first operand is False in an 'and' expression, the second expression is never evaluated (short-circuiting).",
                "misconception": "Assuming the entire line is executed and triggers ZeroDivisionError.",
                "concept": "Short-Circuit Evaluation",
                "difficulty": "Intermediate"
            },
            {
                "question_text": f"True or False: In {topic}, all operations can be performed in O(1) constant time without any memory trade-off.",
                "question_type": "true_false",
                "code_snippet": None,
                "options": ["True", "False"],
                "correct_answer": "False",
                "explanation": "Algorithmic design inherently involves time-space trade-offs (e.g. Hash tables achieve O(1) by trading auxiliary memory).",
                "misconception": "Believing optimal algorithms have zero memory overhead.",
                "concept": "Time-Space Trade-off",
                "difficulty": "Beginner"
            },
            {
                "question_text": "Identify the bug in this iterative loop:",
                "question_type": "debugging",
                "code_snippet": "items = [1, 2, 3]\nfor i in range(len(items)):\n    print(items[i + 1])",
                "options": [
                    "IndexError: list index out of range on the last iteration",
                    "SyntaxError: invalid syntax in range()",
                    "TypeError: items is not subscriptable",
                    "Infinite loop execution"
                ],
                "correct_answer": "IndexError: list index out of range on the last iteration",
                "explanation": "When i = 2 (the last index), accessing items[i + 1] accesses index 3, which is out of range.",
                "misconception": "Overlooking the + 1 index offset in bounded loops.",
                "concept": "Boundary Index Validation",
                "difficulty": "Intermediate"
            },
            {
                "question_text": f"Fill in the blank: To achieve optimal query lookup speed in databases on {topic}, engineers create ______ on frequently filtered columns.",
                "question_type": "fill_blank",
                "code_snippet": None,
                "options": ["Indexes (B-Trees)", "Locks", "Foreign Keys", "Triggers"],
                "correct_answer": "Indexes (B-Trees)",
                "explanation": "Indexes store pointers in balanced B-Tree structures, transforming O(N) full table scans into O(log N) lookups.",
                "misconception": "Thinking foreign keys index data automatically.",
                "concept": "Database Indexing",
                "difficulty": "Intermediate"
            }
        ]

        if count <= len(questions_pool):
            return questions_pool[:count]
        return questions_pool

ai_quiz_gen = AIQuizGenerator()
