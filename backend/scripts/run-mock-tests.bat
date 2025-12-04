@echo off
echo ==========================================
echo Running Mock Tests
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="**/*MockTest"
if %ERRORLEVEL% NEQ 0 (
    echo Mock tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Mock tests completed successfully!
