@echo off
REM Quick script to remove .gemini and .kiro from git tracking
REM Run this from the project root directory

echo ========================================
echo Cleaning up AI artifacts from git
echo ========================================
echo.

echo Checking if folders are tracked by git...
git ls-files .gemini/ > nul 2>&1
if %errorlevel% equ 0 (
    echo [FOUND] .gemini/ is tracked by git
    set GEMINI_TRACKED=1
) else (
    echo [OK] .gemini/ is not tracked
    set GEMINI_TRACKED=0
)

git ls-files .kiro/ > nul 2>&1
if %errorlevel% equ 0 (
    echo [FOUND] .kiro/ is tracked by git
    set KIRO_TRACKED=1
) else (
    echo [OK] .kiro/ is not tracked
    set KIRO_TRACKED=0
)

echo.

if %GEMINI_TRACKED% equ 0 if %KIRO_TRACKED% equ 0 (
    echo ========================================
    echo SUCCESS: No cleanup needed!
    echo Both folders are already ignored by git
    echo ========================================
    pause
    exit /b 0
)

echo.
echo WARNING: Found tracked folders that should be ignored!
echo.
echo This will:
echo   1. Remove .gemini/ and .kiro/ from git tracking
echo   2. Keep the folders locally (they are needed for Kiro)
echo   3. Create a commit with the changes
echo.
set /p CONFIRM="Continue? (y/n): "

if /i not "%CONFIRM%"=="y" (
    echo Cancelled by user
    pause
    exit /b 1
)

echo.
echo Removing from git tracking...

if %GEMINI_TRACKED% equ 1 (
    git rm -r --cached .gemini
    echo [DONE] Removed .gemini/ from git
)

if %KIRO_TRACKED% equ 1 (
    git rm -r --cached .kiro
    echo [DONE] Removed .kiro/ from git
)

echo.
echo Creating commit...
git commit -m "chore: remove AI artifacts (.gemini, .kiro) from git tracking"

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Next steps:
echo   1. Push to GitHub: git push origin main
echo   2. Verify on GitHub that folders are gone
echo   3. Check locally that folders still exist
echo.
echo Run this to push:
echo   git push origin main
echo.
pause
