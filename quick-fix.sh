#!/bin/bash
# Quick Fix Script для Yana.Diia.AI
# Виправляє критичні проблеми

echo "🔧 Starting Quick Fix..."
echo ""

# 1. Fix backend dependencies
echo "📦 Step 1: Installing backend dependencies..."
cd backend
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# 2. Fix frontend .env.local
echo "🔧 Step 2: Updating .env.local..."
if ! grep -q "NEXT_PUBLIC_API_URL" .env.local; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8001" >> .env.local
    echo "✅ Added NEXT_PUBLIC_API_URL"
else
    echo "✅ NEXT_PUBLIC_API_URL already exists"
fi

if ! grep -q "NEXT_PUBLIC_BACKEND_URL" .env.local; then
    echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8001" >> .env.local
    echo "✅ Added NEXT_PUBLIC_BACKEND_URL"
else
    echo "✅ NEXT_PUBLIC_BACKEND_URL already exists"
fi
echo ""

# 3. Create API routes directory
echo "📁 Step 3: Creating API routes..."
mkdir -p app/api/generate
mkdir -p app/api/health
echo "✅ API directories created"
echo ""

# 4. Test backend
echo "🧪 Step 4: Testing backend..."
cd backend
python -c "from config.settings import settings; print('✅ Backend config OK')" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend ready"
else
    echo "⚠️  Backend config has issues (check manually)"
fi
cd ..
echo ""

echo "✅ Quick fix complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start backend: cd backend && python main.py"
echo "2. Start frontend: npm run dev"
echo "3. Test: curl http://localhost:8001/health"
echo ""
echo "Слава Україні! 🇺🇦"
