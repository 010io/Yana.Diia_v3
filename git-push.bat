@echo off
REM Quick Git Push Script для Yana.Diia_v3
echo ========================================
echo Git Push to GitHub
echo ========================================
echo.

echo [1/4] Git Add All Files...
git add .

echo.
echo [2/4] Git Commit...
git commit -m "feat: CodeMie SDK integration + backend infrastructure

- Created Python FastAPI backend (:8001)
- Integrated CodeMie service (mock mode ready)
- Fixed Next.js frontend API routes  
- Secured credentials in .env
- Fixed Git conflicts (README, LICENSE)
- Downgraded Tailwind to 3.4.15 (stable)
- Added VM_QUICKSTART.md

Backend tested locally, ready for VM deployment
Tested: API endpoints working (health + generate)
Ready for Demo Day!"

echo.
echo [3/4] Git Push...
git push origin main

echo.
echo [4/4] Done!
echo ========================================
echo.
echo Repository updated successfully!
echo Next: Clone on VM and continue setup
echo.
pause
