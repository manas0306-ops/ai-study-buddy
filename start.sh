#!/usr/bin/env bash
echo "==================================================="
echo "          Starting AI Study Buddy Platform"
echo "==================================================="
echo "Backend API + Frontend running at: http://localhost:8000"
echo "API Documentation available at:    http://localhost:8000/docs"
echo "==================================================="
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
