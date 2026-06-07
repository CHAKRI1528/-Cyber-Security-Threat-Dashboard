@echo off
REM Cyber Threat Monitoring System - Windows Setup Script

echo.
echo ============================================================
echo    Cyber Threat Monitoring System - Windows Setup
echo ============================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker is not installed. Please install Docker Desktop first.
    echo     Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [✓] Docker detected

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker Compose is not installed or not in PATH
    pause
    exit /b 1
)

echo [✓] Docker Compose detected
echo.

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    echo [*] Creating backend\.env from template...
    copy backend\.env.example backend\.env
    echo [✓] Created backend\.env - Please update with your API keys
) else (
    echo [✓] backend\.env already exists
)

echo.

REM Create frontend .env if it doesn't exist
if not exist "frontend\.env.local" (
    echo [*] Creating frontend\.env.local from template...
    copy frontend\.env.local.example frontend\.env.local
    echo [✓] Created frontend\.env.local
) else (
    echo [✓] frontend\.env.local already exists
)

echo.
echo [*] Building Docker images...
docker-compose build

echo.
echo [*] Starting services...
docker-compose up -d

echo.
echo [*] Waiting for services to start (10 seconds)...
timeout /t 10 /nobreak

echo.
echo ============================================================
echo [✓] Setup Complete!
echo ============================================================
echo.
echo Access URLs:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo   - MongoDB:  localhost:27017
echo.
echo Check logs:
echo   docker-compose logs -f backend
echo   docker-compose logs -f frontend
echo   docker-compose logs -f mongodb
echo.
echo Stop services:
echo   docker-compose down
echo.
echo Documentation:
echo   - README.md: Full documentation
echo   - QUICK_START.md: Quick setup guide
echo   - API_DOCS.md: API reference
echo   - DEPLOYMENT.md: Production deployment
echo.
pause
