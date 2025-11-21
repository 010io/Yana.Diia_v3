# Yana.Diia Backend Setup Guide

## 🚀 Швидкий старт

### Linux/Mac

\`\`\`bash
# 1. Запустіть setup script
bash scripts/setup-backend.sh

# 2. Заповніть .env
nano .env  # Додайте ANTHROPIC_API_KEY

# 3. Запустіть backend
bash scripts/run-backend.sh
\`\`\`

### Windows

\`\`\`bash
# 1. Запустіть setup script
scripts\setup-backend.bat

# 2. Заповніть .env
# Відредагуйте .env у текстовому редакторі, додайте ANTHROPIC_API_KEY

# 3. Запустіть backend
scripts\run-backend.bat
\`\`\`

## 📋 Вимоги

- Python 3.10+
- pip (встановлюється з Python)
- Git (для клонування Diia repos)
- Anthropic API key (з https://console.anthropic.com/)

## ✅ Перевірка налаштування

Коли backend запущено, перевіріть:

1. **API Docs**: http://localhost:8000/docs
2. **Health Check**: http://localhost:8000/health
3. **Component List**: http://localhost:8000/api/v1/components?limit=5

## 🔧 Структура Backend

\`\`\`
backend/
├── main.py              # FastAPI додаток
├── requirements.txt     # Залежності
├── generation/          # LLM генерація flow
│   └── abn_generator.py # A/B/N тестування
├── evaluation/          # Оцінювання якості
│   └── flow_evaluator.py
├── rag/                 # Vector DB та пошук
│   └── embeddings.py
└── validation/
    └── schemas.py       # Pydantic моделі
\`\`\`

## 📝 Environment Variables

| Змінна | Опис | Обов'язково |
|--------|------|-----------|
| ANTHROPIC_API_KEY | API ключ Claude | Так |
| LLM_MODEL | Модель Claude | Ні (за замовч: claude-sonnet-4) |
| DIIA_REPOS_PATH | Шлях до Diia repos | Ні |
| DEBUG | Режим debug | Ні |

## 🧪 Тестування API

### Generate Flow

\`\`\`bash
curl -X POST "http://localhost:8000/api/v1/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "brd": "Користувач хоче подати документи онлайн",
    "num_variants": 3,
    "design_system": "diia"
  }'
\`\`\`

### List Components

\`\`\`bash
curl "http://localhost:8000/api/v1/components?limit=10"
\`\`\`

### Health Check

\`\`\`bash
curl "http://localhost:8000/health"
\`\`\`

## 🐛 Troubleshooting

### Backend не запускається

\`\`\`bash
# Перевірте Python версію
python --version  # Має бути 3.10+

# Перевірте virtual environment
source venv/bin/activate
pip list  # Мають бути fastapi, uvicorn тощо
\`\`\`

### API Connection Failed

- Перевірте що backend запущено на localhost:8000
- Перевірте firewall налаштування
- Перевірте .env файл існує

### LLM API Errors

- Перевірте ANTHROPIC_API_KEY правильний
- Перевірте що вам хватає kreditu на Anthropic
- Перевірте інтернет з'єднання

## 📚 Посилання

- [Backend Python файли](./user_read_only_context/text_attachments/) - пошукайте lifespan-GBrT8.py
- [Anthropic API Docs](https://docs.anthropic.com/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Diia Open Source](https://github.com/orgs/diia-open-source/)
