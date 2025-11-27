# 🔧 Інструкція: Встановлення Git для Windows

**Проблема:** Git не розпізнається у PowerShell/Windows

**Статус:** ❌ `git` команда не знайдена в системі

---

## Варіант 1: Експрес-встановлення (Рекомендовано)

### Через Windows Package Manager (winget)

```powershell
# Відкрий PowerShell як Адміністратор
winget install --id Git.Git -e --source winget

# Перезапусти PowerShell після встановлення
# Перевір
git --version
```

**Переваги:**
- ✅ Швидко (1 команда)
- ✅ Автоматично додається в PATH
- ✅ Остання стабільна версія

---

## Варіант 2: Ручне Встановлення

### 1. Завантажити Інсталятор

**Посилання:** https://git-scm.com/download/win

- Обери версію для Windows (64-bit)
- Збережи `Git-2.47.1-64-bit.exe` (або новішу)

### 2. Запустити Інсталятор

**Важливі опції під час встановлення:**

1. **C:\Program Files\Git** → ✅ (default location)
2. **Select Components:**
   - ✅ Git Bash Here
   - ✅ Git GUI Here
   - ✅ Associate .sh files with Git Bash
3. **Adjusting your PATH environment:**
   - ✅ **Git from the command line and also from 3rd-party software** ← ОБОВ'ЯЗКОВО!
4. **Choosing the SSH executable:**
   - ✅ Use bundled OpenSSH
5. **Choosing HTTPS transport backend:**
   - ✅ Use the OpenSSL library
6. **Configuring the line ending conversions:**
   - ✅ Checkout Windows-style, commit Unix-style line endings
7. **Configuring the terminal emulator:**
   - ✅ Use MinTTY (the default terminal of MSYS2)
8. **Default behavior of `git pull`:**
   - ✅ Default (fast-forward or merge)

### 3. Перевірити Встановлення

Відкрий **нову** PowerShell консоль:

```powershell
git --version
# Має показати: git version 2.47.1.windows.1
```

---

## Варіант 3: Portable Git (Без Встановлення)

### 1. Завантажити Portable

https://git-scm.com/download/win → **Portable ("thumbdrive edition")**

### 2. Розпакувати

```powershell
# Розпакуй у c:\Tools\PortableGit
Expand-Archive -Path "PortableGit-2.47.1-64-bit.7z.exe" -DestinationPath "c:\Tools\PortableGit"
```

### 3. Додати в PATH

```powershell
# Тимчасово (поточна сесія)
$env:PATH += ";c:\Tools\PortableGit\bin"

# Постійно (додати в System Environment Variables)
[System.Environment]::SetEnvironmentVariable(
    "PATH", 
    $env:PATH + ";c:\Tools\PortableGit\bin", 
    [System.EnvironmentVariableTarget]::User
)
```

---

## Налаштування Git (Обов'язково)

Після встановлення налаштуй Git credentials:

```powershell
# Ім'я користувача
git config --global user.name "Igor Omelchenko"

# Email (буде видно в коммітах)
git config --global user.email "010io@example.com"

# Default editor
git config --global core.editor "code --wait"

# Перевірка
git config --list
```

---

## Troubleshooting

### ❌ "git: The term 'git' is not recognized"

**Причина:** Git не в PATH

**Рішення 1: Перезапусти PowerShell**
```powershell
# Закрий і відкрий нову консоль
```

**Рішення 2: Додай вручну в PATH**
```powershell
# Перевір, чи Git встановлений
Test-Path "C:\Program Files\Git\cmd\git.exe"

# Якщо True, додай в PATH
$env:PATH += ";C:\Program Files\Git\cmd"

# Перевір
git --version
```

**Рішення 3: Використай повний шлях**
```powershell
& "C:\Program Files\Git\cmd\git.exe" --version
```

### ❌ "Permission denied" під час встановлення

**Рішення:** Запусти PowerShell як Адміністратор

```powershell
# Правий клік на PowerShell → "Run as Administrator"
```

### ❌ Git встановлено, але PATH not updated

**Рішення:** Оновити PATH вручну

```powershell
# Відкрий System Properties
rundll32.exe sysdm.cpl,EditEnvironmentVariables

# Додай:
# C:\Program Files\Git\cmd
# C:\Program Files\Git\bin
```

---

## Перевірка після встановлення

```powershell
# Версія Git
git --version

# Перевірка конфігурації
git config --list

# Test clone (не обов'язково)
git clone https://github.com/010io/test-repo.git
cd test-repo
git log

# Очистити тест
cd ..
Remove-Item -Recurse -Force test-repo
```

---

## Після встановлення Git

**Повернись до security audit:**

1. ✅ Ротувати API ключі CodeMie
2. ✅ Очистити `TEAM_SETUP.md` та `VM_QUICKSTART.md`
3. ✅ Створити `backend/.env.example`
4. ✅ Git push виправлень

---

**Готово!** 🎯 Git має працювати у PowerShell.

Якщо проблеми залишаються, перезавантаж ПК після встановлення.
