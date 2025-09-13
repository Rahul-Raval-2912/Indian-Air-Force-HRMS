@echo off
echo ===============================================
echo IAF Human Management System - Frontend Only
echo ===============================================

echo.
echo Starting React Frontend Server...
cd frontend
npm start
cd ..

echo.
echo ===============================================
echo ✅ IAF Frontend Started!
echo ===============================================
echo 🌐 Frontend App: http://localhost:3000
echo ===============================================
echo.
echo 📝 Demo Login Roles:
echo    • Commander - Strategic overview
echo    • HR Manager - Personnel management  
echo    • Medical Officer - Health monitoring
echo    • Training Officer - Skill development
echo    • Personnel - Personal dashboard
echo.
echo Note: Using mock data (Django backend not required)
echo.
pause