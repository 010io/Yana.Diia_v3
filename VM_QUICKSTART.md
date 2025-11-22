# 🚀 Quick Start для VM

## Швидкий Запуск (5 хвилин)

### 1. Clone Repository

```bash
git clone https://github.com/010io/Yana.Diia_v3.git
cd Yana.Diia_v3
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# ВАЖЛИВО: Створити .env з credentials!
cp .env.example .env
# Редагувати .env (додати справжні credentials)

# Запустити
python main.py
```

Backend запуститься на: **<http://localhost:8001>**

### 3. Frontend Setup (інший terminal)

```bash
# З root папки проекту
npm install
npm run dev
```

Frontend запуститься на: **<http://localhost:3000>**

### 4. Тест

```bash
# Backend health
curl http://localhost:8001/health

# API generate
curl -X POST http://localhost:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Тест"}'
```

## Credentials (.env файл)

Створити `backend/.env`:

```ini
CODEMIE_USERNAME=ilchuknatalia92aihackathon
CODEMIE_PASSWORD=KEHACx1Ed
CODEMIE_API_KEY=sk-m9C3oZ5xO3HqR6qretQivg
CODEMIE_API_URL=https://codemie.lab.epam.com/code-assistant-api

AGENT_FLOW_GENERATOR=58998463-93a5-4c8e-a9dd-c02d4008a25d
AGENT_UI_RENDERER=3d57d2b9-5a89-40fc-96da-cee486894f00

PORT=8001
LOG_LEVEL=DEBUG
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Troubleshooting

**"Module not found: fastapi"**
→ `pip install -r requirements.txt`

**"Missing credentials"**
→ Перевір `backend/.env` існує

**CORS error**
→ Перевір `CORS_ORIGINS` в `.env`

**Backend не запускається**
→ Перевір Python 3.11+: `python --version`
