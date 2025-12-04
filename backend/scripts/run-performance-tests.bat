@echo off
echo ==========================================
echo Running Performance Tests
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="**/*PerformanceTest"
if %ERRORLEVEL% NEQ 0 (
    echo Performance tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Performance tests completed successfully!
pause
