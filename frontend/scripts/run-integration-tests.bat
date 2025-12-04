@echo off
echo ==========================================
echo Running Integration Tests
echo ==========================================
cd /d "%~dp0.."
call npm run test:integration
if %ERRORLEVEL% NEQ 0 (
    echo Integration tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Integration tests completed successfully!
