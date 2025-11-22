# Yana.Diia.AI Backend

AI Generator прототипів державних послуг з інтеграцією CodeMie SDK

## Швидкий Старт

### 1. Встановити залежності

```bash
cd backend
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Налаштувати .env

Створи `.env` файл (або скопіюй з `.env.example`):

```bash
cp .env.example .env
```

**Важливо:** Перевір credentials в `.env`:

- `CODEMIE_USERNAME` - логін команди
- `CODEMIE_PASSWORD` - пароль  
- `CODEMIE_API_KEY` - API ключ

### 3. Запустити сервер

```bash
python main.py
```

Або через uvicorn:

```bash
uvicorn main:app --reload --port 8001
```

Сервер буде доступний на: `http://localhost:8001`

## API Endpoints

### POST /api/generate

Генерує flow та UI з промпту.

**Request:**

```json
{
  "prompt": "Створити форму для реєстрації у Дія"
}
```

**Response:**

```json
{
  "flow": {
    "id": "flow_001",
    "name": "Реєстрація у Дія",
    "steps": [...]
  },
  "ui": "<div class='min-h-screen'>...</div>",
  "status": "ready",
  "prompt": "Створити форму для реєстрації у Дія"
}
```

**Curl приклад:**

```bash
curl -X POST http://localhost:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Створити форму для реєстрації у Дія"}'
```

### GET /health

Health check endpoint.

### GET /api/status

Перевірка доступності CodeMie SDK.

## Структура Проекту

```
backend/
├── main.py                 # FastAPI app
├── routes/
│   ├── __init__.py
│   └── generate.py         # /api/generate endpoint
├── services/
│   ├── __init__.py
│   └── codemie_service.py  # CodeMie SDK integration
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
└── .env                   # Local credentials (DO NOT COMMIT!)
```

## Розробка

### Mock Mode

За замовчуванням `codemie_service.py` використовує **mock responses** для тестування без витрат на API.

Щоб увімкнути справжній CodeMie SDK:

1. Встанови SDK: `pip install codemie-sdk-python`
2. Розкоментуй код в `services/codemie_service.py` (рядки 36-43, 58-63, 109-113)
3. Перезапусти sервер

### Логування

Структуроване логування через `structlog`:

- JSON format
- DEBUG level за замовчуванням
- Змінити: `LOG_LEVEL=info` в `.env`

### Тестування

```bash
# Unit tests (якщо будуть створені)
pytest tests/

# Manual test
curl http://localhost:8001/api/generate -d '{"prompt":"test"}'
```

## Troubleshooting

### "CodeMie service not available"

- Перевір credentials в `.env`
- Перевір що `.env` файл існує
- Перезапусти сервер

### "CORS error"

- Додай origin в `.env`: `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`

### "Module not found"

- Переконайся що venv активований
- Встанови залежності: `pip install -r requirements.txt`

## Demo Day Checklist

- [x] FastAPI backend створено
- [x] CodeMie service інтегровано
- [x] Mock responses для demo
- [x] Error handling
- [x] Logging
- [ ] Справжні CodeMie SDK виклики (після тестування)
- [ ] Rate limiting
- [ ] Caching (якщо потрібно)

## Контакти

Команда: **BeTransparent**  
Дедлайн: **23 листопада 2025, 10:00**
