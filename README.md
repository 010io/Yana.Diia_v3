# Yana.Diia | AI-Асистент для Державних Послуг 🇺🇦

![Yana.Diia Banner](https://raw.githubusercontent.com/Be-Transparent/Yana.Diia/main/public/banner.png)

**Provider-agnostic AI платформа для автоматизації дизайну цифрових послуг Дія.**
Скорочуємо час розробки з 2-5 днів до 1-2 годин за допомогою AI та Diia Design System.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Diia Design System](https://img.shields.io/badge/Diia-Design%20System-black)](https://diia.gov.ua)
[![Status](https://img.shields.io/badge/Status-Beta-blue)](https://yana-diia-v3.vercel.app)

## 🚀 Функціонал

### 🧱 Lego-Diia Constructor (Dual Mode)

![LEGO-Diia Concept](assets/images/lego-diia-concept.jpg)

> *Київ 2077 × Diia.AI HUB — модульна збірка державних сервісів*

Візуальний конструктор для збірки державних послуг з готових компонентів.

**🚀 Hackathon Mode:**
- HTML/CSS mockups за секунди
- Figma-ready експорт
- Інтерактивні прототипи для демо

**🏭 Production Mode:**
- Next.js/React компоненти
- Інтеграція з NAIS, YouControl, Data.gov.ua
- Docker-ready deployment

**Можливості:**
- Drag-and-drop інтерфейс
- 50+ компонентів Diia Design System
- Експорт в JSON/React/Figma
- Blockchain audit trail

📖 [Детальна документація LEGO Dual Mode](docs/LEGO_DUAL_MODE.md)

### ⚡ AI Pipeline

Генерація user flows на основі текстового опису (BRD).

- Dual-LLM архітектура (Generator + Judge)
- Автоматична валідація логіки
- Підтримка складних сценаріїв

### 📊 Flow Evaluation

Автоматична оцінка якості прототипів.

- Перевірка WCAG 2.1 (AA/AAA)
- Відповідність Diia Design System
- Оцінка мінімалізму та зрозумілості

## 🛠 Технологічний Стек

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Shadcn/UI
- **Backend:** Python, FastAPI (Port 8001)
- **AI:** OpenAI GPT-4, Llama 3.1
- **Design System:** Diia Design System (Official)

## 📦 Встановлення та Запуск

### Frontend

```bash
npm install
npm run dev
# Відкрийте http://localhost:3000
```

### Backend

Див. [BACKEND_SETUP.md](BACKEND_SETUP.md) для деталей.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # або venv\Scripts\activate
pip install -r requirements.txt
python -m yana_diia.main
```

## 🤝 Команда Be-Transparent

- **Volodymyr Seferov** - Architecture & AI
- **Igor Omelchenko** - Frontend & Integration

## 📄 Ліцензія

MIT License. See [LICENSE](LICENSE) for details.
