@echo off
echo ==========================================
echo Running Integration Tests
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="**/*IntegrationTest"
if %ERRORLEVEL% NEQ 0 (
    echo Integration tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Integration tests completed successfully!
pause
