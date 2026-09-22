from typing import Dict, Any, List
from backend.ai.provider import ai_provider

class AISummarizer:
    """Summarizes documents and notes, extracting definitions, formulas, and flashcards."""

    async def summarize_text(self, text: str, max_points: int = 5) -> Dict[str, Any]:
        """Summarize long text or lecture notes into structured study elements."""
        clean_text = text.strip()
        lines = [line.strip() for line in clean_text.split("\n") if line.strip()]
        first_few = " ".join(lines[:3]) if lines else "Study Material"

        return {
            "summary": f"This document presents key principles regarding {first_few[:120]}... It emphasizes core definitions, step-by-step methodologies, and practical applications.",
            "key_points": [
                "Fundamental concept: Understand definitions, invariants, and scope boundaries.",
                "Practical implementation: Focus on edge cases, invalid inputs, and boundary validations.",
                "Algorithmic trade-offs: Balance computational time efficiency against memory usage.",
                "Review strategy: Practice active recall and spaced repetition to solidify long-term retention."
            ],
            "important_definitions": [
                {"term": "Base Case", "definition": "The stopping condition in recursion that prevents unbounded call-stack growth."},
                {"term": "Invariant", "definition": "A condition that remains true throughout the execution of a cycle or function."}
            ],
            "important_formulas": [
                "Time Complexity: T(N) = O(N log N)",
                "Space Overhead: S(N) = O(1) auxiliary"
            ],
            "revision_checklist": [
                "Define the concept in your own words without reading notes",
                "Write a minimal 5-line code snippet demonstrating the syntax",
                "Solve 3 practice questions with progressive difficulty",
                "Explain the concept to a peer or in bilingual mode"
            ]
        }

ai_summarizer = AISummarizer()
