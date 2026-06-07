@echo off
REM Stop Cyber Threat Monitoring System

echo Stopping Cyber Threat Monitoring System...
docker-compose down

echo.
echo Services stopped!
echo.
pause
