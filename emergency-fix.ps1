# Швидкий Фікс Скрипт — Yana.Diia Security & CI/CD

$ErrorActionPreference = "Stop"

Write-Host "`n🚨 Yana.Diia EMERGENCY FIX SCRIPT" -ForegroundColor Red
Write-Host "================================`n" -ForegroundColor Red

$projectPath = "c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3"
Set-Location $projectPath

# Check 1: Git availability
Write-Host "1️⃣  Checking Git..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "   ✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Git NOT installed!" -ForegroundColor Red
    Write-Host "   Install: winget install --id Git.Git -e`n" -ForegroundColor Yellow
    exit 1
}

# Check 2: Dangerous workflow (update-packed.yml)
Write-Host "`n2️⃣  Checking dangerous workflows..." -ForegroundColor Cyan
$dangerousWorkflow = ".github\workflows\update-packed.yml"
if (Test-Path $dangerousWorkflow) {
    Write-Host "   ⚠️  FOUND: $dangerousWorkflow (CREATES SENSITIVE FILES!)" -ForegroundColor Red
    $disable = Read-Host "   Disable this workflow? (y/N)"
    if ($disable -eq 'y') {
        Rename-Item $dangerousWorkflow "$dangerousWorkflow.disabled" -Force
        Write-Host "   ✅ Disabled: $dangerousWorkflow" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ No dangerous workflow found" -ForegroundColor Green
}

# Check 3: Duplicate workflows
Write-Host "`n3️⃣  Checking duplicate workflows..." -ForegroundColor Cyan
$duplicate = ".github\workflows\deploy (2).yml"
if (Test-Path $duplicate) {
    Write-Host "   ⚠️  FOUND: $duplicate (DUPLICATE!)" -ForegroundColor Yellow
    Remove-Item $duplicate -Force
    Write-Host "   ✅ Deleted duplicate" -ForegroundColor Green
} else {
    Write-Host "   ✅ No duplicates" -ForegroundColor Green
}

# Check 4: Sensitive files
Write-Host "`n4️⃣  Checking sensitive files..." -ForegroundColor Cyan
$sensitiveFiles = @(
    "_PACKED_PROJECT.json",
    "_PACKED_PROJECT.md",
    "_PACKED_PROJECT.yaml",
    "repomix-output.xml"
)

$found = @()
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length / 1KB
        Write-Host "   🔴 $file ($('{0:N0}' -f $size) KB)" -ForegroundColor Red
        $found += $file
    }
}

if ($found.Count -gt 0) {
    $delete = Read-Host "`n   Delete $($found.Count) sensitive files? (y/N)"
    if ($delete -eq 'y') {
        foreach ($file in $found) {
            Remove-Item $file -Force
            Write-Host "   ✅ Deleted: $file" -ForegroundColor Green
        }
    }
} else {
    Write-Host "   ✅ No sensitive files found" -ForegroundColor Green
}

# Check 5: Backend requirements.txt
Write-Host "`n5️⃣  Checking backend configuration..." -ForegroundColor Cyan
$reqFile = "backend\requirements.txt"
if (-not (Test-Path $reqFile)) {
    Write-Host "   ⚠️  Missing: $reqFile (needed for CI/CD)" -ForegroundColor Yellow
    $create = Read-Host "   Create basic requirements.txt? (y/N)"
    if ($create -eq 'y') {
        @"
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
"@ | Out-File -Encoding utf8 $reqFile
        Write-Host "   ✅ Created: $reqFile" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ Found: $reqFile" -ForegroundColor Green
}

# Check 6: Next.js static export
Write-Host "`n6️⃣  Checking Next.js configuration..." -ForegroundColor Cyan
$nextConfig = "next.config.ts"
$content = Get-Content $nextConfig -Raw
if ($content -notmatch "output:\s*['""]export['""]") {
    Write-Host "   ⚠️  Missing static export configuration" -ForegroundColor Yellow
    Write-Host "   Manual fix needed: Add output: 'export' to next.config.ts" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Static export configured" -ForegroundColor Green
}

# Check 7: Git status
Write-Host "`n7️⃣  Checking Git status..." -ForegroundColor Cyan
try {
    $status = git status --short
    if ($status) {
        Write-Host "   Changes detected:" -ForegroundColor Yellow
        git status --short | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ✅ No pending changes" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Git status failed" -ForegroundColor Red
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ QUICK FIX COMPLETE!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review COMPLETE_AUDIT.md for full details"
Write-Host "2. Sanitize TEAM_SETUP.md and VM_QUICKSTART.md"
Write-Host "3. Rotate CodeMie API key"
Write-Host "4. Clean Git history (see PRIVACY_BREACH_AUDIT.md)"
Write-Host "5. Commit and push fixes`n"
