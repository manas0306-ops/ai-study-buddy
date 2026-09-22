from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, LearningGameSession
from backend.services.gamification import gamification_service

router = APIRouter(prefix="/api/games", tags=["Games"])

class SubmitGameSessionRequest(BaseModel):
    user_id: Optional[int] = 1
    game_type: str
    score: int
    accuracy: float = 100.0
    level_reached: int = 1
    details: Optional[Dict[str, Any]] = None

@router.get("")
def list_games():
    """List all 10 interactive learning games with descriptions, icons, and XP rules."""
    return [
        {
            "id": "code_rush",
            "name": "Code Rush",
            "tagline": "Speed trivia against the ticking clock",
            "icon": "Zap",
            "category": "Speed & Reflexes",
            "color": "amber",
            "difficulty": "All Levels",
            "description": "Solve rapid-fire programming syntax and conceptual questions before time runs out. Multipliers multiply with consecutive streaks!"
        },
        {
            "id": "bug_hunter",
            "name": "Bug Hunter",
            "tagline": "Spot syntax and logical bugs fast",
            "icon": "Bug",
            "category": "Debugging",
            "color": "rose",
            "difficulty": "Beginner to Intermediate",
            "description": "Examine code snippets with hidden syntax bugs, off-by-one errors, or incorrect operators. Pinpoint the bug to exterminate it!"
        },
        {
            "id": "output_predictor",
            "name": "Output Predictor",
            "tagline": "Mentally execute code snippets",
            "icon": "Terminal",
            "category": "Logic & Evaluation",
            "color": "emerald",
            "difficulty": "Intermediate",
            "description": "Evaluate code blocks line-by-line mentally and predict the exact console output before running."
        },
        {
            "id": "memory_match",
            "name": "Memory Match",
            "tagline": "Card flip matching game",
            "icon": "Grid",
            "category": "Active Recall",
            "color": "indigo",
            "difficulty": "Beginner",
            "description": "Flip and pair concepts with their corresponding definitions. Complete the board in minimal flips!"
        },
        {
            "id": "flashcard_battle",
            "name": "Flashcard Battle",
            "tagline": "Rapid gauntlet with score multipliers",
            "icon": "Swords",
            "category": "Retention",
            "color": "purple",
            "difficulty": "Intermediate",
            "description": "Fast-paced flashcard review. Correct streaks activate x2, x3, and x4 multipliers. One error resets the combo!"
        },
        {
            "id": "algorithm_maze",
            "name": "Algorithm Maze",
            "tagline": "Navigate the dungeon using CS logic",
            "icon": "Compass",
            "category": "Adventure & Algorithms",
            "color": "cyan",
            "difficulty": "Intermediate to Advanced",
            "description": "Explore an 8x8 dungeon grid. Each door is locked behind an algorithm puzzle. Correct answers open doors; mistakes cost energy!"
        },
        {
            "id": "typing_code",
            "name": "Typing Code",
            "tagline": "Syntax muscle memory and WPM speed test",
            "icon": "Keyboard",
            "category": "Speed & Accuracy",
            "color": "teal",
            "difficulty": "All Levels",
            "description": "Type real-world code snippets with proper brackets, indentation, and semicolons. Measure your WPM and syntax accuracy."
        },
        {
            "id": "binary_battle",
            "name": "Binary Battle",
            "tagline": "Number systems speed conversion",
            "icon": "Binary",
            "category": "Computer Architecture",
            "color": "blue",
            "difficulty": "Intermediate",
            "description": "Convert binary, hexadecimal, octal, and decimal numbers against an accelerating countdown timer."
        },
        {
            "id": "sql_detective",
            "name": "SQL Detective",
            "tagline": "Solve a mystery using SQL database queries",
            "icon": "Search",
            "category": "Databases & SQL",
            "color": "orange",
            "difficulty": "Intermediate",
            "description": "A crime occurred at Silicon Manor! Query tables of suspects, alibis, rooms, and timestamps to uncover who committed the crime."
        },
        {
            "id": "ai_quiz_boss",
            "name": "AI Quiz Boss",
            "tagline": "RPG boss fight against the AI Overlord",
            "icon": "Crown",
            "category": "Boss Raid",
            "color": "red",
            "difficulty": "Hard",
            "description": "Fight the AI Quiz Boss with 500 HP! Each correct answer deals critical damage; wrong answers damage your shields. Defeat the boss to earn the Boss Slayer badge!"
        }
    ]

@router.get("/{game_type}/content")
def get_game_content(game_type: str):
    """Serve dynamic challenge datasets for each of the 10 games."""
    gt = game_type.lower()
    
    if gt == "code_rush":
        return {
            "questions": [
                {"q": "What keyword defines a function in Python?", "options": ["func", "def", "function", "fn"], "a": "def"},
                {"q": "Which data structure follows LIFO (Last In First Out)?", "options": ["Queue", "Stack", "Array", "Linked List"], "a": "Stack"},
                {"q": "What does CSS stand for?", "options": ["Cascading Style Sheets", "Computer Style Syntax", "Creative Styling Sheet", "Colored Style Selector"], "a": "Cascading Style Sheets"},
                {"q": "Which complexity is faster: O(N) or O(log N)?", "options": ["O(N)", "O(log N)", "They are identical", "Depends on RAM"], "a": "O(log N)"},
                {"q": "In Python, which function finds the length of an iterable?", "options": ["length()", "size()", "count()", "len()"], "a": "len()"}
            ]
        }
    elif gt == "bug_hunter":
        return {
            "scenarios": [
                {
                    "id": 1,
                    "language": "python",
                    "code": "for i in range(5)\n    print(i)",
                    "bug": "Missing colon `:` at the end of the `for` loop line.",
                    "options": ["Missing colon `:`", "range() should be range[5]", "print needs brackets []", "Indentation is invalid"],
                    "correct": "Missing colon `:`"
                },
                {
                    "id": 2,
                    "language": "python",
                    "code": "total = 0\nfor x in [10, 20, 30]:\n    total == total + x\nprint(total)",
                    "bug": "Using equality check `==` instead of assignment `=` when updating total.",
                    "options": ["List syntax invalid", "Equality `==` used instead of assignment `=`", "total must be a float", "for loop syntax wrong"],
                    "correct": "Equality `==` used instead of assignment `=`"
                },
                {
                    "id": 3,
                    "language": "javascript",
                    "code": "const items = ['apple', 'banana'];\nitems = ['orange'];",
                    "bug": "Attempting to reassign a `const` variable.",
                    "options": ["Array items must be numbers", "Reassigning a `const` identifier", "Missing semicolon", "Invalid quotes"],
                    "correct": "Reassigning a `const` identifier"
                }
            ]
        }
    elif gt == "output_predictor":
        return {
            "challenges": [
                {
                    "code": "x = 5\nx += 2 * 3\nprint(x)",
                    "options": ["21", "11", "10", "16"],
                    "correct": "11",
                    "explanation": "Multiplication has higher operator precedence than addition: 2 * 3 = 6, then 5 + 6 = 11."
                },
                {
                    "code": "nums = [1, 2, 3]\nnums.append([4, 5])\nprint(len(nums))",
                    "options": ["5", "4", "3", "Error"],
                    "correct": "4",
                    "explanation": "append() adds the entire sublist as a single element at index 3, making len(nums) == 4."
                },
                {
                    "code": "a = [1, 2]\nb = a\nb.append(3)\nprint(a)",
                    "options": ["[1, 2]", "[1, 2, 3]", "[3]", "None"],
                    "correct": "[1, 2, 3]",
                    "explanation": "b references the exact same list object in memory as a. Modifying b alters a."
                }
            ]
        }
    elif gt == "memory_match":
        return {
            "pairs": [
                {"id": 1, "concept": "Recursion", "definition": "A function that calls itself"},
                {"id": 2, "concept": "Pointer", "definition": "Stores memory address of another variable"},
                {"id": 3, "concept": "Queue", "definition": "First In First Out (FIFO) structure"},
                {"id": 4, "concept": "Binary Search", "definition": "O(log N) search on sorted data"},
                {"id": 5, "concept": "Polymorphism", "definition": "Ability to take on multiple forms in OOP"},
                {"id": 6, "concept": "Hash Collision", "definition": "Two keys mapping to the same bucket"}
            ]
        }
    elif gt == "sql_detective":
        return {
            "mystery": {
                "case_title": "The Heist at Silicon Manor",
                "briefing": "A prototype quantum chip was stolen during the tech gala at 21:00. Use SQL queries to cross-reference suspect alibis and access logs.",
                "tables": {
                    "suspects": [
                        {"id": 1, "name": "Dr. Aris", "role": "Lead Architect", "badge_color": "Blue"},
                        {"id": 2, "name": "Elena Vance", "role": "Head of Security", "badge_color": "Red"},
                        {"id": 3, "name": "Marcus Kane", "role": "Visiting Investor", "badge_color": "Gold"},
                        {"id": 4, "name": "Sarah Chen", "role": "Junior Researcher", "badge_color": "Green"}
                    ],
                    "access_logs": [
                        {"log_id": 101, "suspect_id": 1, "room": "Server Room", "time": "20:15"},
                        {"log_id": 102, "suspect_id": 3, "room": "Vault", "time": "20:58"},
                        {"log_id": 103, "suspect_id": 2, "room": "Control Room", "time": "21:05"},
                        {"log_id": 104, "suspect_id": 4, "room": "Library", "time": "20:50"}
                    ]
                },
                "solution_suspect": "Marcus Kane",
                "clue": "Query access_logs where room = 'Vault' between 20:50 and 21:10!"
            }
        }
    elif gt == "ai_quiz_boss":
        return {
            "boss": {
                "name": "Neural Overlord Alpha",
                "title": "Grand Architect of Infinite Loops",
                "max_hp": 500,
                "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=bossalpha",
                "player_max_hp": 100,
                "questions": [
                    {
                        "question": "What is the amortized insertion time complexity of an element into a dynamic array (like Python list or C++ std::vector)?",
                        "options": ["O(N)", "O(1)", "O(log N)", "O(N^2)"],
                        "answer": "O(1)",
                        "damage": 125,
                        "boss_attack": "Memory Thrash"
                    },
                    {
                        "question": "Which sorting algorithm is guaranteed to be stable and has worst-case O(N log N) time complexity?",
                        "options": ["QuickSort", "MergeSort", "HeapSort", "SelectionSort"],
                        "answer": "MergeSort",
                        "damage": 125,
                        "boss_attack": "Recursive Barrage"
                    },
                    {
                        "question": "In operating systems, which of the following is NOT one of the 4 Coffman conditions required for Deadlock?",
                        "options": ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
                        "answer": "Preemption Allowed",
                        "damage": 125,
                        "boss_attack": "Deadlock Stun"
                    },
                    {
                        "question": "In relational databases, which normal form eliminates transitive functional dependencies?",
                        "options": ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd (BCNF)"],
                        "answer": "Third Normal Form (3NF)",
                        "damage": 125,
                        "boss_attack": "Schema Collapse"
                    }
                ]
            }
        }
    else:
        # Default generic game packet
        return {
            "game_type": gt,
            "status": "ready",
            "message": "Game engine loaded successfully."
        }

@router.post("/submit")
def submit_game_session(req: SubmitGameSessionRequest, db: Session = Depends(get_db)):
    """Record game session, award XP, update level, and unlock game-specific badges."""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        user = db.query(User).first()

    # Calculate XP reward based on game score
    base_xp = 30
    score_bonus = min(70, req.score // 10) if req.score else 0
    total_xp = base_xp + score_bonus

    gamification_res = gamification_service.award_xp(db, user, "game_win", custom_xp=total_xp)

    # Save session
    session = LearningGameSession(
        user_id=user.id,
        game_type=req.game_type,
        score=req.score,
        xp_earned=total_xp,
        accuracy=req.accuracy,
        level_reached=req.level_reached,
        details=req.details
    )
    db.add(session)
    db.commit()

    return {
        "game_type": req.game_type,
        "score": req.score,
        "xp_earned": total_xp,
        "total_xp": user.xp,
        "level": user.level,
        "leveled_up": gamification_res["leveled_up"],
        "unlocked_achievements": gamification_res["newly_unlocked_achievements"]
    }
