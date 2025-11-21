#!/bin/bash

# Запуск Yana.Diia Backend

set -e

echo "🚀 Запуск Yana.Diia Backend..."

# Активуємо venv
source venv/bin/activate

# Перевіримо .env
if [ ! -f .env ]; then
    echo "❌ .env файл не знайдено"
    echo "Запустіть спочатку: bash scripts/setup-backend.sh"
    exit 1
fi

# Запускаємо backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
