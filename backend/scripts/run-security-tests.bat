@echo off
echo ==========================================
echo Running Security Vulnerability Tests
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="SecurityVulnerabilityTest"
if %ERRORLEVEL% NEQ 0 (
    echo Security tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Security vulnerability tests completed successfully!
