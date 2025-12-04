@echo off
echo ==========================================
echo Running Mock Tests
echo ==========================================
cd /d "%~dp0.."
call npm run test:mock
if %ERRORLEVEL% NEQ 0 (
    echo Mock tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Mock tests completed successfully!
