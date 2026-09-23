# Re-export FastAPI application for app.main:app compatibility
from backend.main import app

__all__ = ["app"]
