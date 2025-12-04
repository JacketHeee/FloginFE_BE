@echo off
echo ==========================================
echo Running All Tests with Coverage Report
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean verify
if %ERRORLEVEL% NEQ 0 (
    echo Tests with coverage failed!
    exit /b %ERRORLEVEL%
)
echo.
echo ==========================================
echo Tests completed successfully!
echo Coverage report generated at: target\site\jacoco\index.html
echo ==========================================
echo.
echo Opening coverage report...
start "" "target\site\jacoco\index.html"
