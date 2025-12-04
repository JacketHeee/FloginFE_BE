@echo off
echo ==========================================
echo Running Unit Tests
echo ==========================================
cd /d "%~dp0.."
call npm run test:unit
if %ERRORLEVEL% NEQ 0 (
    echo Unit tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Unit tests completed successfully!
