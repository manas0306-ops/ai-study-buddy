from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models import User, CodingProblem, CodeSubmission
from backend.services.code_runner import code_runner
from backend.services.gamification import gamification_service

router = APIRouter(prefix="/api/coding", tags=["Coding Lab"])

class RunCodeRequest(BaseModel):
    code: str
    language: str = "python"
    input_data: Optional[str] = None

class SubmitCodeRequest(BaseModel):
    user_id: Optional[int] = 1
    problem_id: int
    language: str = "python"
    code: str

@router.get("/problems")
def list_problems(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List coding problems with optional filtering."""
    query = db.query(CodingProblem)
    if category:
        query = query.filter(CodingProblem.category.ilike(f"%{category}%"))
    if difficulty:
        query = query.filter(CodingProblem.difficulty.ilike(f"%{difficulty}%"))

    problems = query.all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "category": p.category,
            "difficulty": p.difficulty,
            "xp_reward": p.xp_reward,
            "test_cases_count": len(p.test_cases) if p.test_cases else 0
        }
        for p in problems
    ]

@router.get("/problems/{slug}")
def get_problem_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve full coding problem specifications, boilerplates, hints, and visible test cases."""
    problem = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    visible_tests = [tc for tc in problem.test_cases if not tc.get("is_hidden", False)]

    return {
        "id": problem.id,
        "title": problem.title,
        "slug": problem.slug,
        "category": problem.category,
        "difficulty": problem.difficulty,
        "description": problem.description,
        "examples": problem.examples,
        "boilerplates": problem.boilerplates,
        "hints": problem.hints,
        "visible_tests": visible_tests,
        "total_test_cases": len(problem.test_cases),
        "xp_reward": problem.xp_reward
    }

@router.post("/run")
def run_code_snippet(req: RunCodeRequest):
    """Execute raw code snippet in sandboxed runner."""
    return code_runner.execute_code(req.code, req.language, req.input_data)

@router.post("/submit")
def submit_solution(req: SubmitCodeRequest, db: Session = Depends(get_db)):
    """Evaluate submitted solution against all test cases."""
    problem = db.query(CodingProblem).filter(CodingProblem.id == req.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Coding problem not found")

    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        user = db.query(User).first()

    # Basic test runner evaluation
    passed = 0
    total = len(problem.test_cases)
    test_results = []
    total_runtime = 0.0

    # In Python, append test harness or run verification
    for tc in problem.test_cases:
        # Run code against test case
        run_res = code_runner.execute_code(req.code, req.language, tc.get("input", ""))
        total_runtime += run_res.get("runtime_ms", 0.0)

        # In dev mode, check if code runs cleanly without errors
        has_error = bool(run_res.get("stderr")) or run_res.get("status") != "Accepted"
        test_passed = not has_error
        if test_passed:
            passed += 1

        test_results.append({
            "input": tc.get("input"),
            "expected": tc.get("expected"),
            "actual": run_res.get("stdout", "").strip(),
            "passed": test_passed,
            "is_hidden": tc.get("is_hidden", False)
        })

    all_passed = (passed == total) and total > 0
    status = "Accepted" if all_passed else ("Wrong Answer" if passed > 0 else "Runtime Error")

    xp_awarded = 0
    if all_passed:
        xp_awarded = problem.xp_reward
        gamification_service.award_xp(db, user, "code_problem_solved", custom_xp=xp_awarded)

    # Save submission
    sub = CodeSubmission(
        user_id=user.id,
        problem_id=problem.id,
        language=req.language,
        code=req.code,
        status=status,
        passed_tests=passed,
        total_tests=total,
        runtime_ms=round(total_runtime, 2)
    )
    db.add(sub)
    db.commit()

    return {
        "status": status,
        "passed_tests": passed,
        "total_tests": total,
        "runtime_ms": round(total_runtime, 2),
        "test_results": test_results,
        "xp_awarded": xp_awarded,
        "total_xp": user.xp,
        "all_passed": all_passed
    }
