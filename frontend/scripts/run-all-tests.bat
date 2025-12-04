@echo off
echo ==========================================
echo Running ALL Frontend Tests Sequentially
echo ==========================================
cd /d "%~dp0.."

echo.
echo [1/4] Running Unit Tests...
echo ==========================================
call npm run test:unit
if %ERRORLEVEL% NEQ 0 (
    echo Unit tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Unit tests PASSED!

echo.
echo [2/4] Running Integration Tests...
echo ==========================================
call npm run test:integration
if %ERRORLEVEL% NEQ 0 (
    echo Integration tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Integration tests PASSED!

echo.
echo [3/4] Running Mock Tests...
echo ==========================================
call npm run test:mock
if %ERRORLEVEL% NEQ 0 (
    echo Mock tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Mock tests PASSED!

echo.
echo [4/4] Running Coverage Tests...
echo ==========================================
call npm run test:coverage
if %ERRORLEVEL% NEQ 0 (
    echo Coverage tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Coverage tests PASSED!

echo.
echo ==========================================
echo ALL TESTS COMPLETED SUCCESSFULLY!
echo ==========================================
echo.
echo Note: E2E tests (Cypress) must be run separately
echo Run 'npm run test:e2eb' to open Cypress
echo.
