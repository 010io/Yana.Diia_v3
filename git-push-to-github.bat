@echo off
REM Git Push Script for Yana.Diia_v3 (Windows)
REM Run this on Windows machine with Git installed

echo 🚀 Preparing to push Yana.Diia_v3 to GitHub...
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist .git (
    echo ❌ Not a git repository. Run 'git init' first.
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Show current status
echo 📊 Current Git Status:
git status --short
echo.

REM Check if .env is staged (should NOT be)
git diff --cached --name-only | findstr /C:"backend/.env" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  WARNING: backend/.env is staged!
    echo This file contains secrets and should NOT be committed.
    echo Run: git reset backend/.env
    pause
    exit /b 1
)

echo ✅ No .env file in staging area
echo.

REM Add new files
echo 📦 Adding files...
git add backend/config/
git add backend/models/
git add backend/utils/
git add backend/.env.example
git add backend/requirements.txt
git add backend/main.py
git add backend/routes/
git add backend/services/
git add .kiro/memory/
git add .kiro/antigravity/
git add .gitignore
git add README.md
git add CONTRIBUTING.md
git add READY-TO-PUSH.md
git add QUICK-COMMANDS.txt

echo ✅ Files added
echo.

REM Show what will be committed
echo 📋 Files to be committed:
git diff --cached --name-only
echo.

REM Confirm before commit
set /p CONFIRM="🤔 Proceed with commit? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Aborted by user
    pause
    exit /b 1
)

REM Commit
echo 💾 Creating commit...
git commit -m "feat(backend): production-ready architecture + docs" -m "Backend Infrastructure:" -m "- Dependency injection for CodeMie service" -m "- HTTP connection pooling with httpx" -m "- Retry logic with exponential backoff" -m "- Centralized settings with Pydantic" -m "- Custom exception handlers" -m "- Structured logging with JSON output" -m "" -m "Documentation:" -m "- Professional README.md" -m "- CONTRIBUTING.md guide" -m "- Complete .kiro/memory/ docs" -m "" -m "Security:" -m "- All secrets in .env (gitignored)" -m "- Input validation and sanitization" -m "" -m "Слава Україні! 🇺🇦"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Commit failed
    pause
    exit /b 1
)

echo ✅ Commit created
echo.

REM Get current branch
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
echo 📍 Current branch: %BRANCH%
echo.

REM Confirm before push
set /p CONFIRM_PUSH="🚀 Push to origin/%BRANCH%? (y/n): "
if /i not "%CONFIRM_PUSH%"=="y" (
    echo ❌ Push aborted by user
    echo 💡 You can push manually later with: git push origin %BRANCH%
    pause
    exit /b 1
)

REM Push
echo 🚀 Pushing to GitHub...
git push origin %BRANCH%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🎉 Next steps on VM:
    echo   1. git pull origin %BRANCH%
    echo   2. cd backend ^&^& pip install -r requirements.txt
    echo   3. Create backend/.env with real credentials
    echo   4. python main.py
    echo.
    echo Слава Україні! 🇺🇦
) else (
    echo.
    echo ❌ Push failed. Check your credentials and network connection.
    pause
    exit /b 1
)

pause
