import pytest
from fastapi.testclient import TestClient
from backend.main import app

from backend.database.db import engine, Base, SessionLocal
from backend.database.seed_data import seed_database

# Ensure database tables and seeds exist for tests
Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)
db.close()

client = TestClient(app)

def test_list_subjects():
    response = client.get("/api/subjects")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(s["name"] == "Python" for s in data)

def test_list_and_submit_quiz():
    # List quizzes
    response = client.get("/api/quizzes")
    assert response.status_code == 200
    quizzes = response.json()
    assert len(quizzes) > 0

    quiz_id = quizzes[0]["id"]
    detail_res = client.get(f"/api/quizzes/{quiz_id}")
    assert detail_res.status_code == 200
    quiz_data = detail_res.json()
    assert len(quiz_data["questions"]) > 0

    # Submit quiz
    sub_res = client.post(f"/api/quizzes/{quiz_id}/submit", json={
        "user_id": 1,
        "time_taken_seconds": 45,
        "answers": {
            quiz_data["questions"][0]["id"]: "1 3 5"
        }
    })
    assert sub_res.status_code == 200
    res_data = sub_res.json()
    assert "score" in res_data
    assert "accuracy" in res_data
    assert "xp_earned" in res_data

def test_flashcards_spaced_repetition():
    decks_res = client.get("/api/flashcards/decks")
    assert decks_res.status_code == 200
    decks = decks_res.json()
    assert len(decks) > 0

    deck_res = client.get(f"/api/flashcards/decks/{decks[0]['id']}")
    assert deck_res.status_code == 200
    deck_data = deck_res.json()
    assert len(deck_data["cards"]) > 0

    card_id = deck_data["cards"][0]["id"]
    review_res = client.post(f"/api/flashcards/cards/{card_id}/review", json={
        "rating": "good"
    })
    assert review_res.status_code == 200
    assert review_res.json()["card_id"] == card_id

def test_coding_lab_runner():
    response = client.post("/api/coding/run", json={
        "code": "print('Hello Study Buddy!')",
        "language": "python"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Accepted"
    assert "Hello Study Buddy!" in data["stdout"]

def test_games_arcade_content_and_scoring():
    games_res = client.get("/api/games")
    assert games_res.status_code == 200
    games = games_res.json()
    assert len(games) == 10  # All 10 games available

    # Content check for AI Quiz Boss
    boss_content = client.get("/api/games/ai_quiz_boss/content")
    assert boss_content.status_code == 200
    assert "boss" in boss_content.json()

    # Submit game score
    sub_res = client.post("/api/games/submit", json={
        "user_id": 1,
        "game_type": "code_rush",
        "score": 450,
        "accuracy": 100.0,
        "level_reached": 2
    })
    assert sub_res.status_code == 200
    assert sub_res.json()["xp_earned"] > 0
