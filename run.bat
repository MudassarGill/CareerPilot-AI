@echo off
echo ============================================================
echo   CareerPilot AI — Full Stack Launcher (Phase 1)
echo ============================================================

echo [1/2] Starting Backend API (Port 8000)...
start "CareerPilot Backend (FastAPI)" cmd /k "cd /d %~dp0backend && uvicorn app.main:app --reload --port 8000"

echo [2/2] Starting Frontend App (Port 5173)...
start "CareerPilot Frontend (Vite)" cmd /k "cd /d %~dp0careerpilot && npm run dev"

echo.
echo ============================================================
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ============================================================
pause
