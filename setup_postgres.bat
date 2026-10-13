@echo off
echo ============================================================
echo   CareerPilot AI — PostgreSQL Permissions & Table Setup
echo ============================================================
echo.
echo Please enter your 'postgres' password when prompted:
echo.

"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d career_ai_authication -c "GRANT ALL ON SCHEMA public TO career_ai_user; ALTER DATABASE career_ai_authication OWNER TO career_ai_user;"

echo.
echo [2/2] Creating tables inside career_ai_authication...
cd /d "%~dp0backend"
python -c "from app.db.database import Base, engine; import app.models; Base.metadata.create_all(bind=engine); print('=== ALL TABLES CREATED IN POSTGRESQL! ===')"

echo.
echo Setup completed! You can now register on frontend and view rows in pgAdmin.
pause
