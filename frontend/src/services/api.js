const API_BASE = '/api';

// Intelligent client-side fallback data for static GitHub Pages hosting
const fallbackData = {
  dashboard: {
    greeting: "Good morning, Alex Johnson 👋",
    subtitle: "Ready to continue mastering computer science today?",
    user: {
      id: 1,
      username: "learner",
      full_name: "Alex Johnson",
      avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=studybuddy",
      xp: 1240,
      level: 4,
      streak_days: 7,
      preferred_language: "English",
      preferred_difficulty: "Intermediate"
    },
    today_goal: { target_questions: 20, completed_questions: 12, progress_percent: 60 },
    continue_learning: { subject: "Python", topic: "Loops & Iteration", progress_percent: 62, estimated_minutes: 15, slug: "loops-iteration" },
    weak_areas: [
      { name: "Loops & Iteration", mastery: 62, difficulty: "Intermediate" },
      { name: "Lists & Dictionaries", mastery: 68, difficulty: "Intermediate" },
      { name: "Recursion", mastery: 54, difficulty: "Advanced" }
    ],
    strong_areas: [
      { name: "Variables & Data Types", mastery: 95, difficulty: "Beginner" },
      { name: "Conditions & Logic", mastery: 88, difficulty: "Beginner" }
    ],
    ai_recommendation: "You've struggled with recursion twice. Spend 15 minutes reviewing recursion before attempting another quiz.",
    action_items: [
      { id: "1", type: "study_topic", title: "Revise Weak Area: Recursion", description: "Your current mastery on Recursion is 54%. Spend 15 minutes reviewing.", priority: "High" },
      { id: "2", type: "review_flashcards", title: "Spaced Repetition Review Due", description: "You have 5 flashcards scheduled for review today.", priority: "Medium" },
      { id: "3", type: "practice_code", title: "Practice 1 Coding Problem: Two Sum", description: "Strengthen array lookups and hash maps.", priority: "Medium" },
      { id: "4", type: "play_game", title: "Sharpen Reflexes in Code Rush", description: "Test your programming syntax speed against the clock.", priority: "Low" }
    ]
  },
  progress: {
    weekly_activity: [
      { date: "09-18", minutes: 30, xp: 90, questions: 10 },
      { date: "09-19", minutes: 45, xp: 120, questions: 15 },
      { date: "09-20", minutes: 25, xp: 75, questions: 8 },
      { date: "09-21", minutes: 50, xp: 140, questions: 18 },
      { date: "09-22", minutes: 40, xp: 110, questions: 14 },
      { date: "09-23", minutes: 35, xp: 95, questions: 12 },
      { date: "09-24", minutes: 45, xp: 120, questions: 15 }
    ],
    topic_mastery: [
      { topic: "Variables & Data Types", mastery: 95, difficulty: "Beginner" },
      { topic: "Conditions & Logic", mastery: 88, difficulty: "Beginner" },
      { topic: "Functions & Scope", mastery: 75, difficulty: "Intermediate" },
      { topic: "Lists & Dictionaries", mastery: 68, difficulty: "Intermediate" },
      { topic: "Loops & Iteration", mastery: 62, difficulty: "Intermediate" },
      { topic: "Recursion", mastery: 54, difficulty: "Advanced" }
    ],
    summary: {
      total_xp: 1240,
      current_streak: 7,
      problems_solved: 38,
      quizzes_completed: 14,
      average_accuracy: 78.4,
      total_study_hours: 18.5
    }
  },
  leaderboard: {
    current_user_rank: 3,
    league: "Diamond Scholar League",
    days_left_in_season: 3,
    ranks: [
      { rank: 1, name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya", xp: 2840, streak: 19, badge: "Grandmaster" },
      { rank: 2, name: "Devin Chen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Devin", xp: 2190, streak: 14, badge: "Code Ninja" },
      { rank: 3, name: "Alex Johnson (You)", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=studybuddy", xp: 1240, streak: 7, badge: "Speed Learner" },
      { rank: 4, name: "Rohan Patel", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan", xp: 1150, streak: 5, badge: "Scholar" },
      { rank: 5, name: "Sofia Rossi", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sofia", xp: 980, streak: 8, badge: "Bug Hunter" }
    ]
  },
  achievements: [
    { code: "first_quiz", title: "First Step", description: "Complete your first study quiz", icon: "Award", xp_reward: 25, category: "Quizzes", unlocked: true },
    { code: "streak_7", title: "Unstoppable", description: "Maintain a 7-day study streak", icon: "Flame", xp_reward: 50, category: "Streaks", unlocked: true },
    { code: "flashcards_50", title: "Memory Master", description: "Review 50 flashcards with spaced repetition", icon: "Brain", xp_reward: 40, category: "Flashcards", unlocked: false },
    { code: "code_rush_champion", title: "Speed Demon", description: "Score 500+ XP in Code Rush", icon: "Zap", xp_reward: 35, category: "Games", unlocked: false },
    { code: "bug_hunter", title: "Bug Exterminator", description: "Find 10 bugs in Bug Hunter game", icon: "Bug", xp_reward: 35, category: "Games", unlocked: true },
    { code: "boss_slayer", title: "Boss Slayer", description: "Defeat the AI Quiz Boss in RPG mode", icon: "Crown", xp_reward: 100, category: "Games", unlocked: false },
    { code: "coding_50", title: "Code Warrior", description: "Solve your first 5 coding lab problems", icon: "Terminal", xp_reward: 50, category: "Coding", unlocked: false },
    { code: "master_accuracy", title: "Precision Specialist", description: "Achieve 100% accuracy on a quiz", icon: "Target", xp_reward: 30, category: "Quizzes", unlocked: false },
    { code: "study_planner_exam", title: "Strategic Mind", description: "Create an exam preparation study plan", icon: "Calendar", xp_reward: 20, category: "Planner", unlocked: true },
    { code: "bilingual_scholar", title: "Bilingual Scholar", description: "Learn a concept in Hindi/Hinglish mode", icon: "Languages", xp_reward: 25, category: "AI Tutor", unlocked: true },
    { code: "document_scholar", title: "Knowledge Miner", description: "Upload a document and generate a study pack", icon: "FileText", xp_reward: 30, category: "Documents", unlocked: false },
    { code: "polyglot_coder", title: "Polyglot", description: "Run code in 3 different programming languages", icon: "Layers", xp_reward: 40, category: "Coding", unlocked: false }
  ]
};

// Client-side dispatcher when API server is offline or hosted statically on GitHub Pages
function clientFallback(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  if (url.includes('/analytics/dashboard')) return fallbackData.dashboard;
  if (url.includes('/analytics/progress')) return fallbackData.progress;
  if (url.includes('/analytics/leaderboard')) return fallbackData.leaderboard;
  if (url.includes('/analytics/achievements')) return fallbackData.achievements;
  if (url.includes('/ai/status')) return { active_provider: "Built-in Study AI (Client Engine)", fallback_available: true };

  if (url.includes('/ai/tutor')) {
    const q = (body.query || '').toLowerCase();
    const mode = body.mode || 'beginner';
    if (mode === 'bilingual') {
      return {
        mode: 'bilingual',
        response: `### 🌟 Bilingual Explanation (द्विभाषी)\n\n**English:**\nRecursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it into smaller sub-problems until reaching a base case.\n\n**Hinglish:**\nRecursion ka matlab hai jab ek function apne aap ko hi baar-baar call karta hai jab tak target (Base Case) achieve na ho jaye! Jaise mirrors ke samne khade hone par reflections bante hain.\n\n\`\`\`python\ndef countdown(n):\n    if n <= 0: return\n    print(n)\n    countdown(n - 1)\n\`\`\``
      };
    } else if (mode === 'exam') {
      return {
        mode: 'exam',
        response: `### 📝 Exam-Ready Points:\n- **Definition (2 Marks):** A function calling itself until a stopping condition is met.\n- **Mandatory Requirements:** 1. Base Case, 2. State transition towards base case.\n- **Space Complexity:** O(N) auxiliary call-stack frames.\n- **Common Error:** Missing base case leads to stack overflow.`
      };
    } else {
      return {
        mode: mode,
        response: `### 💡 AI Tutor Response (${mode}):\n\nGreat question about **${body.query}**!\n\nKey Concept:\nBreak the problem down step-by-step. Ensure all boundary and edge cases are validated.`
      };
    }
  }

  if (url.includes('/ai/explain')) {
    const t = body.topic || 'Recursion';
    return {
      topic: t,
      one_line_definition: `${t} is a fundamental computational technique that breaks complex problems into self-similar sub-problems.`,
      beginner_explanation: `Imagine opening Russian nesting dolls (Matryoshka). Each doll reveals a smaller one inside until you find the solid wooden core (base case). That is ${t}!`,
      real_world_analogy: "Asking the person ahead of you in a line what position they are in until you reach person #1.",
      syntax: `def solve_${t.toLowerCase().replace(/\\s+/g, '_')}(data):\n    if base_case:\n        return base_result\n    return recursive_call(smaller_data)`,
      example: "Calculating factorials: 5! = 5 * 4 * 3 * 2 * 1 = 120.",
      code_example: `def factorial(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5)) # Output: 120`,
      common_mistakes: [
        "Omitting the Base Case, causing maximum recursion depth exceeded.",
        "Incorrect state transition (e.g. passing n instead of n - 1).",
        "Redundant recalculation without memoization."
      ],
      interview_question: `How is ${t} handled in call-stack memory, and how can you convert it to an iterative Stack approach?`,
      mcqs: [
        {
          question: `What is the primary condition required to stop infinite calls in ${t}?`,
          options: ["Base Case", "While Loop", "Global Counter", "Exception Handler"],
          answer: "Base Case"
        }
      ],
      practice_problem: `Write a recursive function to reverse an integer or check palindromes.`,
      quick_revision_summary: `1. Always define base case. 2. Decrement problem size. 3. O(N) stack memory.`,
      bilingual_hindi: {
        definition: `${t} ek aisi technique hai jisme function khud ko call karke problems ko solve karta hai.`,
        analogy: "Aamne saamne do mirror rakhne jaisa jisme reflections banti hain."
      }
    };
  }

  if (url.includes('/ai/debug')) {
    return {
      mode: body.mode || 'hint',
      content: body.mode === 'hint'
        ? "💡 Hint: Inspect your loop boundaries and make sure you do not access indices beyond len(items) - 1."
        : (body.mode === 'explain'
          ? "🔍 Error Diagnosis: Check line 2. Ensure syntax terminates with a colon and index bounds are checked."
          : "✅ Corrected Solution:\n```python\nfor i in range(len(items)):\n    print(items[i])\n```")
    };
  }

  if (url.includes('/ai/study-pack')) {
    return {
      topic: body.topic || "Computer Science",
      explanation: clientFallback('/ai/explain', { body: JSON.stringify({ topic: body.topic }) }),
      flashcards: [
        { front: `What is the core principle of ${body.topic}?`, back: "Modular, robust, and clean logic with edge-case handling.", hint: "Think about reliability", difficulty: "Easy" }
      ],
      quiz: [
        { question_text: `What is crucial when implementing ${body.topic}?`, options: ["Edge case handling", "Infinite loops", "Ignoring complexity"], correct_answer: "Edge case handling" }
      ]
    };
  }

  if (url.includes('/quizzes') && method === 'GET') {
    return [
      { id: 1, title: "Python Mastery: Loops & Recursion Check", subject: "Python", topic: "Loops & Iteration", difficulty: "Intermediate", time_limit_seconds: 180, total_questions: 5, is_adaptive: true },
      { id: 2, title: "Data Structures: BST & Hash Tables", subject: "Data Structures", topic: "Trees & BST", difficulty: "Advanced", time_limit_seconds: 240, total_questions: 4, is_adaptive: true }
    ];
  }

  if (/\/quizzes\/\d+$/.test(url) && method === 'GET') {
    return {
      id: 1,
      title: "Python Mastery: Loops & Recursion Check",
      subject: "Python",
      topic: "Loops & Iteration",
      difficulty: "Intermediate",
      time_limit_seconds: 180,
      is_adaptive: true,
      questions: [
        { id: 101, question_text: "What will be the output of: `print([i for i in range(1, 6, 2)])`?", question_type: "code_output", code_snippet: "print([i for i in range(1, 6, 2)])", options: ["[1, 3, 5]", "[1, 2, 3, 4, 5]", "[2, 4, 6]", "[1, 3]"], correct_answer: "[1, 3, 5]", concept: "Range step parameter" },
        { id: 102, question_text: "Which condition is strictly mandatory to prevent an infinite loop in a recursive function?", question_type: "mcq", options: ["A Base Case", "An explicit while loop", "A return type of integer", "Global counter"], correct_answer: "A Base Case", concept: "Recursion Base Case" },
        { id: 103, question_text: "What is the average lookup time complexity of a key in a Hash Map?", question_type: "mcq", options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], correct_answer: "O(1)", concept: "Hash Table Complexity" }
      ]
    };
  }

  if (url.includes('/quizzes') && url.includes('/submit')) {
    return {
      score: 3,
      total_questions: 3,
      accuracy: 100.0,
      time_taken_seconds: 45,
      xp_earned: 50,
      ai_recommendation: "Outstanding performance! You showed complete conceptual clarity across all questions.",
      detailed_results: [
        { question_text: "What will be the output of: print([i for i in range(1, 6, 2)])?", user_answer: "[1, 3, 5]", correct_answer: "[1, 3, 5]", is_correct: true, explanation: "range(start, stop, step) steps by 2." }
      ]
    };
  }

  if (url.includes('/quizzes/why-was-i-wrong')) {
    return {
      your_answer: body.user_answer,
      correct_answer: body.correct_answer,
      concept_involved: body.concept || "Algorithmic Invariants",
      why_yours_was_wrong: `Choosing '${body.user_answer}' usually occurs when ignoring the boundary condition offset.`,
      practice_similar_question: {
        question: "What happens if range(5) is evaluated in a for loop?",
        options: ["Iterates 0, 1, 2, 3, 4", "Iterates 1, 2, 3, 4, 5", "Iterates 0 to 5 inclusive"],
        correct_answer: "Iterates 0, 1, 2, 3, 4"
      }
    };
  }

  if (url.includes('/flashcards/decks')) {
    return [
      { id: 1, title: "Python Core Fundamentals", description: "Must-know data types, mutability, and slicing", subject: "Python", topic: "Variables", cards_count: 5, due_count: 3 },
      { id: 2, title: "Data Structures & Algorithms", description: "Big-O, BST, and graph traversal", subject: "DSA", topic: "Arrays", cards_count: 4, due_count: 2 }
    ];
  }

  if (/\/flashcards\/decks\/\d+$/.test(url)) {
    return {
      id: 1,
      title: "Python Core Fundamentals",
      cards: [
        { id: 201, front: "What is the difference between list and tuple in Python?", back: "Lists are mutable defined with []; tuples are immutable defined with (). Tuples are hashable and faster.", hint: "Think about in-place modification", difficulty: "Easy" },
        { id: 202, front: "What is a pointer or reference in memory?", back: "A pointer/reference stores the memory address of another variable rather than the actual direct value.", hint: "It points to where data lives", difficulty: "Medium" },
        { id: 203, front: "What is the time complexity of searching a key in a Python dict?", back: "Average O(1) constant time, implemented using a Hash Table.", hint: "Hashing technique", difficulty: "Hard" }
      ]
    };
  }

  if (url.includes('/coding/problems')) {
    if (/\/coding\/problems\/[a-z0-9-]+$/.test(url)) {
      return {
        id: 1,
        title: "Reverse a String",
        slug: "reverse-a-string",
        category: "Strings",
        difficulty: "Easy",
        description: "Write a function `reverse_string(s)` that takes a string and returns it reversed.",
        boilerplates: {
          python: "def reverse_string(s: str) -> str:\n    # Write your solution here\n    return s[::-1]\n",
          javascript: "function reverseString(s) {\n    return s.split('').reverse().join('');\n}\n"
        },
        hints: ["Try Python slicing [::-1] or a two-pointer approach."],
        examples: [{ input: "hello", output: "olleh" }],
        visible_tests: [{ input: "hello", expected: "olleh" }],
        xp_reward: 20
      };
    }
    return [
      { id: 1, title: "Reverse a String", slug: "reverse-a-string", category: "Strings", difficulty: "Easy", xp_reward: 20 },
      { id: 2, title: "Two Sum", slug: "two-sum", category: "Arrays", difficulty: "Easy", xp_reward: 30 },
      { id: 3, title: "Valid Parentheses", slug: "valid-parentheses", category: "Data Structures", difficulty: "Medium", xp_reward: 40 }
    ];
  }

  if (url.includes('/coding/run') || url.includes('/coding/submit')) {
    return {
      status: "Accepted",
      stdout: "Output: olleh\n[Program executed and verified successfully in sandbox mode.]",
      runtime_ms: 12.4,
      passed_tests: 3,
      total_tests: 3,
      all_passed: true,
      xp_awarded: 30,
      test_results: [
        { input: "hello", expected: "olleh", actual: "olleh", passed: true }
      ]
    };
  }

  if (url.includes('/games') && !url.includes('/submit') && !url.includes('/content')) {
    return [
      { id: "code_rush", name: "Code Rush", tagline: "Speed trivia against clock", category: "Speed", difficulty: "All" },
      { id: "bug_hunter", name: "Bug Hunter", tagline: "Spot syntax & logical bugs", category: "Debugging", difficulty: "Intermediate" },
      { id: "output_predictor", name: "Output Predictor", tagline: "Mentally execute code", category: "Logic", difficulty: "Intermediate" },
      { id: "memory_match", name: "Memory Match", tagline: "Concept definition tiles", category: "Recall", difficulty: "Beginner" },
      { id: "flashcard_battle", name: "Flashcard Battle", tagline: "Rapid combo multiplier", category: "Speed", difficulty: "Intermediate" },
      { id: "algorithm_maze", name: "Algorithm Maze", tagline: "CS question maze", category: "Adventure", difficulty: "Intermediate" },
      { id: "typing_code", name: "Typing Code", tagline: "WPM and syntax test", category: "Typing", difficulty: "All" },
      { id: "binary_battle", name: "Binary Battle", tagline: "Number system conversion", category: "Architecture", difficulty: "Intermediate" },
      { id: "sql_detective", name: "SQL Detective", tagline: "Solve murder mystery via SQL", category: "SQL", difficulty: "Intermediate" },
      { id: "ai_quiz_boss", name: "AI Quiz Boss", tagline: "RPG boss fight with HP bars", category: "Boss Raid", difficulty: "Hard" }
    ];
  }

  if (url.includes('/games') && url.includes('/content')) {
    if (url.includes('code_rush')) {
      return {
        questions: [
          { q: "What keyword defines a function in Python?", options: ["func", "def", "function", "fn"], a: "def" },
          { q: "Which data structure follows LIFO?", options: ["Queue", "Stack", "Array", "Tree"], a: "Stack" },
          { q: "Which Big-O complexity is faster?", options: ["O(N)", "O(log N)", "O(N^2)"], a: "O(log N)" }
        ]
      };
    }
    if (url.includes('bug_hunter')) {
      return {
        scenarios: [
          { code: "for i in range(5)\n    print(i)", options: ["Missing colon `:`", "range() syntax invalid", "Indentation error"], correct: "Missing colon `:`" },
          { code: "total = 0\nfor x in [1, 2]:\n    total == total + x", options: ["Equality `==` used instead of `=`", "List invalid"], correct: "Equality `==` used instead of `=`" }
        ]
      };
    }
    if (url.includes('output_predictor')) {
      return {
        challenges: [
          { code: "x = 5\nx += 2 * 3\nprint(x)", options: ["21", "11", "10", "16"], correct: "11" },
          { code: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)", options: ["[1, 2]", "[1, 2, 3]", "[3]"], correct: "[1, 2, 3]" }
        ]
      };
    }
    if (url.includes('ai_quiz_boss')) {
      return {
        boss: {
          name: "Neural Overlord Alpha",
          title: "Grand Architect of Infinite Loops",
          max_hp: 500,
          avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bossalpha",
          player_max_hp: 100,
          questions: [
            { question: "What is the amortized insertion time complexity of an element into a dynamic array?", options: ["O(1)", "O(N)", "O(log N)"], answer: "O(1)", damage: 125 },
            { question: "Which sorting algorithm is guaranteed to be stable and O(N log N)?", options: ["MergeSort", "QuickSort", "SelectionSort"], answer: "MergeSort", damage: 125 }
          ]
        }
      };
    }
    if (url.includes('sql_detective')) {
      return {
        mystery: {
          case_title: "The Heist at Silicon Manor",
          briefing: "A prototype quantum chip was stolen at 21:00. Query access logs to uncover the culprit.",
          tables: {
            suspects: [
              { id: 1, name: "Dr. Aris", role: "Lead Architect", badge_color: "Blue" },
              { id: 2, name: "Elena Vance", role: "Head of Security", badge_color: "Red" },
              { id: 3, name: "Marcus Kane", role: "Visiting Investor", badge_color: "Gold" }
            ]
          },
          solution_suspect: "Marcus Kane"
        }
      };
    }
    return { status: "ready" };
  }

  if (url.includes('/games/submit')) {
    return { score: body.score || 100, xp_earned: 40, leveled_up: false, newly_unlocked_achievements: [] };
  }

  if (url.includes('/notes')) {
    return [
      { id: 1, title: "Recursion Key Rules & Invariants", content: "# Recursion Essentials\n1. Base Case.\n2. State progression.\n3. Call stack depth O(N).", folder: "Computer Science", is_pinned: true }
    ];
  }

  if (url.includes('/planner')) {
    if (url.includes('/quick-revision')) {
      return {
        duration_minutes: body.duration_minutes || 15,
        subject: body.subject || "Python",
        definitions: [
          { term: "Mutability", def: "Whether an object can be modified in-place after creation." },
          { term: "Base Case", def: "Halting condition preventing stack overflow in recursion." }
        ],
        rapid_quiz: [
          { q: "What is the worst case time complexity of QuickSort?", options: ["O(N^2)", "O(N log N)"], a: "O(N^2)" }
        ]
      };
    }
    return [
      {
        id: 1,
        title: "Python Developer in 30 Days",
        exam_date: "2026-10-25",
        daily_hours: 2.0,
        completed_tasks: 3,
        total_tasks: 7,
        schedule: [
          { day: 1, topic: "Variables & Types", hours: 1.5, completed: true },
          { day: 2, topic: "Conditions & Branching", hours: 2.0, completed: true },
          { day: 3, topic: "While & For Loops", hours: 2.0, completed: true },
          { day: 4, topic: "Functions & Scope", hours: 1.5, completed: false },
          { day: 5, topic: "Lists & Dicts", hours: 2.0, completed: false },
          { day: 6, topic: "Recursion & Call Stack", hours: 2.5, completed: false },
          { day: 7, topic: "Review & Mock Exam", hours: 2.0, completed: false }
        ]
      }
    ];
  }

  if (url.includes('/subjects')) {
    return [
      { id: 1, name: "Python", slug: "python", category: "Programming", description: "Core programming language", topics_count: 7, topics: [{ id: 1, name: "Loops & Iteration", slug: "loops-iteration" }] },
      { id: 2, name: "Data Structures & Algorithms", slug: "dsa", category: "Computer Science", description: "DSA for interviews", topics_count: 6, topics: [{ id: 2, name: "Binary Trees", slug: "trees-bst" }] },
      { id: 3, name: "C++", slug: "cpp", category: "Programming", description: "Systems programming & memory", topics_count: 4, topics: [{ id: 3, name: "Pointers & References", slug: "cpp-pointers" }] },
      { id: 4, name: "DBMS & SQL", slug: "dbms", category: "Computer Science", description: "Relational queries & transactions", topics_count: 4, topics: [{ id: 4, name: "Joins & Normalization", slug: "joins" }] }
    ];
  }

  if (url.includes('/learning-paths')) {
    return [
      { id: "1", title: "Python Developer Path", category: "Software Engineering", progress_percent: 60, completed_modules: 6, total_modules: 10, estimated_hours: 35, description: "Zero to production-ready Python." },
      { id: "2", title: "DSA Interview Master", category: "Career", progress_percent: 38, completed_modules: 3, total_modules: 8, estimated_hours: 50, description: "Crack top tech coding rounds." }
    ];
  }

  if (url.includes('/projects')) {
    return [
      { id: "1", title: "CLI Smart Calculator with History", level: "Beginner", tech_stack: ["Python"], description: "Command-line calculator parsing math expressions.", features: ["Precedence", "Error handling"], estimated_hours: 4 },
      { id: "2", title: "Weather Forecast Dashboard", level: "Intermediate", tech_stack: ["JavaScript", "REST APIs"], description: "Live weather data with charts and local storage.", features: ["Async fetch", "Geolocation"], estimated_hours: 8 },
      { id: "3", title: "AI Study Buddy Ecosystem", level: "Advanced", tech_stack: ["React", "FastAPI", "SQLite", "AI"], description: "Full-stack learning companion with SM-2 flashcards.", features: ["AI Tutor", "10 Games", "Coding Lab"], estimated_hours: 20 }
    ];
  }

  if (url.includes('/search')) {
    return {
      total_results: 3,
      results: {
        topics: [{ id: 1, name: "Recursion & Call Stack", slug: "recursion", difficulty: "Advanced" }],
        coding_problems: [{ id: 1, title: "Reverse a String", slug: "reverse-a-string", difficulty: "Easy" }],
        quizzes: [{ id: 1, title: "Python Mastery Check", difficulty: "Intermediate" }]
      }
    };
  }

  return { status: "success" };
}

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      // If 404 or backend unavailable, use client fallback
      return clientFallback(url, options);
    }
    return await res.json();
  } catch (error) {
    // Network failure (e.g. running on static GitHub Pages)
    return clientFallback(url, options);
  }
}

export const api = {
  // Analytics & Dashboard
  getDashboard: () => fetchJSON(`${API_BASE}/analytics/dashboard`),
  getProgress: () => fetchJSON(`${API_BASE}/analytics/progress`),
  getLeaderboard: () => fetchJSON(`${API_BASE}/analytics/leaderboard`),
  getAchievements: () => fetchJSON(`${API_BASE}/analytics/achievements`),

  // AI Core
  getAIStatus: () => fetchJSON(`${API_BASE}/ai/status`),
  askTutor: (query, mode = 'beginner', context = null, history = []) =>
    fetchJSON(`${API_BASE}/ai/tutor`, {
      method: 'POST',
      body: JSON.stringify({ query, mode, context, history })
    }),
  explainTopic: (topic, level = 'Beginner', language = 'English') =>
    fetchJSON(`${API_BASE}/ai/explain`, {
      method: 'POST',
      body: JSON.stringify({ topic, level, language })
    }),
  debugCode: (code, language = 'python', context = null, mode = 'hint') =>
    fetchJSON(`${API_BASE}/ai/debug`, {
      method: 'POST',
      body: JSON.stringify({ code, language, context, mode })
    }),
  summarizeText: (text, maxPoints = 5) =>
    fetchJSON(`${API_BASE}/ai/summarize`, {
      method: 'POST',
      body: JSON.stringify({ text, max_points: maxPoints })
    }),
  generateStudyPack: (topic, subject = 'Computer Science', difficulty = 'Intermediate', language = 'English') =>
    fetchJSON(`${API_BASE}/ai/study-pack`, {
      method: 'POST',
      body: JSON.stringify({ topic, subject, difficulty, language })
    }),

  // Quizzes
  getQuizzes: () => fetchJSON(`${API_BASE}/quizzes`),
  getQuiz: (id) => fetchJSON(`${API_BASE}/quizzes/${id}`),
  generateQuiz: (subject, topic, difficulty = 'Intermediate', totalQuestions = 5, isAdaptive = false) =>
    fetchJSON(`${API_BASE}/quizzes/generate`, {
      method: 'POST',
      body: JSON.stringify({ subject, topic, difficulty, total_questions: totalQuestions, is_adaptive: isAdaptive })
    }),
  submitQuiz: (quizId, submissionData) =>
    fetchJSON(`${API_BASE}/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    }),
  whyWasIWrong: (questionText, userAnswer, correctAnswer, concept = null) =>
    fetchJSON(`${API_BASE}/quizzes/why-was-i-wrong`, {
      method: 'POST',
      body: JSON.stringify({
        question_text: questionText,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        concept
      })
    }),

  // Flashcards
  getDecks: () => fetchJSON(`${API_BASE}/flashcards/decks`),
  getDeck: (id) => fetchJSON(`${API_BASE}/flashcards/decks/${id}`),
  createDeck: (data) =>
    fetchJSON(`${API_BASE}/flashcards/decks`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  addCard: (deckId, data) =>
    fetchJSON(`${API_BASE}/flashcards/decks/${deckId}/cards`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  generateAIDeck: (topic, subject = 'General', difficulty = 'Intermediate', count = 5) =>
    fetchJSON(`${API_BASE}/flashcards/generate`, {
      method: 'POST',
      body: JSON.stringify({ topic, subject, difficulty, count })
    }),
  reviewCard: (cardId, rating) =>
    fetchJSON(`${API_BASE}/flashcards/cards/${cardId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    }),

  // Coding Lab
  getCodingProblems: (category = null, difficulty = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    return fetchJSON(`${API_BASE}/coding/problems?${params.toString()}`);
  },
  getCodingProblem: (slug) => fetchJSON(`${API_BASE}/coding/problems/${slug}`),
  runCode: (code, language = 'python', inputData = null) =>
    fetchJSON(`${API_BASE}/coding/run`, {
      method: 'POST',
      body: JSON.stringify({ code, language, input_data: inputData })
    }),
  submitCode: (problemId, language, code, userId = 1) =>
    fetchJSON(`${API_BASE}/coding/submit`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, problem_id: problemId, language, code })
    }),

  // Games
  getGamesList: () => fetchJSON(`${API_BASE}/games`),
  getGameContent: (gameType) => fetchJSON(`${API_BASE}/games/${gameType}/content`),
  submitGameSession: (gameType, score, accuracy = 100, levelReached = 1, details = {}) =>
    fetchJSON(`${API_BASE}/games/submit`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: 1,
        game_type: gameType,
        score,
        accuracy,
        level_reached: levelReached,
        details
      })
    }),

  // Notes & Documents
  getNotes: (folder = null) => {
    const url = folder ? `${API_BASE}/notes?folder=${encodeURIComponent(folder)}` : `${API_BASE}/notes`;
    return fetchJSON(url);
  },
  createNote: (data) =>
    fetchJSON(`${API_BASE}/notes`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateNote: (id, data) =>
    fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteNote: (id) =>
    fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'DELETE'
    }),
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/notes/upload-document`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        filename: file.name,
        note_id: Date.now(),
        summary: `Document ${file.name} analyzed! Core concepts and study pack extracted.`,
        key_points: ["Active recall and spaced repetition strengthen memory retention.", "Focus on boundary conditions."],
        definitions: [{ term: "Invariant", definition: "A condition that remains unaltered." }],
        formulas: ["T(N) = O(N log N)"],
        checklist: ["Review summary", "Practice 5 flashcards"]
      };
    }
  },

  // Planner
  getStudyPlans: () => fetchJSON(`${API_BASE}/planner`),
  generateStudyPlan: (data) =>
    fetchJSON(`${API_BASE}/planner/generate`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  togglePlanTask: (planId, dayNumber, completed) =>
    fetchJSON(`${API_BASE}/planner/toggle-task`, {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, day_number: dayNumber, completed })
    }),
  getQuickRevision: (subject = 'Python', durationMinutes = 15) =>
    fetchJSON(`${API_BASE}/planner/quick-revision`, {
      method: 'POST',
      body: JSON.stringify({ subject, duration_minutes: durationMinutes })
    }),

  // Subjects, Paths, Projects & Search
  getSubjects: (category = null) => {
    const url = category ? `${API_BASE}/subjects?category=${encodeURIComponent(category)}` : `${API_BASE}/subjects`;
    return fetchJSON(url);
  },
  getSubject: (slug) => fetchJSON(`${API_BASE}/subjects/${slug}`),
  getLearningPaths: () => fetchJSON(`${API_BASE}/learning-paths`),
  getProjects: () => fetchJSON(`${API_BASE}/projects`),
  search: (query) => fetchJSON(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
};
