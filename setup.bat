@echo off
title SchoolPulse Setup
echo.
echo ============================================
echo   SchoolPulse - First Time Setup
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Enter your MySQL root password when asked:
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "source backend/schema.sql"
echo.
echo [2/3] Database created!
echo.

echo [3/3] Creating admin account (email: admin@school.com, password: Admin@123)
echo.
cd backend
node createAdmin.js admin@school.com Admin@123 Admin
cd ..

echo.
echo ============================================
echo   SETUP COMPLETE!
echo ============================================
echo.
echo   Login:  http://localhost:7777
echo   Email:  admin@school.com
echo   Pass:   Admin@123
echo.
echo   To start: double-click start.bat
echo ============================================
pause
