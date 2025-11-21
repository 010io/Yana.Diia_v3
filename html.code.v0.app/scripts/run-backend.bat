@echo off
REM Запуск Yana.Diia Backend (Windows)

echo 🚀 Запуск Yana.Diia Backend...

REM Активуємо venv
call venv\Scripts\activate.bat

REM Перевіримо .env
if not exist ".env" (
    echo ❌ .env файл не знайдено
    echo Запустіть спочатку: bash scripts/setup-backend.sh
    exit /b 1
)

REM Запускаємо backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
