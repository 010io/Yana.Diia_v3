@echo off
REM Quick Fix Script для Yana.Diia.AI (Windows)
REM Виправляє критичні проблеми

echo 🔧 Starting Quick Fix...
echo.

REM 1. Fix backend dependencies
echo 📦 Step 1: Installing backend dependencies...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo.

REM 2. Fix frontend .env.local
echo 🔧 Step 2: Updating .env.local...
findstr /C:"NEXT_PUBLIC_API_URL" .env.local >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo NEXT_PUBLIC_API_URL=http://localhost:8001>> .env.local
    echo ✅ Added NEXT_PUBLIC_API_URL
) else (
    echo ✅ NEXT_PUBLIC_API_URL already exists
)

findstr /C:"NEXT_PUBLIC_BACKEND_URL" .env.local >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo NEXT_PUBLIC_BACKEND_URL=http://localhost:8001>> .env.local
    echo ✅ Added NEXT_PUBLIC_BACKEND_URL
) else (
    echo ✅ NEXT_PUBLIC_BACKEND_URL already exists
)
echo.

REM 3. Create API routes directory
echo 📁 Step 3: Creating API routes...
if not exist "app\api\generate" mkdir app\api\generate
if not exist "app\api\health" mkdir app\api\health
echo ✅ API directories created
echo.

REM 4. Test backend
echo 🧪 Step 4: Testing backend...
cd backend
python -c "from config.settings import settings; print('✅ Backend config OK')" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend ready
) else (
    echo ⚠️  Backend config has issues (check manually)
)
cd ..
echo.

echo ✅ Quick fix complete!
echo.
echo 📋 Next steps:
echo 1. Start backend: cd backend ^&^& python main.py
echo 2. Start frontend: npm run dev
echo 3. Test: curl http://localhost:8001/health
echo.
echo Слава Україні! 🇺🇦
pause
