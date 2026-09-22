@echo off
title AI Study Buddy
echo ===================================================
echo           Starting AI Study Buddy Platform
echo ===================================================

REM Check if frontend production build exists, build if missing
if not exist "frontend\dist\index.html" (
    echo Building frontend production assets...
    cd frontend
    call npm install
    call npm run build
    cd ..
)

echo.
echo Launching browser at http://localhost:8000 ...
start "" "http://localhost:8000"

echo.
echo ===================================================
echo Web App running at:      http://localhost:8000
echo API Documentation at:    http://localhost:8000/docs
echo ===================================================
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
