#!/bin/bash

# Yana.Diia Backend Setup Script
# Автоматичне налаштування backend середовища

set -e

echo "🚀 Yana.Diia Backend Setup"
echo "=========================="

# 1. Перевірка Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не встановлено"
    exit 1
fi
echo "✅ Python3 знайдено"

# 2. Створення структури директорій
echo "📁 Створення структури проєкту..."
mkdir -p backend/{generation,validation,evaluation,rag,api,scripts,tests}
mkdir -p data/{diia-repos,rag-index}
echo "✅ Структура створена"

# 3. Створення virtual environment
echo "🔧 Створення virtual environment..."
python3 -m venv venv
echo "✅ Virtual environment готовий"

# 4. Активація venv та встановлення залежностей
echo "📦 Встановлення залежностей..."
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
echo "✅ Залежності встановлені"

# 5. Створення .env файлу
if [ ! -f .env ]; then
    echo "📝 Створення .env файлу..."
    cp .env.example .env
    echo "⚠️  УВАГА: Заповніть .env файл вашим ANTHROPIC_API_KEY!"
fi

echo ""
echo "✅ Налаштування завершено!"
echo ""
echo "Наступні кроки:"
echo "1. Заповніть .env файл вашим API key"
echo "2. Запустіть backend: python backend/main.py"
echo "3. Перевірте: http://localhost:8000/docs"
echo ""
