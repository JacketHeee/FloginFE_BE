@echo off
echo ==========================================
echo Running Load Tests Only
echo ==========================================
cd /d "%~dp0.."
call mvnw.cmd clean test -Dtest="**/*LoadTest"
if %ERRORLEVEL% NEQ 0 (
    echo Load tests failed!
    exit /b %ERRORLEVEL%
)
echo.
echo Load tests completed successfully!
