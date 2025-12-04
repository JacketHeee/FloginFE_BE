@echo off
echo ==========================================
echo Opening Cypress E2E Tests
echo ==========================================
cd /d "%~dp0.."
call npm run test:e2eb
