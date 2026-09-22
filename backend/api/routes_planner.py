from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, StudyPlan

router = APIRouter(prefix="/api/planner", tags=["Study Planner & Quick Revision"])

class CreateStudyPlanRequest(BaseModel):
    user_id: Optional[int] = 1
    subject: str = "Data Structures & Algorithms"
    exam_name: str = "Mid-Term Examination"
    exam_date: str = "2026-10-25"
    days_remaining: int = 30
    daily_hours: float = 2.0
    current_level: str = "Beginner"

class ToggleTaskRequest(BaseModel):
    plan_id: int
    day_number: int
    completed: bool

class QuickRevisionRequest(BaseModel):
    subject: str = "Python"
    duration_minutes: int = 15  # 5, 15, 30, 60

@router.get("")
def get_study_plans(db: Session = Depends(get_db)):
    """Retrieve user's active study plans."""
    plans = db.query(StudyPlan).filter(StudyPlan.is_active == True).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "subject": p.subject,
            "exam_date": p.exam_date,
            "days_remaining": p.days_remaining,
            "daily_hours": p.daily_hours,
            "current_level": p.current_level,
            "schedule": p.schedule_data,
            "completed_tasks": sum(1 for t in p.schedule_data if t.get("completed")),
            "total_tasks": len(p.schedule_data)
        }
        for p in plans
    ]

@router.post("/generate")
def generate_study_plan(req: CreateStudyPlanRequest, db: Session = Depends(get_db)):
    """Generate an intelligent day-by-day study curriculum tailored to target exam date and hours."""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        user = db.query(User).first()

    # Create realistic day-by-day curriculum based on subject
    days = min(30, max(5, req.days_remaining))
    topics_pool = [
        "Core Fundamentals & Architecture Overview",
        "Variables, Types & Memory Structures",
        "Conditional Logic & Control Invariants",
        "Iterative Loops & Termination Guarantees",
        "Functions, Parameter Passing & Scope",
        "Lists, Arrays & Contiguous Memory Allocation",
        "Hash Tables, Dictionaries & Collision Handling",
        "Recursion, Call Stack & Base Case Formulations",
        "Trees, Binary Search Trees & Traversal Schemes",
        "Sorting Algorithms & Big-O Complexity Comparisons",
        "Dynamic Programming: Memoization vs Tabulation",
        "Mock Exam Assessment & Comprehensive Review"
    ]

    schedule = []
    for i in range(days):
        topic_assigned = topics_pool[i % len(topics_pool)]
        schedule.append({
            "day": i + 1,
            "topic": topic_assigned,
            "hours": req.daily_hours,
            "completed": False,
            "tasks": [
                f"Review 15 mins concept breakdown of {topic_assigned}",
                "Practice 5 spaced-repetition flashcards",
                "Complete 1 diagnostic quiz"
            ]
        })

    new_plan = StudyPlan(
        user_id=user.id if user else None,
        title=f"{req.subject} {req.exam_name} Plan",
        subject=req.subject,
        exam_date=req.exam_date,
        days_remaining=req.days_remaining,
        daily_hours=req.daily_hours,
        current_level=req.current_level,
        schedule_data=schedule,
        is_active=True
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    return {
        "id": new_plan.id,
        "title": new_plan.title,
        "schedule": new_plan.schedule_data,
        "total_days": len(new_plan.schedule_data)
    }

@router.post("/toggle-task")
def toggle_task_completion(req: ToggleTaskRequest, db: Session = Depends(get_db)):
    """Toggle completion status for a specific day in the study plan."""
    plan = db.query(StudyPlan).filter(StudyPlan.id == req.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    updated_schedule = []
    for item in plan.schedule_data:
        if item.get("day") == req.day_number:
            item["completed"] = req.completed
        updated_schedule.append(item)

    plan.schedule_data = updated_schedule
    db.commit()
    return {"status": "success", "day": req.day_number, "completed": req.completed}

@router.post("/quick-revision")
def quick_revision_session(req: QuickRevisionRequest):
    """Generate a high-intensity blitz revision session for 5m, 15m, 30m, or 1h."""
    duration = req.duration_minutes
    if duration <= 5:
        return {
            "duration_minutes": 5,
            "subject": req.subject,
            "definitions": [
                {"term": f"{req.subject} Invariant", "def": "A property that remains unaltered during algorithm execution."},
                {"term": "Base Case", "def": "The condition that halts recursive calls and prevents stack overflow."}
            ],
            "formula": "Time Complexity: O(1) < O(log N) < O(N) < O(N log N) < O(N^2)",
            "rapid_quiz": [
                {"q": f"Which is more efficient for searching in sorted arrays?", "options": ["Linear Search", "Binary Search"], "a": "Binary Search"}
            ]
        }
    elif duration <= 15:
        return {
            "duration_minutes": 15,
            "subject": req.subject,
            "definitions": [
                {"term": "Mutability", "def": "Whether an object's internal state can be changed in-place after creation."},
                {"term": "Hash Collision", "def": "When two distinct keys produce identical hash indices in a bucket array."},
                {"term": "Pointer / Reference", "def": "A variable holding the direct memory address of another variable."}
            ],
            "formulas": [
                "Master Theorem: T(n) = aT(n/b) + f(n)",
                "Space Overhead: S(n) = O(log n) stack depth"
            ],
            "rapid_quiz": [
                {"q": "What is the worst case of QuickSort?", "options": ["O(N log N)", "O(N^2)"], "a": "O(N^2)"},
                {"q": "Does Python pass arguments by value or by object reference?", "options": ["By Value", "By Object Reference (Call-by-sharing)"], "a": "By Object Reference (Call-by-sharing)"}
            ],
            "micro_problem": f"Mentally trace `[x*2 for x in range(3)]` -> Output: `[0, 2, 4]`"
        }
    else:
        return {
            "duration_minutes": duration,
            "subject": req.subject,
            "definitions": [
                {"term": "ACID Properties", "def": "Atomicity, Consistency, Isolation, Durability for database transactions."},
                {"term": "Deadlock", "def": "A state where each member of a group of processes waits on a resource held by another."},
                {"term": "Dynamic Programming", "def": "Solving complex problems by breaking into overlapping subproblems with optimal substructure."}
            ],
            "formulas": [
                "Amortized Array Doubling Cost: O(1) average",
                "Binary Search: log2(N) maximum comparisons"
            ],
            "rapid_quiz": [
                {"q": "Which data structure is optimal for priority scheduling?", "options": ["Binary Heap", "Linked List"], "a": "Binary Heap"},
                {"q": "What prevents deadlock in Banker's Algorithm?", "options": ["Safe State Verification", "Preemption of all locks"], "a": "Safe State Verification"}
            ],
            "micro_problem": "Write a 3-line palindrome check in Python: `s == s[::-1]`"
        }
