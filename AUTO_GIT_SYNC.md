# 🔄 Auto Git Sync Setup

## Варіант 1: VSCode Extension (НАЙКРАЩИЙ!)

**Розширення:** `Auto Commit + Auto Push`

1. Відкрий VSCode Extensions (Ctrl+Shift+X)
2. Шукай `Auto Commit`
3. Встанови `Auto Commit + Auto Push` by `Haozheng Li`

**Налаштування (settings.json):**

```json
{
  "autoCommit.enabled": true,
  "autoCommit.interval": 300000,
  "autoCommit.message": "auto-save: ${now}",
  "autoCommit.push": true
}
```

---

## Варіант 2: Windows Task Scheduler

**Запускати `git-auto-sync.bat` кожні 5 хвилин:**

```powershell
$action = New-ScheduledTaskAction -Execute "C:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3\git-auto-sync.bat"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName "GitAutoSync-Yana" -Action $action -Trigger $trigger
```

**Видалити:**

```powershell
Unregister-ScheduledTask -TaskName "GitAutoSync-Yana" -Confirm:$false
```

---

## Варіант 3: Git Pre-Commit Hook (Авто на кожну зміну)

**Створити `.git/hooks/post-commit`:**

```bash
#!/bin/sh
git push origin main
```

**Зробити executable:**

```bash
chmod +x .git/hooks/post-commit
```

---

## Варіант 4: GitHub Desktop Auto-Sync

**Settings → Git:**

- ✅ Automatically fetch
- ✅ Periodically fetch (every 5 min)

**НЕ автоматичний push**, але показує коли є зміни

---

## Варіант 5: Watch Script (Running in Background)

**PowerShell watch loop:**

```powershell
while($true) {
    cd "C:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3"
    .\git-auto-sync.bat
    Start-Sleep -Seconds 300
}
```

---

## 🎯 МОЯ РЕКОМЕНДАЦІЯ

**VSCode Extension** - бо:

- ✅ Найпростіше налаштування
- ✅ Інтеграція з VSCode
- ✅ Контроль через UI
- ✅ Можна pause/resume

---

## ⚠️ ВАЖЛИВО

**Auto-sync це добре для:**

- ✅ Solo dev
- ✅ Експерименти
- ✅ Demo projects

**НЕ використовуй для:**

- ❌ Team projects (conflicts!)
- ❌ Production code (без review)

**Для команди краще:**

- Git Flow
- Pull Requests
- Code Reviews

---

**Готово!** Який варіант обираєш?
