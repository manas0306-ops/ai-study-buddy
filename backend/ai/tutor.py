from typing import Dict, Any, List, Optional
from backend.ai.provider import ai_provider

class AITutor:
    """Dedicated AI Tutor supporting 6 specialized teaching modes."""

    SYSTEM_PROMPTS = {
        "beginner": (
            "You are a friendly, encouraging AI Study Buddy. Explain topics simply using everyday analogies, "
            "clear language, and zero intimidating jargon. Make learning feel welcoming and approachable."
        ),
        "exam": (
            "You are a strict, top-tier academic exam coach. Provide concise, high-scoring answers formatted with "
            "bullet points, definitions, formulas, and key points that examiners specifically award marks for."
        ),
        "deep_dive": (
            "You are a senior computer science architect and systems engineer. Dive deep into internal mechanics, "
            "memory layout, call stacks, time/space complexity, cache behaviors, and edge cases."
        ),
        "interview": (
            "You are a Senior Technical Interviewer at a top tech company. Ask thoughtful questions, evaluate time and "
            "space complexity, critique edge cases, and challenge the student on engineering trade-offs."
        ),
        "socratic": (
            "You are a Socratic tutor. Do NOT give the direct answer immediately. Instead, guide the student with "
            "thought-provoking questions, hints, and step-by-step prompts to help them discover the answer themselves."
        ),
        "bilingual": (
            "You are a bilingual (English + Hindi/Hinglish) educational mentor. Explain the concept in clear English "
            "accompanied by conversational Hinglish (Hindi written in Roman script) with intuitive relatable Indian analogies. "
            "Example format: \n"
            "**English:** A loop repeats a block of code.\n"
            "**Hinglish:** Loop ka use ek hi code ko baar-baar execute karne ke liye hota hai bina code dubara likhe."
        )
    }

    async def get_response(
        self,
        query: str,
        mode: str = "beginner",
        context: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Generate response tailored to the selected tutoring mode."""
        mode_key = mode.lower() if mode.lower() in self.SYSTEM_PROMPTS else "beginner"
        system_prompt = self.SYSTEM_PROMPTS[mode_key]
        
        prompt_with_context = ""
        if context:
            prompt_with_context += f"Current Study Topic/Context: {context}\n\n"
        prompt_with_context += f"Student Query: {query}"

        # If offline fallback is engaged, enrich with mode-specific template
        if ai_provider.get_active_provider_name() == "Built-in Study AI (Offline Fallback Engine)":
            return self._build_mode_response(query, mode_key, context)

        raw_response = await ai_provider.generate_text(prompt_with_context, system_prompt)
        return {
            "mode": mode_key,
            "response": raw_response,
            "provider": ai_provider.get_active_provider_name()
        }

    def _build_mode_response(self, query: str, mode: str, context: Optional[str] = None) -> Dict[str, Any]:
        q_lower = query.lower()
        topic = context or query

        if mode == "bilingual":
            if "recursion" in q_lower:
                content = (
                    "### 🌟 Bilingual Explanation / द्विभाषी समझ\n\n"
                    "**English:**\n"
                    "Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it into smaller sub-problems. It continues until it reaches a **base case**.\n\n"
                    "**Hinglish:**\n"
                    "Recursion ka matlab hai jab ek function apne aap ko hi baar-baar call karta hai jab tak ki ek target (Base Case) achieve na ho jaye. Socho jaise mirrors ke aamne-saamne khade hone par infinite reflections bante hain, par coding mein hum base case lagakar infinite loop ko rokte hain!\n\n"
                    "**Example Snippet:**\n"
                    "```python\n"
                    "def countdown(n):\n"
                    "    if n == 0:  # Base Case (Rukne ki shart)\n"
                    "        print('Boom!')\n"
                    "        return\n"
                    "    print(n)\n"
                    "    countdown(n - 1)  # Recursive call\n"
                    "```"
                )
            elif "pointer" in q_lower:
                content = (
                    "### 🌟 Bilingual Explanation / द्विभाषी समझ\n\n"
                    "**English:**\n"
                    "A pointer is a variable that stores the memory address of another variable rather than the actual direct value.\n\n"
                    "**Hinglish:**\n"
                    "Pointer ek aisi variable hoti hai jo kisi doosre variable ka ghar ka pata (memory address) store karti hai. Jaise tumhare paas kisi library book ka index number ho!\n\n"
                    "**Syntax Example:**\n"
                    "```cpp\n"
                    "int x = 10;\n"
                    "int* ptr = &x; // ptr stores address of x\n"
                    "```"
                )
            else:
                content = (
                    f"### 🌟 Bilingual Study Guide: {topic}\n\n"
                    "**English:**\n"
                    f"Understanding {topic} is key to writing clean and performant applications. "
                    "Break down the problem into input, logic processing, and expected output.\n\n"
                    "**Hinglish:**\n"
                    f"{topic} ko samajhna bahut zaroori hai. Isko practical examples ke saath step-by-step samjho aur code run karke dekho."
                )
        elif mode == "exam":
            content = (
                f"### 📝 Exam-Ready Sheet: {topic}\n\n"
                "**1. Standard Definition (2 Marks):**\n"
                f"A precise, formal description of {topic} defining its operational boundary and primary purpose.\n\n"
                "**2. Key Characteristics (3 Marks):**\n"
                "- **Deterministic Behavior:** Guarantees predictable output for given inputs.\n"
                "- **Termination Guarantee:** Must strictly avoid non-terminating edge conditions.\n"
                "- **Resource Bounds:** O(N) or O(1) space and time overhead considerations.\n\n"
                "**3. Standard Diagram / Syntax (2 Marks):**\n"
                "- Ensure proper initialization, termination checks, and return values.\n\n"
                "**4. Common Pitfall to Avoid:**\n"
                "Do not forget boundary conditions (e.g. empty inputs, null pointers, 0 or negative numbers)."
            )
        elif mode == "deep_dive":
            content = (
                f"### 🔬 Deep Dive & Systems Architecture: {topic}\n\n"
                "**Internal Mechanics & Memory Allocation:**\n"
                "- In modern execution engines, each invocation pushes stack frames (return address, register states, local scopes).\n"
                "- Excessive stack allocation can lead to Stack Overflow (SIGSEGV).\n\n"
                "**Complexity Profile:**\n"
                "- **Time Complexity:** Analyzed via Master Theorem or recurrence relations.\n"
                "- **Space Complexity:** Direct function of maximum stack depth or auxiliary heap allocation.\n\n"
                "**Hardware & Cache Considerations:**\n"
                "- Linear iterative traversals exhibit spatial locality and benefit from CPU L1/L2 prefetching, whereas scattered pointers suffer cache misses."
            )
        elif mode == "interview":
            content = (
                f"### 💼 Technical Interview Simulation: {topic}\n\n"
                "**Interviewer:** 'Let's discuss how you would design or implement this in a high-scale production system.'\n\n"
                "**Key Questions for You:**\n"
                "1. What is the time and space complexity of your primary approach?\n"
                "2. What happens if the input size exceeds available memory (streaming vs in-memory)?\n"
                "3. Can you optimize this to run in O(1) auxiliary space?\n\n"
                "**Tip:** Explain your thought process out loud, state your assumptions, and always discuss edge cases before coding!"
            )
        elif mode == "socratic":
            content = (
                f"### 🤔 Socratic Exploration: {topic}\n\n"
                "Before I reveal the solution, let's think about this together:\n\n"
                "1. If you had to solve this manually with pencil and paper for a tiny example, what is the very first step you would take?\n"
                "2. What is the simplest possible case (where the answer is obvious without doing any work)?\n"
                "3. How does the solution to a larger problem relate to the solution of that simpler case?\n\n"
                "*Reply with your thoughts, and we will build the answer together!*"
            )
        else: # beginner
            content = (
                f"### 💡 Friendly Beginner Guide: {topic}\n\n"
                f"Think of **{topic}** just like an everyday real-world activity!\n\n"
                "- **In plain words:** It is a structured way to get a job done efficiently.\n"
                "- **Why do we care:** It saves time and prevents repetitive, manual errors.\n"
                "- **Quick Takeaway:** Master the core pattern first, then test it on real examples."
            )

        return {
            "mode": mode,
            "response": content,
            "provider": "Built-in Study AI (Offline Fallback Engine)"
        }

ai_tutor = AITutor()
