@echo off
echo ========================================
echo Yana.Diia.AI Backend - Quick Start
echo ========================================
echo.

:: Check if venv exists
if not exist "venv\" (
    echo [1/3] Creating virtual environment...
    python -m venv venv
) else (
    echo [1/3] Virtual environment already exists
)

:: Activate venv
echo [2/3] Activating environment...
call venv\Scripts\activate

:: Install dependencies
if not exist "venv\Lib\site-packages\fastapi\" (
    echo [3/3] Installing dependencies...
    pip install -r requirements.txt
) else (
    echo [3/3] Dependencies already installed
)

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.
echo Server will run on: http://localhost:8001
echo API Documentation: http://localhost:8001/docs
echo.
echo Press Ctrl+C to stop
echo.

:: Start server
python main.py
