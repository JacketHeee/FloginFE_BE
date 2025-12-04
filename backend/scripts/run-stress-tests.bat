@echo off
echo ==========================================
echo Running Stress Tests Only
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="**/*StressTest"
if %ERRORLEVEL% NEQ 0 (
    echo Stress tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Stress tests completed successfully!
