@echo off
REM Start Cyber Threat Monitoring System

echo Starting Cyber Threat Monitoring System...
echo.

docker-compose up -d

echo.
echo Services are starting...
echo Waiting 10 seconds for services to initialize...
timeout /t 10 /nobreak

echo.
echo ============================================================
echo Dashboard is ready!
echo.
echo Open your browser:
echo   http://localhost:3000
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo ============================================================
echo.
pause
