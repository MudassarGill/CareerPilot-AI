@echo off
cd /d "%~dp0frontend\app"
if exist "forgot-password\page.tsx" del /f /q "forgot-password\page.tsx"
if exist "forgot-password" rmdir /s /q "forgot-password"
if exist "reset-password\page.tsx" del /f /q "reset-password\page.tsx"
if exist "reset-password" rmdir /s /q "reset-password"
echo Cleanup complete
pause
