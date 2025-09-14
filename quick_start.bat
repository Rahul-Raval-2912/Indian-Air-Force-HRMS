@echo off
echo Starting IAF Dashboard - Optimized Version
echo.

echo Starting Django Backend...
start "Backend" cmd /k "python manage.py runserver 8000"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
cd frontend
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo IAF Dashboard is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Login as Commander to access the dashboard
pause