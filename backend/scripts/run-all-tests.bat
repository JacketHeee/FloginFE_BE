@echo off
echo ==========================================
echo Running ALL Tests Sequentially
echo ==========================================
cd /d "%~dp0.."

echo.
echo [1/4] Running Unit Tests...
echo ==========================================
call mvnw.cmd clean test -Dtest="**/*UnitTest"
if %ERRORLEVEL% NEQ 0 (
    echo Unit tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Unit tests PASSED!

echo.
echo [2/4] Running Integration Tests...
echo ==========================================
call mvnw.cmd test -Dtest="**/*IntegrationTest"
if %ERRORLEVEL% NEQ 0 (
    echo Integration tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Integration tests PASSED!

echo.
echo [3/4] Running Mock Tests...
echo ==========================================
call mvnw.cmd test -Dtest="**/*MockTest"
if %ERRORLEVEL% NEQ 0 (
    echo Mock tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Mock tests PASSED!

echo.
echo [4/4] Running Performance Tests...
echo ==========================================
call mvnw.cmd test -Dtest="**/*PerformanceTest"
if %ERRORLEVEL% NEQ 0 (
    echo Performance tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Performance tests PASSED!

echo.
echo ==========================================
echo ALL TESTS COMPLETED SUCCESSFULLY!
echo ==========================================
echo.
echo Summary:
echo   - Unit Tests: PASSED
echo   - Integration Tests: PASSED
echo   - Mock Tests: PASSED
echo   - Performance Tests: PASSED
echo.
pause
