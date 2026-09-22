# AI Architecture & Provider Strategy — AI Study Buddy

## Multi-Provider Abstraction

AI Study Buddy does not hardcode any single AI provider. Instead, it utilizes an extensible provider abstraction in `backend/ai/provider.py`:

```
               [ AI Request ]
                     │
                     ▼
          [ AIProvider Interface ]
                     │
     ┌───────────────┼───────────────┬────────────────┐
     ▼               ▼               ▼                ▼
[Google Gemini]  [OpenAI GPT]  [Anthropic Claude]  [Built-in Offline Engine]
```

### Auto-Detection & Priority
1. **Gemini**: Used if `GEMINI_API_KEY` is present.
2. **OpenAI**: Used if `OPENAI_API_KEY` is present.
3. **Claude**: Used if `ANTHROPIC_API_KEY` is present.
4. **Built-in Offline Engine**: Zero-configuration default if no keys are provided!

## 6 Dedicated Tutoring Modes
1. **Beginner**: Relatable real-world analogies, no intimidating jargon.
2. **Exam Mode**: Structured bullet-points, definitions, and formulas designed for maximum marks.
3. **Deep Dive**: Low-level memory layouts, hardware caches, call-stack mechanics, and asymptotic Big-O.
4. **Interview Mode**: Simulates senior tech company interviewer probing algorithmic trade-offs.
5. **Socratic Mode**: Does not reveal direct answers immediately; asks guiding questions.
6. **Bilingual Hindi / Hinglish**: English technical concepts paired with conversational Hinglish explanations.

## "Why Was I Wrong?" Misconception Analyzer
When an incorrect answer is selected during a quiz:
- Compares user selection against correct invariant.
- Pinpoints the exact misconception (e.g., confusing 0-indexed ranges, off-by-one shifts).
- Dynamically generates a follow-up practice problem targeting the same conceptual flaw.
