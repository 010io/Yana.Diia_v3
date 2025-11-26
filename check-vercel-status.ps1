# Vercel Status Check Script
# Перевірка статусу deployment через Vercel CLI

Write-Host "🔍 Перевірка статусу Vercel deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is available
$vercelVersion = npx vercel --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel CLI не знайдено. Встановлюю..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
Write-Host ""

# List recent deployments
Write-Host "📋 Останні deployments:" -ForegroundColor Cyan
npx vercel ls --yes

Write-Host ""
Write-Host "📊 Статус поточного проєкту:" -ForegroundColor Cyan
npx vercel inspect --yes

Write-Host ""
Write-Host "📜 Останні логи (якщо deployment активний):" -ForegroundColor Cyan
npx vercel logs --yes

Write-Host ""
Write-Host "✅ Перевірка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Додаткові команди:" -ForegroundColor Yellow
Write-Host "  npx vercel --prod              # Deploy to production"
Write-Host "  npx vercel logs <url>          # Логи конкретного deployment"
Write-Host "  npx vercel env ls              # Список environment variables"
Write-Host "  npx vercel domains ls          # Список доменів"
