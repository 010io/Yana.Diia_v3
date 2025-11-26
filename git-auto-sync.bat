@echo off
REM Auto Git Sync for Windows
REM Run this in background or via Task Scheduler

cd /d "%~dp0"

echo [AUTO-SYNC] Starting...

REM Pull latest
git pull origin main --rebase

REM Add all changes
git add .

REM Check for changes
git diff --staged --quiet
if %errorlevel% neq 0 (
    REM Commit with timestamp
    git commit -m "auto-sync: %date% %time%"
    
    REM Push
    git push origin main
    
    echo [AUTO-SYNC] Changes pushed
) else (
    echo [AUTO-SYNC] No changes
)

echo [AUTO-SYNC] Complete
