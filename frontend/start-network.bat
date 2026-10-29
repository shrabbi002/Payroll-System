@echo off
cd /d "%~dp0"
echo ==============================================
echo Starting PayrollPro on Local Network (0.0.0.0:3001)
echo ==============================================
call npx next dev -H 0.0.0.0 -p 3001
pause
