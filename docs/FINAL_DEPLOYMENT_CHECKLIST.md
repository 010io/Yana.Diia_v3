# ✅ FINAL DEPLOYMENT CHECKLIST

**Дата:** 23.11.2025, 14:01 EET  
**Статус:** 🔴 Потребує виконання команд

---

## 📋 Що змінено (готово до commit)

### Критичні виправлення

- ✅ `package.json` - Next.js 16.0.3 → 15.0.3 (Vercel compatibility)
- ✅ `vercel.json` - Enhanced з rewrites, headers, env vars
- ✅ Backend: Mock Registry API (6 endpoints)
- ✅ Backend: MCP Server (3 AI tools)
- ✅ Backend: Judge Module (Diia Scoring Rubric)
- ✅ Backend: Weaviate schemas
- ✅ Backend: Docker Compose для infrastructure
- ✅ Документація: 10+ MD файлів

---

## 🚀 КОМАНДИ ДЛЯ ВИКОНАННЯ (по порядку)

### STEP 1: Локальний тест (5-10 хвилин)

```powershell
# Перейти в проєкт
cd c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3

# Видалити старі залежності
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue

# Встановити з НОВИМИ версіями (Next.js 15.0.3)
npm install

# Перевірити що встановилося правильно
npm list next react react-dom
# Expected: next@15.0.3, react@19.0.0, react-dom@19.0.0

# Build для production
npm run build

# Якщо build УСПІШНИЙ - запустити локально
npm start
# Відкрити http://localhost:3000 в браузері
```

**Якщо build FAILED:**

- Скопіюй помилку
- Я виправлю

**Якщо build SUCCESS:**

- Перевір <http://localhost:3000> - має відкритися сторінка
- Переходь до STEP 2

---

### STEP 2: Git Commit і Push (2 хвилини)

**ЛИШЕ якщо Step 1 успішний!**

```powershell
# Перевірити що змінилося
git status

# Додати ВСІ зміни
git add .

# Commit з описом виправлень
git commit -m "fix: Vercel deployment - downgrade Next.js to 15.0.3, enhance config, add backend infrastructure

- Downgrade Next.js from 16.0.3 to 15.0.3 for Vercel compatibility
- Enhanced vercel.json with rewrites, security headers, ignores
- Added Mock Registry API (6 government endpoints)
- Added MCP Server with 3 AI tools (Component Search, API Caller, Flow Validator)
- Added Judge Module with Diia Flow Scoring Rubric
- Added Weaviate schemas (DiiaFlows, DiiaComponents, APIMock)
- Added Docker Compose for Weaviate + Ollama
- Added comprehensive documentation (Phase 1-2-3 setup, operational plan)
- Created Vercel CLI diagnostic scripts"

# Push до GitHub (Vercel автоматично задеплоїть)
git push origin main
```

**Після push:**

- Vercel автоматично почне build (3-5 хвилин)
- Переходь до STEP 3

---

### STEP 3: Перевірка Vercel Deployment (3 хвилини)

**Через 3-5 хвилин після push:**

```powershell
# Швидка перевірка статусу
.\quick-deploy-check.ps1

# Або повна діагностика
.\check-vercel-status.ps1
```

**Альтернатива (без скрипта):**

```powershell
# Список deployments
npx vercel ls --yes

# Логи останнього deployment
npx vercel logs --yes
```

**Очікуваний результат:**

```
✅ Status: Ready
✅ Build: Success
✅ URL: https://yana-diia-v3.vercel.app
```

**Якщо помилки:**

- Скопіюй логи з `npx vercel logs`
- Відправ мені - я допоможу

---

### STEP 4: Фінальна перевірка (1 хвилина)

```powershell
# Перевірити що сайт ДОСТУПНИЙ
curl https://yana-diia-v3.vercel.app

# Або просто відкрити в браузері:
start https://yana-diia-v3.vercel.app
```

**Очікуваний результат:**

- Сторінка завантажується ✅
- Немає 404 помилки ✅
- UI відображається ✅

---

## 🎯 Швидкий Шлях (якщо впевнений)

Якщо ти впевнений що все ОК, можна одразу:

```powershell
# All-in-one
cd c:\igor\Antigravity.exe.Workspace.Project\ДІЯ\01_Projects\Yana.Diia_v3
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
npm start  # Перевір localhost:3000

# Якщо працює - Ctrl+C і push:
git add .
git commit -m "fix: Vercel deployment compatibility"
git push origin main

# Почекати 5 хвилин, потім:
start https://yana-diia-v3.vercel.app
```

---

## ⚠️ Troubleshooting

### npm install fails

```powershell
# Clear npm cache
npm cache clean --force
npm install
```

### Build fails з "Module not found"

```powershell
# Перевірити tsconfig.json paths
cat tsconfig.json
# Має бути: "@/*": ["./*"]
```

### Vercel deployment failed

```powershell
# Отримати детальні логи
npx vercel logs <deployment-url> --yes

# Force redeploy
npx vercel --prod --force --yes
```

### Сайт показує 404

```
Причина: vercel.json rewrites працюють
Перевірити: Settings → Functions → Routing в Vercel Dashboard
```

---

## 📊 Поточний статус файлів

### Змінено

- `package.json` (Next.js version)
- `vercel.json` (enhanced config)

### Створено (backend)

- `backend/routes/registry.py` (Mock API)
- `backend/mcp-servers/yana_mcp_server.py` (MCP tools)
- `backend/services/judge_module.py` (Judge rubric)
- `backend/services/mcp_integration.py` (Integration layer)
- `backend/scripts/init_weaviate_schema.py` (RAG schemas)
- `backend/docker-compose.yml` (Infrastructure)
- `backend/.env.production.template` (Config template)

### Створено (docs)

- `docs/UKRAINE-API-REGISTRY.md`
- `docs/MCP-SERVER-SPEC.md`
- `docs/COMPONENT-DATABASE-SCHEMA.md`
- `docs/FLOW-DATA-MODEL.md`
- `docs/INTEGRATION-INDEX.md`
- `DEMO_DAY_OPERATIONAL_PLAN.md`
- `PHASE_1_2_3_SETUP.md`
- `VERCEL_DEPLOYMENT_FIX.md`
- `VERCEL_CLI_GUIDE.md`

### Створено (scripts)

- `check-vercel-status.ps1`
- `quick-deploy-check.ps1`

---

## ✅ Success Criteria

- [ ] `npm run build` - SUCCESS без помилок
- [ ] `npm start` - Localhost працює (<http://localhost:3000>)
- [ ] `git push` - Виконано успішно
- [ ] Vercel build - SUCCESS (через 5 хв після push)
- [ ] <https://yana-diia-v3.vercel.app> - ДОСТУПНИЙ

---

## 📞 Наступні кроки після успішного deploy

1. **Backend setup:**

   ```bash
   cd backend
   docker compose up -d
   python scripts/init_weaviate_schema.py
   ```

2. **Frontend development:**
   - Lego Constructor UI
   - API integration
   - Testing

3. **Demo Day preparation:**
   - Recording
   - Presentation
   - Q&A prep

---

**ПОЧНИ З STEP 1!** 🚀

Запусти локальний build і повідом результат.
