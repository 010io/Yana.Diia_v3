@echo off
REM Yana.Diia Backend Setup Script for Windows

echo 🚀 Yana.Diia Backend Setup
echo ==========================

REM 1. Перевірка Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не встановлено
    exit /b 1
)
echo ✅ Python знайдено

REM 2. Створення структури директорій
echo 📁 Створення структури проєкту...
if not exist "backend\generation" mkdir backend\generation
if not exist "backend\validation" mkdir backend\validation
if not exist "backend\evaluation" mkdir backend\evaluation
if not exist "backend\rag" mkdir backend\rag
if not exist "backend\api" mkdir backend\api
if not exist "backend\scripts" mkdir backend\scripts
if not exist "backend\tests" mkdir backend\tests
if not exist "data\diia-repos" mkdir data\diia-repos
if not exist "data\rag-index" mkdir data\rag-index
echo ✅ Структура створена

REM 3. Створення virtual environment
echo 🔧 Створення virtual environment...
python -m venv venv
echo ✅ Virtual environment готовий

REM 4. Активація venv та встановлення залежностей
echo 📦 Встановлення залежностей...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
echo ✅ Залежності встановлені

REM 5. Створення .env файлу
if not exist ".env" (
    echo 📝 Створення .env файлу...
    copy .env.example .env
    echo ⚠️  УВАГА: Заповніть .env файл вашим ANTHROPIC_API_KEY!
)

echo.
echo ✅ Налаштування завершено!
echo.
echo Наступні кроки:
echo 1. Заповніть .env файл вашим API key
echo 2. Запустіть backend: python backend/main.py
echo 3. Перевірте: http://localhost:8000/docs
echo.
