@echo off
echo ==========================================
echo Running Tests with Coverage
echo ==========================================
cd /d "%~dp0.."
call npm run test:coverage
if %ERRORLEVEL% NEQ 0 (
    echo Coverage tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Coverage tests completed successfully!
