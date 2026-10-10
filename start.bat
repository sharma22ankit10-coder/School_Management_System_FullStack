@echo off
title SchoolPulse - School Management System
echo.
echo ============================================
echo   SchoolPulse - School Management System
echo   Running on http://localhost:7777
echo ============================================
echo.
echo Step 1: Make sure MySQL is running
echo Step 2: Set your MySQL password in backend\.env
echo Step 3: Run this file to start the server
echo.

cd /d "%~dp0\backend"
node server.js
pause
