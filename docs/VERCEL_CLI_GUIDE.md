# 🔧 Vercel CLI Commands - Quick Reference

**Створено:** 23.11.2025  
**Для:** Yana.Diia_v3 Project

---

## 🚀 Швидкі команди (запускати в PowerShell)

### Перевірка статусу

```powershell
# Швидка перевірка
.\quick-deploy-check.ps1

# Повна перевірка
.\check-vercel-status.ps1
```

### Базові Vercel CLI команди

#### 1. Login (якщо потрібно)

```bash
npx vercel login
```

#### 2. Список deployments

```bash
npx vercel ls
# або для конкретного проєкту
npx vercel ls yana-diia-v3
```

#### 3. Інформація про deployment

```bash
# Inspect latest deployment
npx vercel inspect

# Inspect specific URL
npx vercel inspect https://yana-diia-v3-9kn2gp6s1mnhkqzkb7tbzjxfjm8m.vercel.app
```

#### 4. Логи

```bash
# Real-time logs
npx vercel logs

# Logs для конкретного deployment
npx vercel logs https://yana-diia-v3.vercel.app

# Логи з фільтром
npx vercel logs --follow  # Follow mode (live)
```

#### 5. Environment Variables

```bash
# Список всіх env vars
npx vercel env ls

# Додати нову env var
npx vercel env add OPENAI_API_KEY production

# Видалити env var
npx vercel env rm VARIABLE_NAME production
```

#### 6. Force Redeploy

```bash
# Redeploy до production
npx vercel --prod

# Redeploy з force (bypass cache)
npx vercel --prod --force
```

#### 7. Domains

```bash
# Список доменів
npx vercel domains ls

# Додати домен
npx vercel domains add yourdomain.com
```

---

## 🛠️ Troubleshooting Commands

### Build Logs Analysis

```bash
# Get build logs для останнього deployment
npx vercel logs --output=build

# Runtime logs
npx vercel logs --output=runtime
```

### Clear Build Cache

```bash
# В Vercel Dashboard або через API
# Settings → General → Clear Build Cache

# Альтернатива - force redeploy
npx vercel --prod --force
```

### Check Configuration

```bash
# Показати конфігурацію проєкту
npx vercel project ls

# Інформація про конкретний deployment
npx vercel inspect <deployment-url>
```

---

## 📊 Діагностика поточної проблеми

### Step 1: Перевірка останнього deployment

```powershell
npx vercel ls yana-diia-v3 --yes
```

### Step 2: Inspect deployment ID

```powershell
npx vercel inspect 9Kn2gp6s1mnhkQzkB7TBZjXFJM8M --yes
```

### Step 3: Отримати build logs

```powershell
npx vercel logs 9Kn2gp6s1mnhkQzkB7TBZjXFJM8M --yes
```

### Step 4: Перевірити env vars

```powershell
npx vercel env ls --yes
```

---

## 🔍 Що шукати в логах

### Build Errors (найчастіші)

```
❌ Module not found
❌ Type error in <file>
❌ Build command exited with 1
❌ NEXT_PUBLIC_* env missing
❌ Port already in use
```

### Runtime Errors

```
❌ Function execution timeout
❌ Memory limit exceeded
❌ 404 on routes
❌ API endpoint errors
```

---

## 💡 Recommended Workflow

1. **Check deployment status:**

   ```bash
   npx vercel ls
   ```

2. **If deployment failed, check logs:**

   ```bash
   npx vercel logs <deployment-url>
   ```

3. **If env vars missing, add them:**

   ```bash
   npx vercel env add VARIABLE_NAME production
   ```

4. **Force redeploy after fixes:**

   ```bash
   git add .
   git commit -m "fix: deployment issues"
   git push origin main
   # Vercel auto-deploys
   
   # OR manual:
   npx vercel --prod --force
   ```

---

## 🎯 Current Status Check

**Run this now:**

```powershell
cd c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3
.\quick-deploy-check.ps1
```

**Expected Output:**

- List of recent deployments
- Status of latest build (Building/Ready/Error)
- URL to access logs

---

## 📞 Vercel Support Resources

- **Dashboard:** <https://vercel.com/010ios-projects/yana-diia-v3>
- **CLI Docs:** <https://vercel.com/docs/cli>
- **Troubleshooting:** <https://vercel.com/docs/deployments/troubleshoot-a-deployment>
- **Community:** <https://github.com/vercel/vercel/discussions>

---

**Готовий до використання!** 🚀
