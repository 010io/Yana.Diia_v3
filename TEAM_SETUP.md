# 🚀 Швидкий Старт для Команди BeTransparent

## Як Підключитись до Проекту

### Крок 1: Clone Repository

```bash
git clone https://github.com/{your-username}/Yana.Diia_v3.git
cd Yana.Diia_v3
```

### Крок 2: Backend (Python FastAPI)

```bash
cd backend

# Створити віртуальне середовище
python -m venv venv

# Активувати (Windows)
venv\Scripts\activate

# Активувати (Mac/Linux)
source venv/bin/activate

# Встановити залежності
pip install -r requirements.txt

# Створити .env з credentials
cp .env.example .env

# Запустити backend
python main.py
```

**Backend доступний:** `http://localhost:8001`

### Крок 3: Frontend (Next.js)

```bash
# З root папки проекту
npm install

# Запустити dev server
npm run dev
```

**Frontend доступний:** `http://localhost:3000` (або 3001 якщо 3000 зайнятий)

---

## 🔑 Доступи для Команди

### CodeMie SDK Credentials (вже в .env.example)

```
Username: <your_username>
Password: <your_password>
API Key: <your_api_key>
```

**Агенти:**

- Flow Generator: `58998463-93a5-4c8e-a9dd-c02d4008a25d`
- UI Renderer: `3d57d2b9-5a89-40fc-96da-cee486894f00`

---

## 🧪 Тестування

### Backend Test

```bash
# Health check
curl http://localhost:8001/health

# Generate endpoint
curl -X POST http://localhost:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Створити форму реєстрації"}'
```

### Frontend Test

Відкрий браузер: `http://localhost:3000`

---

## 📁 Структура Проекту

```
Yana.Diia_v3/
├── backend/              # Python FastAPI
│   ├── main.py          # Сервер
│   ├── services/        # CodeMie integration
│   └── routes/          # API endpoints
├── app/                 # Next.js pages
├── components/          # React компоненти
├── lib/                 # Utilities
└── public/             # Статичні файли
```

---

## ⚠️ Troubleshooting

**"Backend не запускається"**
→ Перевір `.env` існує та має правильні credentials

**"Frontend показує помилки"**
→ Запусти `npm install` ще раз

**"Port вже зайнятий"**
→ Frontend автоматично використає наступний вільний порт

**"Missing modules"**
→ Це нормально для dev mode, сайт працюватиме

---

## 👥 Робота у Команді

### Git Workflow

```bash
# Створити нову гілку
git checkout -b feature/your-feature-name

# Зробити зміни і commit
git add .
git commit -m "feat: опис змін"

# Push на GitHub
git push origin feature/your-feature-name

# Створити Pull Request на GitHub
```

### Не комітити

- ❌ `.env` файли (секрети!)
- ❌ `venv/` (Python environment)
- ❌ `node_modules/`
- ❌ `.next/` (build artifacts)

---

## 📞 Контакти

**Питання?** Пиши в Telegram групу команди

**Проблеми?** Створюй Issue на GitHub

---

**Готово! 🎯 Можеш починати розробку!**
