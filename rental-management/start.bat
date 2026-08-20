@echo off
echo ============================================
echo   RentPro - Rental Management System
echo ============================================

echo.
echo Starting Backend (Spring Boot on port 8080)...
start "RentPro Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 20 seconds for backend to start...
timeout /t 20 /nobreak

echo.
echo Starting Frontend (React on port 3000)...
start "RentPro Frontend" cmd /k "cd frontend && npm install && npm start"

echo.
echo ============================================
echo   Application is starting...
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo ============================================
echo.
echo Default credentials:
echo   Username: admin    Password: admin123
echo   Username: manager  Password: admin123
echo.
pause
