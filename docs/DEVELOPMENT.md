# Development Guide — AI Study Buddy

## Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js v24)
- npm 9+

## Local Setup

### 1. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run backend development server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The API and documentation will be live at:
- API: `http://localhost:8000/api`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React development server runs at `http://localhost:5173`. Requests to `/api` are automatically proxied to the backend.

### 3. Automated Tests
```bash
# Run backend pytest suite
python -m pytest backend/tests
```
