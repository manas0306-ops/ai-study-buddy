import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_ai_status():
    response = client.get("/api/ai/status")
    assert response.status_code == 200
    data = response.json()
    assert "active_provider" in data
    assert data["fallback_available"] is True

def test_ai_tutor_beginner_mode():
    response = client.post("/api/ai/tutor", json={
        "query": "What is recursion?",
        "mode": "beginner"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "beginner"
    assert "response" in data
    assert len(data["response"]) > 20

def test_ai_tutor_bilingual_mode():
    response = client.post("/api/ai/tutor", json={
        "query": "What is recursion?",
        "mode": "bilingual"
    })
    assert response.status_code == 200
    data = response.json()
    assert "English" in data["response"] or "Hinglish" in data["response"]

def test_ai_explainer_11_parts():
    response = client.post("/api/ai/explain", json={
        "topic": "Recursion",
        "level": "Beginner",
        "language": "English"
    })
    assert response.status_code == 200
    data = response.json()
    assert "one_line_definition" in data
    assert "beginner_explanation" in data
    assert "real_world_analogy" in data
    assert "syntax" in data
    assert "code_example" in data
    assert "common_mistakes" in data
    assert "interview_question" in data
    assert "mcqs" in data
    assert "practice_problem" in data
    assert "quick_revision_summary" in data

def test_ai_debugger_hint():
    response = client.post("/api/ai/debug", json={
        "code": "for i in range(5)\n    print(i)",
        "language": "python",
        "mode": "hint"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "hint"
    assert "content" in data
