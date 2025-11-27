# 🚨 VERCEL DEPLOYMENT FIX - Критичні Виправлення

**Дата:** 23.11.2025, 13:35 EET  
**Статус:** 🔴 URGENT - Сайт недоступний  
**Приоритет:** P0 (Critical)

---

## ✅ Виконані виправлення

### 1. **Next.js Downgrade** ✅

**Проблема:** Next.js 16.0.3 несумісний з Vercel builder  
**Виправлення:** Downgrade до 15.0.3 (стабільна версія)

```json
// package.json - BEFORE
"next": "^16.0.3"
"react": "^19.2.0"

// package.json - AFTER  
"next": "15.0.3"
"react": "^19.0.0"
```

**Дії:**

```bash
# Оновити залежності
npm install next@15.0.3 react@19.0.0 react-dom@19.0.0
```

### 2. **Vercel.json Покращення** ✅

**Проблема:** Базова конфігурація без routing та ignores  
**Виправлення:** Додано:

- ✅ Rewrites для SPA routing
- ✅ Security headers
- ✅ Environment variables
- ✅ Ignore backend/blockchain changes (не тригерять rebuild)

```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./backend ./blockchain ./ml",
  "rewrites": [{"source": "/(.*)", "destination": "/"}],
  "headers": [...security headers...],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://yana-diia-v3.vercel.app",
    "NODE_ENV": "production"
  }
}
```

---

## 🔧 Негайні дії (зараз)

### **Step 1: Оновити залежності**

```bash
cd c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3

# Видалити old node_modules та lock
rm -rf node_modules package-lock.json

# Встановити з новими версіями
npm install
```

### **Step 2: Тест локального build**

```bash
# Build для production
npm run build

# Якщо успішно, запустити production server
npm start

# Відкрити http://localhost:3000 та перевірити
```

### **Step 3: Commit і push виправлення**

```bash
git add package.json vercel.json
git commit -m "fix: downgrade Next.js to 15.0.3 for Vercel compatibility"
git push origin main
```

**Vercel автоматично задеплоїть нову версію!**

---

## 📊 Діагностика (якщо все ще не працює)

### **Перевірте Vercel Dashboard**

1. Відкрийте: <https://vercel.com/010io/yana-diia-v3>
2. **Build Logs** - шукайте помилки:
   - ❌ "Module not found"
   - ❌ "Build failed"
   - ❌ "NEXT_PUBLIC_ env missing"

### **Типові помилки та рішення**

#### Помилка: "Build command exited with 1"

**Рішення:**

```bash
# Додайте до package.json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
}
```

#### Помилка: "Module not found: Can't resolve '@/...'"

**Рішення:** Перевірте `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### Помилка: "404 on all routes"

**Рішення:** Вже виправлено в `vercel.json` через rewrites

---

## 🔐 Security Fixes

### **Backend .env.example** ✅

**Статус:** SAFE - містить лише placeholders  
**Перевірено:**

- `OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx` ✅ Placeholder
- `CODEMIE_PASSWORD=your_password` ✅ Placeholder

**Нічого видаляти з Git history не потрібно** - реальні credentials в `.env` (який в `.gitignore`)

---

## 🎯 Environment Variables для Vercel

### **В Vercel Dashboard → Settings → Environment Variables додайте:**

```bash
# Production URLs
NEXT_PUBLIC_APP_URL=https://yana-diia-v3.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://yana-backend.railway.app  # Якщо backend окремо

# Mode (Mock для Demo Day)
NEXT_PUBLIC_LLM_MODE=mock
NEXT_PUBLIC_MOCK_REGISTRIES=true

# Node environment
NODE_ENV=production
```

**НЕ додавайте backend credentials** (OpenAI key, etc.) - вони тільки для backend сервера!

---

## 🚀 Alternative: Railway Deploy (якщо Vercel fails)

### **Option A: Railway (Full-Stack)**

```bash
# Install Railway CLI
npm i -g railway

# Login
railway login

# Deploy
railway up
```

### **Option B: Local Demo для презентації**

```bash
# Запустити локально
npm run dev

# Використати ngrok для публічного URL
npx ngrok http 3000
```

---

## ✅ Success Checklist

- [ ] `npm install` успішний
- [ ] `npm run build` без помилок
- [ ] `npm start` працює локально (<http://localhost:3000>)
- [ ] Git push виконаний
- [ ] Vercel автоматично задеплоїв
- [ ] <https://yana-diia-v3.vercel.app> ДОСТУПНИЙ ✅

---

## 📞 Якщо потрібна допомога

### Debug команди

```bash
# Перевірити build локально
npm run build 2>&1 | tee build-log.txt

# Перевірити Vercel status
npx vercel ls

# Force redeploy
npx vercel --prod --force
```

### Vercel Support

- Dashboard: <https://vercel.com/010io/yana-diia-v3>
- Logs: Deployments → Latest → Build Logs
- Settings: Project Settings → Build & Development Settings

---

## ⏱️ Timeline

**Виконано:** 23.11.2025, 13:35 EET  
**Очікуваний час деплою:** 3-5 хвилин після push  
**До Demo Day:** 5.7 днів  

---

**Статус:** 🟡 FIXES APPLIED - Waiting for npm install + push  
**Next:** Verify deployment success
