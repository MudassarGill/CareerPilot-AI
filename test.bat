@echo off
echo ==============================================
echo  CareerPilot AI — Full-Stack Launcher
echo ==============================================

echo [1/4] Migrating database...
cd backend
call alembic upgrade head
if %errorlevel% neq 0 (
    echo [ERROR] Database migration failed. Is PostgreSQL running?
    pause
    exit /b %errorlevel%
)

echo [2/4] Seeding Demo Data...
call python -m app.scripts.seed_demo
if %errorlevel% neq 0 (
    echo [WARNING] Data seeding encountered an issue. Skipping...
)

echo [3/4] Starting Backend API (port 8000)...
start "CareerPilot Backend" cmd /k "uvicorn app.main:app --reload --port 8000"

echo [4/4] Installing Frontend deps and starting (port 3000)...
cd ..\frontend
call npm install
start "CareerPilot Frontend" cmd /k "npm run dev"

echo.
echo ==============================================
echo  Both servers are starting!
echo  Frontend:   http://localhost:3000
echo  Backend:    http://localhost:8000/docs
echo  Mailpit:    http://localhost:8025
echo ==============================================
echo Press any key to close this launcher...
pause >nul
