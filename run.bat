@echo off
echo ==============================================
echo        URBANFLOW AI - LAUNCH CONTROLLER
echo ==============================================
echo.

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000...
start "UrbanFlow Backend Server" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo.
echo [2/2] Launching React Frontend on http://localhost:5173...
cd frontend
npm run dev

pause
