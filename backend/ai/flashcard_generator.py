from typing import Dict, Any, List
from backend.ai.provider import ai_provider

class AIFlashcardGenerator:
    """Generates balanced, bite-sized spaced-repetition flashcard decks."""

    async def generate_deck(
        self,
        topic: str,
        subject: str = "General",
        difficulty: str = "Intermediate",
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """Generate a series of high-impact flashcards."""
        return self._generate_fallback_deck(topic, subject, difficulty, count)

    def _generate_fallback_deck(self, topic: str, subject: str, difficulty: str, count: int) -> List[Dict[str, Any]]:
        t_lower = topic.lower()
        
        if "sql" in t_lower or "dbms" in t_lower:
            cards = [
                {"front": "What does ACID stand for in databases?", "back": "Atomicity, Consistency, Isolation, Durability.", "hint": "4 properties guaranteeing reliable transaction processing.", "difficulty": "Medium"},
                {"front": "What is the difference between WHERE and HAVING in SQL?", "back": "WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY.", "hint": "Row filter vs Aggregate filter.", "difficulty": "Medium"},
                {"front": "What is Database Normalization?", "back": "The process of organizing data into multiple related tables to minimize data redundancy and eliminate anomalies.", "hint": "1NF, 2NF, 3NF, BCNF.", "difficulty": "Easy"},
                {"front": "What is an Index and what is its trade-off?", "back": "An index speeds up SELECT query lookups (O(log N)) but slows down INSERT/UPDATE/DELETE operations due to index tree rebalancing.", "hint": "Read speed vs Write overhead.", "difficulty": "Hard"},
                {"front": "What is a Foreign Key?", "back": "A column or set of columns in one table that references the Primary Key of another table, ensuring referential integrity.", "hint": "Enforces relationship consistency.", "difficulty": "Easy"}
            ]
        elif "oop" in t_lower:
            cards = [
                {"front": "Name the 4 Pillars of Object-Oriented Programming.", "back": "Encapsulation, Abstraction, Inheritance, and Polymorphism.", "hint": "A-P-I-E acronym.", "difficulty": "Easy"},
                {"front": "What is Encapsulation?", "back": "Bundling data (attributes) and methods that operate on that data into a single unit (class), and restricting direct access to internal state.", "hint": "Data hiding using private/protected fields.", "difficulty": "Medium"},
                {"front": "What is Polymorphism?", "back": "The ability of different classes to respond to the same method call in their own specific way (Compile-time overloading & Runtime overriding).", "hint": "'Many forms'.", "difficulty": "Medium"},
                {"front": "What is the difference between Abstract Class and Interface?", "back": "An abstract class can provide default method implementations and state; an interface strictly defines a contract without implementation (in classical OOP).", "hint": "Partial blueprint vs pure contract.", "difficulty": "Hard"}
            ]
        else:
            cards = [
                {"front": f"What is the fundamental goal of {topic}?", "back": f"{topic} enables developers to write predictable, maintainable, and scalable computer software.", "hint": "Think about code reliability.", "difficulty": "Easy"},
                {"front": f"What is a common edge case encountered in {topic}?", "back": "Null inputs, boundary limit overflows, off-by-one errors, and unexpected type mismatches.", "hint": "Inspect boundary conditions.", "difficulty": "Medium"},
                {"front": f"How do you optimize memory consumption in {topic}?", "back": "By using memory-efficient data representations, releasing unused references, and avoiding redundant copies.", "hint": "Profile heap vs stack.", "difficulty": "Hard"},
                {"front": f"What is the time complexity trade-off in {topic}?", "back": "Algorithms often trade space (caching/memoization) for decreased compute time.", "hint": "Time vs Space complexity.", "difficulty": "Medium"},
                {"front": f"What is an essential best practice when implementing {topic}?", "back": "Write thorough automated unit tests, handle all exceptions gracefully, and document design decisions.", "hint": "Quality & reliability.", "difficulty": "Easy"}
            ]

        return cards[:count] if count <= len(cards) else cards

ai_flashcard_gen = AIFlashcardGenerator()
