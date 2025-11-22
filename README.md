# 🇺🇦 Yana.Diia - AI для Цифрових Архітекторів України

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)

> AI-асистент для автоматизації дизайну державних цифрових послуг  
> **Скорочує час розробки з 2-5 днів до 1-2 годин**

🌐 **Demo**: [be-transparent.github.io/Yana.Diia](https://be-transparent.github.io/Yana.Diia)  
📚 **Документація**: [docs/](./docs/)  
🏆 **Diia.AI Contest 2025**

---

## 📋 Зміст

- [Про Проєкт](#-про-проєкт)
- [Можливості](#-можливості)
- [Архітектура](#-архітектура)
- [Швидкий Старт](#-швидкий-старт)
- [Технології](#-технології)
- [Структура Проєкту](#-структура-проєкту)
- [API Документація](#-api-документація)
- [Deployment](#-deployment)
- [Команда](#-команда)
- [Ліцензія](#-ліцензія)

---

## 🎯 Про Проєкт

**Yana.Diia** — це AI-платформа для автоматизації проєктування державних цифрових послуг України. Система аналізує бізнес-вимоги та автоматично генерує:

- 📊 **User Flow діаграми** — візуалізація шляху користувача
- 🎨 **UI прототипи** — готові інтерфейси з Diia Design System
- 📝 **Технічну документацію** — специфікації для розробників
- ✅ **Тести доступності** — WCAG 2.1 AA compliance

### Цільова Аудиторія

- 🏛️ **Мінцифра** — швидке прототипування нових послуг
- 💼 **EPAM та партнери** — автоматизація дизайн-процесів
- 👨‍💻 **Розробники** — готові специфікації для імплементації
- 🎨 **Дизайнери** — базові прототипи для доопрацювання

---

## ✨ Можливості

### Core Features

- 🤖 **AI-генерація flows** — автоматичне створення user journeys
- 🎨 **Diia Design System** — відповідність державним стандартам
- ♿ **WCAG 2.1 AA** — автоматична перевірка доступності
- 🌐 **Multimodal Input** — текст, голос, скріншоти, PDF, Figma
- 📊 **A/B/N Testing** — порівняння варіантів flows
- 🔄 **Real-time Preview** — миттєвий перегляд результатів

### Power Features

- 🔌 **Chrome Extension** — генерація з будь-якої сторінки
- 💬 **Feedback Hub** — збір відгуків користувачів
- 🔗 **API Integration** — інтеграція з існуючими системами
- 📱 **Mobile-First** — адаптивні прототипи
- 🔒 **Privacy by Design** — безпека даних користувачів
- 🌍 **i18n Ready** — підтримка української та англійської

---

## 🏗️ Архітектура

### 5-рівнева LLMOps Pipeline

```
┌─────────────────────────────────────────────────────────┐
│  1. Input Modality Layer                                │
│     • Text, Voice, Screenshots, PDF, Figma              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. Intent Recognition & Context Extraction             │
│     • NLP Analysis • Entity Recognition                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. Flow Generation Engine (CodeMie SDK)                │
│     • Agent 1: Flow Structure                           │
│     • Agent 2: UI Rendering                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. Flow Evaluator with A/B/N Testing                   │
│     • Efficiency • WCAG • Diia DS • UX • Security       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. Output Serialization                                │
│     • JSON, YAML, Figma, API                            │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Diia Design System

**Backend**:
- FastAPI (Python 3.11+)
- Pydantic v2
- Structlog
- HTTPX (async)

**AI/ML**:
- EPAM CodeMie SDK
- LangChain
- OpenAI API (fallback)

**Infrastructure**:
- Docker
- Vercel (Frontend)
- AWS/Azure (Backend)
- GitHub Actions (CI/CD)

---

## 🚀 Швидкий Старт

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/your-org/Yana.Diia_v3.git
cd Yana.Diia_v3
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials:
# - CODEMIE_USERNAME
# - CODEMIE_PASSWORD
# - CODEMIE_API_KEY

# Run backend
python main.py
```

Backend буде доступний на `http://localhost:8001`

### 3. Frontend Setup

```bash
cd ..  # Back to root

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local if needed

# Run development server
npm run dev
```

Frontend буде доступний на `http://localhost:3000`

### 4. Verify Installation

```bash
# Test backend
curl http://localhost:8001/health

# Test CodeMie integration
curl http://localhost:8001/api/status

# Test generation
curl -X POST http://localhost:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Створити форму реєстрації у Дія"}'
```

---

## 🛠️ Технології

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.115+ | REST API framework |
| Pydantic | 2.9+ | Data validation |
| Structlog | 24.1+ | Structured logging |
| HTTPX | 0.27+ | Async HTTP client |
| CodeMie SDK | latest | AI generation |

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14 | React framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| Radix UI | latest | Components |

---

## 📁 Структура Проєкту

```
Yana.Diia_v3/
├── backend/                 # FastAPI Backend
│   ├── config/             # Settings & configuration
│   ├── models/             # Pydantic models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── utils/              # Helpers & utilities
│   ├── main.py             # App entry point
│   └── requirements.txt    # Python dependencies
│
├── app/                    # Next.js App Router
│   ├── (platform)/         # Platform pages
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
│
├── components/             # React components
│   ├── ui/                 # UI primitives
│   └── ...                 # Feature components
│
├── lib/                    # Shared libraries
│   ├── llm/                # LLM providers
│   ├── quantum/            # Quantum optimization
│   └── blockchain/         # Blockchain integration
│
├── docs/                   # Documentation
├── .kiro/                  # Kiro AI memory & specs
└── README.md               # This file
```

---

## 📚 API Документація

### Endpoints

#### Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "service": "yana-diia-backend",
  "version": "1.0.0",
  "timestamp": "2025-11-22T19:00:00Z"
}
```

#### Generate Flow + UI
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Створити форму реєстрації у Дія з полями: ім'я, email, телефон"
}
```

**Response**:
```json
{
  "flow": {
    "id": "flow_001",
    "name": "Реєстрація у Дія",
    "steps": [...]
  },
  "ui": "<div>...</div>",
  "status": "ready",
  "prompt": "..."
}
```

#### Service Status
```http
GET /api/status
```

**Response**:
```json
{
  "codemie_available": true,
  "agent_flow_id": "58998463-...",
  "agent_ui_id": "3d57d2b9-...",
  "api_url": "https://codemie.lab.epam.com/..."
}
```

Повна документація: [docs/API.md](./docs/API.md)

---

## 🚢 Deployment

### Docker

```bash
# Build
docker build -t yana-diia .

# Run
docker run -p 3000:3000 -p 8001:8001 yana-diia
```

### Vercel (Frontend)

```bash
vercel deploy
```

### AWS/Azure (Backend)

```bash
# See docs/DEPLOYMENT.md for detailed instructions
```

---

## 👥 Команда

**Antigravity Team** — Diia.AI Contest 2025

- 🎯 **Product Lead** — Volodymyr Seferov
- 💻 **Tech Lead** — [Your Name]
- 🎨 **Design Lead** — [Your Name]
- 🤖 **AI Engineer** — [Your Name]

---

## 📄 Ліцензія

MIT License - see [LICENSE](./LICENSE) file for details

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 📞 Підтримка

- 📧 Email: team@yanadia.gov.ua
- 💬 Discord: [Join our server](#)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/Yana.Diia_v3/issues)

---

## 🗺️ Roadmap

- [x] Core AI generation pipeline
- [x] Backend API (FastAPI)
- [x] Frontend UI (Next.js)
- [ ] Chrome Extension
- [ ] Real-time collaboration
- [ ] Advanced A/B testing
- [ ] Mobile app

---

**Слава Україні!** 🇺🇦

Made with ❤️ for Ukraine's Digital Transformation
