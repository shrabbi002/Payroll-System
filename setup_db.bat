@echo off
REM ============================================
REM PayrollPro Database Setup Script
REM Run this once to create the DB, migrate, and seed
REM ============================================

set PATH=C:\Program Files\PostgreSQL\18\bin;%PATH%

REM Prompt for postgres password
set /p PGPASSWORD="Enter PostgreSQL postgres password: "

echo.
echo [1/4] Creating database payroll_db...
psql -U postgres -c "CREATE DATABASE payroll_db;" 2>nul
if %ERRORLEVEL% == 0 (
    echo       Database created successfully.
) else (
    echo       Database may already exist, continuing...
)

echo.
echo [2/4] Running Django migrations...
cd /d D:\payroll\backend
python manage.py migrate

echo.
echo [3/4] Seeding initial data...
python manage.py seed_data

echo.
echo [4/4] Starting Django server on port 8000...
echo       Press Ctrl+C to stop.
python manage.py runserver 0.0.0.0:8000

pause
