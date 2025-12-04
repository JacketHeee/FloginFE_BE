@echo off
echo ==========================================
echo Running Performance Tests (Stress + Load)
echo ==========================================
cd /d "%~dp0.."

echo.
echo [1/2] Running Stress Tests...
echo ==========================================
call mvnw.cmd clean test -Dtest="**/*StressTest"
if %ERRORLEVEL% NEQ 0 (
    echo Stress tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Stress tests PASSED!

echo.
echo [2/2] Running Load Tests...
echo ==========================================
call mvnw.cmd test -Dtest="**/*LoadTest"
if %ERRORLEVEL% NEQ 0 (
    echo Load tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Load tests PASSED!

echo.
echo ==========================================
echo All Performance tests completed successfully!
echo ==========================================
pause
