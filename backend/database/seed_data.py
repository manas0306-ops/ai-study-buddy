import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from backend.database.models import (
    User, Subject, Topic, FlashcardDeck, Flashcard, Quiz, Question,
    CodingProblem, Achievement, UserAchievement, DailyActivity, StudyPlan, Note
)

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(Subject).first():
        return

    # 1. Create Default User
    user = User(
        username="learner",
        email="student@studybuddy.ai",
        full_name="Alex Johnson",
        avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=studybuddy",
        xp=1240,
        level=4,
        streak_days=7,
        last_active_date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        preferred_language="English",
        preferred_difficulty="Intermediate",
        daily_goal_questions=20,
        daily_goal_minutes=45,
        learning_style="Interactive & Practical"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Seed Subjects and Topics
    subjects_data = [
        {
            "name": "Python",
            "slug": "python",
            "category": "Programming",
            "description": "Learn the most popular and versatile programming language from syntax to advanced OOP.",
            "icon": "Code2",
            "color": "emerald",
            "topics": [
                ("Variables & Data Types", "variables-data-types", "Beginner", 15, 95),
                ("Conditions & Logic", "conditions-logic", "Beginner", 15, 88),
                ("Loops & Iteration", "loops-iteration", "Intermediate", 20, 62),
                ("Functions & Scope", "functions-scope", "Intermediate", 25, 75),
                ("Lists & Dictionaries", "lists-dictionaries", "Intermediate", 20, 68),
                ("Recursion", "recursion", "Advanced", 30, 54),
                ("Object Oriented Programming", "oop", "Advanced", 35, 45),
            ]
        },
        {
            "name": "Data Structures & Algorithms",
            "slug": "dsa",
            "category": "Computer Science",
            "description": "Master essential data structures and algorithms for technical interviews and problem solving.",
            "icon": "Binary",
            "color": "indigo",
            "topics": [
                ("Arrays & Strings", "arrays-strings", "Beginner", 25, 80),
                ("Linked Lists", "linked-lists", "Intermediate", 30, 65),
                ("Stacks & Queues", "stacks-queues", "Intermediate", 25, 70),
                ("Trees & Binary Search Trees", "trees-bst", "Advanced", 40, 50),
                ("Sorting & Searching", "sorting-searching", "Intermediate", 30, 78),
                ("Dynamic Programming", "dynamic-programming", "Advanced", 50, 35),
            ]
        },
        {
            "name": "C++",
            "slug": "cpp",
            "category": "Programming",
            "description": "High-performance systems programming, memory management, pointers, and STL.",
            "icon": "Cpu",
            "color": "blue",
            "topics": [
                ("C++ Syntax & Pointers", "cpp-pointers", "Intermediate", 25, 70),
                ("Memory Allocation & References", "memory-management", "Intermediate", 30, 60),
                ("Classes & Constructors", "classes-constructors", "Intermediate", 25, 72),
                ("STL Containers & Iterators", "stl-containers", "Advanced", 35, 58),
            ]
        },
        {
            "name": "Database Management (DBMS)",
            "slug": "dbms",
            "category": "Computer Science",
            "description": "Relational databases, SQL queries, normalization, transactions, and indexing.",
            "icon": "Database",
            "color": "amber",
            "topics": [
                ("SQL Fundamentals & SELECT", "sql-fundamentals", "Beginner", 20, 90),
                ("Joins & Aggregations", "joins-aggregations", "Intermediate", 25, 82),
                ("Normalization & ER Diagrams", "normalization", "Intermediate", 30, 64),
                ("Transactions & ACID Properties", "transactions-acid", "Advanced", 30, 70),
            ]
        },
        {
            "name": "Operating Systems",
            "slug": "operating-systems",
            "category": "Computer Science",
            "description": "Processes, threads, CPU scheduling, concurrency, deadlocks, and virtual memory.",
            "icon": "Layers",
            "color": "rose",
            "topics": [
                ("Processes & Threads", "processes-threads", "Intermediate", 25, 75),
                ("CPU Scheduling Algorithms", "cpu-scheduling", "Intermediate", 30, 80),
                ("Deadlocks & Synchronization", "deadlocks-concurrency", "Advanced", 35, 52),
                ("Virtual Memory & Paging", "virtual-memory", "Advanced", 35, 60),
            ]
        },
        {
            "name": "Mathematics for CS",
            "slug": "discrete-math",
            "category": "Mathematics",
            "description": "Discrete mathematics, logic, graph theory, combinatorics, and probability.",
            "icon": "Sigma",
            "color": "violet",
            "topics": [
                ("Propositional Logic & Proofs", "propositional-logic", "Beginner", 25, 85),
                ("Set Theory & Relations", "set-theory", "Beginner", 20, 90),
                ("Graph Theory & Trees", "graph-theory", "Intermediate", 35, 65),
                ("Combinatorics & Probability", "combinatorics", "Advanced", 30, 58),
            ]
        },
        {
            "name": "Tech & HR Interview Prep",
            "slug": "interview-prep",
            "category": "Career",
            "description": "Ace behavioral questions, technical interviews, resume building, and system design.",
            "icon": "Briefcase",
            "color": "teal",
            "topics": [
                ("Behavioral STAR Method", "star-method", "Beginner", 20, 92),
                ("Technical Coding Interview Framework", "coding-interview-tips", "Intermediate", 30, 78),
                ("Basic System Design Fundamentals", "system-design-basics", "Advanced", 40, 55),
            ]
        }
    ]

    for s_idx, s in enumerate(subjects_data):
        subject_obj = Subject(
            name=s["name"],
            slug=s["slug"],
            category=s["category"],
            description=s["description"],
            icon=s["icon"],
            color=s["color"],
            topics_count=len(s["topics"])
        )
        db.add(subject_obj)
        db.flush()

        for t_idx, (t_name, t_slug, t_diff, t_est, t_mast) in enumerate(s["topics"]):
            topic_obj = Topic(
                subject_id=subject_obj.id,
                name=t_name,
                slug=t_slug,
                description=f"Explore core concepts, best practices, and challenges in {t_name}.",
                difficulty=t_diff,
                estimated_minutes=t_est,
                mastery_percent=t_mast,
                order_index=t_idx + 1
            )
            db.add(topic_obj)

    db.commit()

    # 3. Seed Flashcard Decks & Cards
    deck1 = FlashcardDeck(
        user_id=user.id,
        title="Python Core Fundamentals",
        description="Must-know concepts including data types, mutable vs immutable, and slicing.",
        subject="Python",
        topic="Variables & Data Types",
        is_ai_generated=False,
        cards_count=5
    )
    db.add(deck1)
    db.flush()

    flashcards_python = [
        ("What is the difference between list and tuple in Python?", "Lists are mutable (can be changed in-place) defined with `[]`, whereas tuples are immutable defined with `()`. Tuples are hashable and faster.", "Think about whether you need to add/remove items later.", "Easy"),
        ("What is a pointer or reference in memory?", "A pointer or reference is a variable that stores the memory address of another variable rather than the actual value itself.", "It 'points' to where the value lives.", "Medium"),
        ("What is recursion in programming?", "Recursion is a programming technique where a function calls itself directly or indirectly to solve smaller sub-problems until a base condition is met.", "Requires a base case to terminate.", "Medium"),
        ("What is the purpose of `__init__` in Python classes?", "`__init__` is the constructor method in Python. It automatically initializes object attributes when a new class instance is created.", "Starts with and ends with double underscores.", "Easy"),
        ("What is the time complexity of searching an element in a Python dictionary?", "Average time complexity is O(1) constant time, because dictionaries are implemented using a Hash Table under the hood.", "Constant time hashing.", "Hard"),
    ]

    for front, back, hint, diff in flashcards_python:
        db.add(Flashcard(
            deck_id=deck1.id,
            front=front,
            back=back,
            hint=hint,
            difficulty=diff,
            interval_days=2,
            repetition=1,
            ease_factor=2.5,
            next_review=datetime.now(timezone.utc)
        ))

    deck2 = FlashcardDeck(
        user_id=user.id,
        title="Data Structures & Algorithms Essentials",
        description="Key terms, Big-O notations, and tree traversal algorithms.",
        subject="Data Structures & Algorithms",
        topic="Arrays & Strings",
        is_ai_generated=True,
        cards_count=4
    )
    db.add(deck2)
    db.flush()

    flashcards_dsa = [
        ("What is the time complexity of QuickSort in the worst case?", "O(N^2) worst case (when pivot is unbalanced, e.g., already sorted array), but O(N log N) on average.", "Occurs with poor pivot choice.", "Hard"),
        ("What is the difference between BFS and DFS?", "BFS (Breadth-First Search) explores neighbors layer by layer using a Queue (FIFO). DFS (Depth-First Search) explores as deep as possible along each branch using a Stack or recursion (LIFO).", "Level-order vs Branch-deep.", "Medium"),
        ("What is a Hash Collision and how is it resolved?", "A collision occurs when two different keys produce the same hash index. Resolved via Chaining (linked lists at bucket) or Open Addressing (linear/quadratic probing).", "Buckets or next slot probing.", "Medium"),
        ("What defines a Binary Search Tree (BST)?", "For every node, all values in its left subtree are strictly smaller, and all values in its right subtree are strictly greater.", "Left < Root < Right.", "Easy"),
    ]

    for front, back, hint, diff in flashcards_dsa:
        db.add(Flashcard(
            deck_id=deck2.id,
            front=front,
            back=back,
            hint=hint,
            difficulty=diff,
            interval_days=1,
            repetition=0,
            ease_factor=2.5,
            next_review=datetime.now(timezone.utc)
        ))

    # 4. Seed Quizzes & Questions
    quiz1 = Quiz(
        title="Python Mastery: Loops & Recursion Check",
        subject="Python",
        topic="Loops & Iteration",
        difficulty="Intermediate",
        time_limit_seconds=180,
        total_questions=5,
        is_adaptive=True
    )
    db.add(quiz1)
    db.flush()

    questions_quiz1 = [
        {
            "text": "What will be the output of the following Python code snippet?",
            "type": "code_output",
            "snippet": "for i in range(1, 6, 2):\n    print(i, end=' ')",
            "options": ["1 2 3 4 5", "1 3 5", "2 4 6", "1 3 5 7"],
            "answer": "1 3 5",
            "concept": "Range step parameter",
            "explanation": "range(start, stop, step) starts at 1, increments by 2 (1, 3, 5), and stops before reaching 6.",
            "misconception": "You might have assumed the 3rd argument is the count of items rather than the step increment.",
            "diff": "Beginner"
        },
        {
            "text": "Which condition is strictly mandatory to prevent an infinite loop in a recursive function?",
            "type": "mcq",
            "snippet": None,
            "options": ["A return type of integer", "A Base Case that stops further recursive calls", "A while loop inside the function", "A global counter variable"],
            "answer": "A Base Case that stops further recursive calls",
            "concept": "Recursion base case",
            "explanation": "Without a valid base case, recursive calls keep pushing frames onto the call stack until reaching maximum recursion depth.",
            "misconception": "Thinking recursive functions require iteration loops internally.",
            "diff": "Intermediate"
        },
        {
            "text": "Identify the bug in this Python code intended to count down from 5 to 1:",
            "type": "debugging",
            "snippet": "count = 5\nwhile count > 0:\n    print(count)\n    count += 1",
            "options": ["count += 1 causes an infinite loop because count increases instead of decreasing", "while count > 0 should be while count < 0", "print(count) must be indented further", "count cannot start at 5"],
            "answer": "count += 1 causes an infinite loop because count increases instead of decreasing",
            "concept": "Loop counter decrement",
            "explanation": "To count down, count must be decremented (`count -= 1`). Incrementing makes `count > 0` always True.",
            "misconception": "Overlooking the plus sign `+=` instead of `-=` in decrement loops.",
            "diff": "Beginner"
        },
        {
            "text": "In Python, a `break` statement inside a nested loop terminates:",
            "type": "mcq",
            "snippet": None,
            "options": ["All enclosing loops simultaneously", "Only the innermost loop containing the break statement", "The entire program execution", "The outer loop but continues the inner loop"],
            "answer": "Only the innermost loop containing the break statement",
            "concept": "Nested loop control flow",
            "explanation": "`break` terminates only the immediate enclosing loop. Outer loops continue their iteration.",
            "misconception": "Believing `break` breaks out of multiple nested levels at once.",
            "diff": "Intermediate"
        },
        {
            "text": "What is the time complexity of calculating Fibonacci using naive recursion without memoization: `fib(n) = fib(n-1) + fib(n-2)`?",
            "type": "mcq",
            "snippet": None,
            "options": ["O(N)", "O(N log N)", "O(2^N)", "O(N^2)"],
            "answer": "O(2^N)",
            "concept": "Recursive time complexity",
            "explanation": "Each call branches into two subcalls, generating a binary tree of calls with height N, leading to exponential O(2^N) time.",
            "misconception": "Confusing recursive tree branching with linear single-recursion O(N).",
            "diff": "Advanced"
        }
    ]

    for q in questions_quiz1:
        db.add(Question(
            quiz_id=quiz1.id,
            question_text=q["text"],
            question_type=q["type"],
            code_snippet=q.get("snippet"),
            options=q["options"],
            correct_answer=q["answer"],
            explanation=q["explanation"],
            misconception=q["misconception"],
            concept=q["concept"],
            difficulty=q["diff"]
        ))

    # 5. Seed Coding Problems
    problems_data = [
        {
            "title": "Reverse a String",
            "slug": "reverse-a-string",
            "category": "Strings",
            "difficulty": "Easy",
            "description": "Write a function `reverse_string(s)` that takes a string and returns it reversed.\n\n### Constraints:\n- String length: 0 <= len(s) <= 10,000",
            "examples": [
                {"input": "hello", "output": "olleh"},
                {"input": "StudyBuddy", "output": "ydduBydutS"}
            ],
            "test_cases": [
                {"input": "hello", "expected": "olleh", "is_hidden": False},
                {"input": "StudyBuddy", "expected": "ydduBydutS", "is_hidden": False},
                {"input": "a", "expected": "a", "is_hidden": True},
                {"input": "", "expected": "", "is_hidden": True}
            ],
            "boilerplates": {
                "python": "def reverse_string(s: str) -> str:\n    # Write your solution here\n    pass\n",
                "javascript": "function reverseString(s) {\n    // Write your solution here\n    return \"\";\n}\n",
                "cpp": "#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Write your solution here\n    return \"\";\n}\n",
                "java": "class Solution {\n    public static String reverseString(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
                "c": "#include <stdio.h>\n#include <string.h>\n\nchar* reverseString(char* s) {\n    // Write your solution here\n    return s;\n}\n"
            },
            "hints": [
                "Think about using slicing `[::-1]` in Python, or a two-pointer approach.",
                "In languages with mutable char arrays, swap characters from both ends moving inward."
            ],
            "solution": {
                "python": "def reverse_string(s: str) -> str:\n    return s[::-1]",
                "javascript": "function reverseString(s) {\n    return s.split('').reverse().join('');\n}"
            },
            "xp_reward": 20
        },
        {
            "title": "Two Sum",
            "slug": "two-sum",
            "category": "Arrays",
            "difficulty": "Easy",
            "description": "Given a list of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            "examples": [
                {"input": "nums = [2, 7, 11, 15], target = 9", "output": "[0, 1]"},
                {"input": "nums = [3, 2, 4], target = 6", "output": "[1, 2]"}
            ],
            "test_cases": [
                {"input": "[2, 7, 11, 15], 9", "expected": "[0, 1]", "is_hidden": False},
                {"input": "[3, 2, 4], 6", "expected": "[1, 2]", "is_hidden": False},
                {"input": "[3, 3], 6", "expected": "[0, 1]", "is_hidden": True}
            ],
            "boilerplates": {
                "python": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # Use a dictionary for O(N) lookup\n    pass\n",
                "javascript": "function twoSum(nums, target) {\n    // Write solution\n    return [];\n}\n",
                "cpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write solution\n    return {};\n}\n",
                "java": "import java.util.*;\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write solution\n        return new int[]{};\n    }\n}\n",
                "c": "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write solution\n    return 0;\n}\n"
            },
            "hints": [
                "A brute-force two-loop solution is O(N^2). Can you do better?",
                "Store elements in a hash map as you iterate: check if `target - num` is already in the map."
            ],
            "solution": {
                "python": "def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in lookup:\n            return [lookup[diff], i]\n        lookup[num] = i\n    return []",
                "javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}"
            },
            "xp_reward": 30
        },
        {
            "title": "Valid Parentheses",
            "slug": "valid-parentheses",
            "category": "Data Structures",
            "difficulty": "Medium",
            "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
            "examples": [
                {"input": "\"()[]{}\"", "output": "True"},
                {"input": "\"(]\"", "output": "False"}
            ],
            "test_cases": [
                {"input": "\"()[]{}\"", "expected": "True", "is_hidden": False},
                {"input": "\"(]\"", "expected": "False", "is_hidden": False},
                {"input": "\"([)]\"", "expected": "False", "is_hidden": True},
                {"input": "\"{[]}\"", "expected": "True", "is_hidden": True}
            ],
            "boilerplates": {
                "python": "def is_valid(s: str) -> bool:\n    # Utilize a Stack data structure\n    pass\n",
                "javascript": "function isValid(s) {\n    // Write solution\n    return false;\n}\n",
                "cpp": "#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write solution\n    return false;\n}\n",
                "java": "import java.util.Stack;\nclass Solution {\n    public static boolean isValid(String s) {\n        // Write solution\n        return false;\n    }\n}\n",
                "c": "#include <stdbool.h>\nbool isValid(char* s) {\n    // Write solution\n    return false;\n}\n"
            },
            "hints": [
                "Use a Stack (LIFO). Push opening brackets onto the stack.",
                "When encountering a closing bracket, check if the top of the stack matches its pair."
            ],
            "solution": {
                "python": "def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack"
            },
            "xp_reward": 40
        }
    ]

    for p in problems_data:
        db.add(CodingProblem(
            title=p["title"],
            slug=p["slug"],
            category=p["category"],
            difficulty=p["difficulty"],
            description=p["description"],
            examples=p["examples"],
            test_cases=p["test_cases"],
            boilerplates=p["boilerplates"],
            hints=p["hints"],
            solution=p["solution"],
            xp_reward=p["xp_reward"]
        ))

    # 6. Seed Achievements
    achievements_data = [
        ("first_quiz", "First Step", "Complete your first study quiz", "Award", 25, "Quizzes"),
        ("streak_7", "Unstoppable", "Maintain a 7-day study streak", "Flame", 50, "Streaks"),
        ("flashcards_50", "Memory Master", "Review 50 flashcards with spaced repetition", "Brain", 40, "Flashcards"),
        ("code_rush_champion", "Speed Demon", "Score 500+ XP in Code Rush", "Zap", 35, "Games"),
        ("bug_hunter", "Bug Exterminator", "Find 10 bugs in Bug Hunter game", "Bug", 35, "Games"),
        ("boss_slayer", "Boss Slayer", "Defeat the AI Quiz Boss in RPG mode", "Crown", 100, "Games"),
        ("coding_50", "Code Warrior", "Solve your first 5 coding lab problems", "Terminal", 50, "Coding"),
        ("master_accuracy", "Precision Specialist", "Achieve 100% accuracy on a quiz", "Target", 30, "Quizzes"),
        ("study_planner_exam", "Strategic Mind", "Create an exam preparation study plan", "Calendar", 20, "Planner"),
        ("bilingual_scholar", "Bilingual Scholar", "Learn a concept in Hindi/Hinglish mode", "Languages", 25, "AI Tutor"),
        ("document_scholar", "Knowledge Miner", "Upload a document and generate a study pack", "FileText", 30, "Documents"),
        ("polyglot_coder", "Polyglot", "Run code in 3 different programming languages", "Layers", 40, "Coding")
    ]

    for code, title, desc, icon, xp_rew, cat in achievements_data:
        ach = Achievement(
            code=code,
            title=title,
            description=desc,
            icon=icon,
            xp_reward=xp_rew,
            category=cat
        )
        db.add(ach)

    # Unlock a few achievements for Alex Johnson to make profile feel alive
    db.flush()
    unlocked = ["first_quiz", "streak_7", "bug_hunter"]
    for code in unlocked:
        db.add(UserAchievement(
            user_id=user.id,
            achievement_code=code,
            unlocked_at=datetime.now(timezone.utc) - timedelta(days=2)
        ))

    # 7. Seed Daily Activities (Last 7 days for heatmap & progress charts)
    for i in range(7):
        date_str = (datetime.now(timezone.utc) - timedelta(days=6 - i)).strftime("%Y-%m-%d")
        db.add(DailyActivity(
            user_id=user.id,
            date=date_str,
            minutes_spent=25 + (i * 7) % 35,
            questions_completed=8 + (i * 3) % 15,
            xp_gained=80 + (i * 25) % 120,
            cards_reviewed=10 + (i * 4) % 20,
            games_played=1 + (i % 3)
        ))

    # 8. Seed a Sample Study Plan
    sample_plan = [
        {"day": 1, "topic": "Variables & Basic Types", "hours": 1.5, "completed": True, "notes": "Learned immutable vs mutable"},
        {"day": 2, "topic": "Conditions & Flow Control", "hours": 2.0, "completed": True, "notes": "if-elif-else branching mastered"},
        {"day": 3, "topic": "While & For Loops", "hours": 2.0, "completed": True, "notes": "Practiced nested iterations"},
        {"day": 4, "topic": "Functions & Variable Scope", "hours": 1.5, "completed": False, "notes": "Today's priority"},
        {"day": 5, "topic": "Lists & Dict Comprehensions", "hours": 2.0, "completed": False, "notes": "Practice coding lab"},
        {"day": 6, "topic": "Recursion & Call Stack", "hours": 2.5, "completed": False, "notes": "Targeting weak area"},
        {"day": 7, "topic": "Mid-Term Mock Quiz & Review", "hours": 2.0, "completed": False, "notes": "Timed assessment"},
    ]
    db.add(StudyPlan(
        user_id=user.id,
        title="Python Developer in 30 Days",
        subject="Python",
        exam_date=(datetime.now(timezone.utc) + timedelta(days=23)).strftime("%Y-%m-%d"),
        days_remaining=23,
        daily_hours=2.0,
        current_level="Intermediate",
        schedule_data=sample_plan,
        is_active=True
    ))

    # 9. Seed Sample Note
    db.add(Note(
        user_id=user.id,
        title="Recursion Key Rules & Common Pitfalls",
        content="""# Recursion Essentials 🧠

## Three Laws of Recursion:
1. A recursive algorithm must have a **base case**.
2. A recursive algorithm must change its state and move toward the base case.
3. A recursive algorithm must call itself, recursively.

## Memory & Call Stack:
Every invocation adds a stack frame containing:
- Local variables
- Parameters
- Return address

## Python Tip:
Default recursion depth is 1,000. You can check it with:
```python
import sys
print(sys.getrecursionlimit())
```
""",
        folder="Computer Science",
        tags=["recursion", "algorithms", "python"],
        is_pinned=True
    ))

    db.commit()
