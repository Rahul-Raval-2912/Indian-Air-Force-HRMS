@echo off
echo ===============================================
echo IAF Human Management System - Quick Start
echo ===============================================

echo.
echo 1. Starting Django Backend Server...
start "IAF Backend" cmd /k "python manage.py runserver 8000"

echo.
echo 2. Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo 3. Starting React Frontend Server...
cd frontend
start "IAF Frontend" cmd /k "npm start"
cd ..

echo.
echo ===============================================
echo IAF Human Management System Started!
echo ===============================================
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:3000
echo Admin Panel: http://localhost:8000/admin
echo ===============================================
echo.
echo Demo Login Roles:
echo    • Commander - Strategic overview
echo    • HR Manager - Personnel management  
echo    • Medical Officer - Health monitoring
echo    • Training Officer - Skill development
echo    • Personnel - Personal dashboard
echo.
echo Close both command windows to stop services
echo.
pause