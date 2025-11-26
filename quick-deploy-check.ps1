# Quick Deployment Info
# Швидка перевірка останнього deployment

Write-Host "`n🚀 VERCEL DEPLOYMENT CHECK" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Project info
Write-Host "📦 Project: yana-diia-v3" -ForegroundColor White
Write-Host "🔗 URL: https://yana-diia-v3.vercel.app`n" -ForegroundColor White

# Get latest deployment URL
Write-Host "🔍 Отримую інформацію про останній deployment..." -ForegroundColor Yellow

$deployments = npx vercel ls yana-diia-v3 --yes 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host $deployments
}
else {
    Write-Host "⚠️ Не можу отримати список deployments. Можливо потрібен login:" -ForegroundColor Red
    Write-Host "   Запусти: npx vercel login`n" -ForegroundColor Yellow
}

Write-Host "`n💡 Команди для діагностики:" -ForegroundColor Cyan
Write-Host "   .\check-vercel-status.ps1     # Повна перевірка" -ForegroundColor Gray
Write-Host "   npx vercel logs               # Логи реального часу" -ForegroundColor Gray
Write-Host "   npx vercel --prod             # Redeploy production" -ForegroundColor Gray

Write-Host ""
