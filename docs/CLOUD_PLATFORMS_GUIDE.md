# 🚀 Безкоштовні Cloud Platforms для Yana.Diia

**Проблема:** Твій ПК не тягне backend (Docker, Ollama, Weaviate).  
**Рішення:** Використовувати безкоштовні cloud платформи!

---

## 🎯 Рекомендовані платформи

### 1. **Render.com** ⭐ НАЙКРАЩЕ для Backend

**Безкоштовний план:**

- 750 годин compute/місяць
- Python 3.11+ підтримка
- Automatic deploys з GitHub
- PostgreSQL database (опціонально)

**Як налаштувати:**

```bash
# 1. Зареєструйся на render.com
# 2. New → Web Service
# 3. Connect GitHub repo: 010io/Yana.Diia_v3
# 4. Налаштування:
#    - Root Directory: backend
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# 5. Environment Variables:
#    LLM_MODE=mock
#    OPENAI_API_KEY=твій_ключ
```

**URL буде:** `https://yana-backend.onrender.com`

---

### 2. **Railway.app** ⚡ Швидке налаштування

**Безкоштовний план:**

- $5 credits/місяць (≈500 годин)
- One-click deploy
- Docker support
- Environment variables

**Як налаштувати:**

```bash
# 1. railway.app/new
# 2. Deploy from GitHub repo
# 3. Add service → Python
# 4. Auto-detect backend/
# 5. Deploy!
```

---

### 3. **Fly.io** 🪂 Для Docker

**Безкоштовний план:**

- 3 shared-cpu VMs
- 160GB outbound data
- Docker native

**Dockerfile для backend:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

### 4. **GitHub Actions** 🤖 (Що ти знайшов)

**Безкоштовно:**

- 2000 хвилин/місяць
- Ubuntu/Windows/macOS runners
- 14 GB RAM, 2 CPU cores

**Для чого використовувати:**

- ✅ CI/CD pipeline
- ✅ Automated testing
- ✅ Build та deployment
- ❌ НЕ для "live" backend (тільки jobs)

**Активація:**

1. Файл вже створений: `.github/workflows/ci-cd.yml`
2. Push до GitHub
3. Actions → дивись прогрес

---

### 5. **Vercel Serverless Functions** 🔥 (Найпростіше)

**Безкоштовно:**

- 100GB bandwidth
- 1000 serverless executions
- Автоматичний deploy

**Створи API routes в Next.js:**

```typescript
// app/api/generate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { brd } = await request.json();
  
  // Mock response для Demo Day
  return NextResponse.json({
    variants: [
      { id: 1, flow: {...}, score: 95 },
      { id: 2, flow: {...}, score: 92 },
      { id: 3, flow: {...}, score: 88 }
    ]
  });
}
```

---

## 🎯 Моя Рекомендація для Demo Day

### Стратегія "Zero Infrastructure"

**Використай:**

1. **Vercel** - Frontend (вже працює ✅)
2. **Mock Mode** - Backend simulation (вже налаштований ✅)
3. **GitHub Actions** - CI/CD (файл створений ✅)

**Чому:**

- ✅ 0 витрат
- ✅ 100% uptime
- ✅ Швидкі responses
- ✅ Не залежить від зовнішніх сервісів
- ✅ Показує архітектуру через документацію

---

## 🔧 Якщо все ж хочеш LIVE backend

### Варіант A: Render.com (Рекомендую)

```bash
# 1. Створи render.yaml
services:
  - type: web
    name: yana-backend
    env: python
    region: frankfurt  # Closest to Ukraine
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: LLM_MODE
        value: mock
      - key: OPENAI_API_KEY
        sync: false  # Add manually in dashboard
```

### Варіант B: Railway.app

```bash
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
```

---

## 📊 Порівняльна Таблиця

| Platform | Free Tier | Deployment | Docker | Best For |
|----------|-----------|------------|--------|----------|
| **Vercel** | Unlimited | Auto | ❌ | Frontend |
| **Render** | 750h/mo | Auto | ✅ | **Backend ⭐** |
| **Railway** | $5/mo | Auto | ✅ | Quick setup |
| **Fly.io** | 3 VMs | Manual | ✅ | Docker apps |
| **GitHub Actions** | 2000 min/mo | Auto | ✅ | CI/CD only |

---

## 🎬 План Дій

### Для Demo Day (Завтра можна)

1. ✅ Залишити Mock Mode
2. ✅ Показати архітектуру через docs
3. ✅ Live demo фронтенду
4. ✅ Konami Code wow-ефект

### Після хакатону (Якщо виграєш)

1. Deploy backend на Render.com
2. Підключити OpenAI API
3. Налаштувати Weaviate на Weaviate Cloud
4. GitHub Actions для auto-deploy

---

## 🚀 Швидкий старт з Render.com

```bash
# 1. Створи акаунт
https://render.com/register

# 2. New Web Service
https://dashboard.render.com/select-repo?type=web

# 3. Select repo: 010io/Yana.Diia_v3

# 4. Settings:
Name: yana-backend
Region: Frankfurt
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

# 5. Environment:
LLM_MODE=mock

# 6. Create Web Service → Deploy!
```

**За 3-5 хвилин отримаєш:**

- Live backend URL
- Auto SSL certificate
- Automatic deploys
- Logs та monitoring

---

## ✅ Висновок

**Для Demo Day:** Mock Mode = ідеально 🏆

**Для production:** Render.com = найкраще 🚀

**Для CI/CD:** GitHub Actions вже налаштований ✅

---

**Твоя архітектура вже крута!**  
**Тепер вона ще й безкоштовна!** 💪🇺🇦
