# start.ps1
Write-Host "🚀 Starting Yana.Diia_v3..." -ForegroundColor Cyan

# 1. Check .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local..." -ForegroundColor Yellow
    $envContent = @"
LLM_MODE=mock
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
"@
    Set-Content ".env.local" $envContent
    Write-Host "✅ .env.local created!" -ForegroundColor Green
}

# 2. Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies (this may take a minute)..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
}

# 3. Start Server
Write-Host "🌍 Starting Development Server..." -ForegroundColor Cyan
Write-Host "👉 Open http://localhost:3000 in your browser" -ForegroundColor White
npm run dev -- --no-turbopack
