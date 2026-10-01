@echo off
echo ==============================================
echo  CareerPilot AI Phase 1 - Launcher
echo ==============================================

echo [1/3] Migrating database...
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

echo [3/4] Starting Backend API...
start "CareerPilot Backend" cmd /k "uvicorn app.main:app --reload --port 8000"

echo [4/4] Installing Frontend Packages and starting...
cd ../frontend
call npm install
start "CareerPilot Frontend" cmd /k "npm run dev"

echo.
echo ==============================================
echo  Both environments are starting up!
echo  Frontend Auth Page: http://localhost:3000
echo  Backend API Docs:   http://localhost:8000/docs
echo ==============================================
echo Press any key to close this launcher...
pause >nul
