# Quick Privacy Cleanup Script
# Використовуй ПІСЛЯ того, як встановиш Git!

$ErrorActionPreference = "Stop"

Write-Host "🔒 Yana.Diia Privacy Cleanup Script" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Step 1: Verify we're in correct directory
$projectPath = "c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3"
if ((Get-Location).Path -ne $projectPath) {
    Write-Host "⚠️  Changing to project directory..." -ForegroundColor Yellow
    Set-Location $projectPath
}

# Step 2: Check if Git is available
try {
    $null = git --version
    Write-Host "✅ Git detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found! Install Git first:" -ForegroundColor Red
    Write-Host "   winget install --id Git.Git -e`n" -ForegroundColor Yellow
    Write-Host "See: GIT_SETUP_WINDOWS.md" -ForegroundColor Yellow
    exit 1
}

# Step 3: List sensitive files to remove
Write-Host "`n📋 Files to remove:" -ForegroundColor Cyan
$filesToRemove = @(
    "_PACKED_PROJECT.json",
    "_PACKED_PROJECT.md",
    "_PACKED_PROJECT.yaml",
    "repomix-output.xml"
)

$foundFiles = @()
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        $item = Get-Item $file
        $sizeKB = [math]::Round($item.Length / 1KB, 2)
        Write-Host "  🔴 $file ($sizeKB KB)" -ForegroundColor Red
        $foundFiles += $file
    } else {
        Write-Host "  ✅ $file (already removed)" -ForegroundColor Green
    }
}

if ($foundFiles.Count -eq 0) {
    Write-Host "`n✅ All sensitive files already removed locally!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Found $($foundFiles.Count) sensitive files" -ForegroundColor Yellow
    
    # Ask for confirmation
    $confirm = Read-Host "`nDelete these files locally? (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        foreach ($file in $foundFiles) {
            Remove-Item $file -Force
            Write-Host "  ✅ Deleted: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "Skipped local deletion" -ForegroundColor Yellow
    }
}

# Step 4: Check Git status
Write-Host "`n📊 Git Status:" -ForegroundColor Cyan
try {
    git status --short
} catch {
    Write-Host "❌ Git status failed" -ForegroundColor Red
}

# Step 5: Check if files are in Git history
Write-Host "`n🔍 Checking Git history..." -ForegroundColor Cyan
$inHistory = @()
foreach ($file in $filesToRemove) {
    $result = git log --all --pretty=format:"%H" -- $file 2>$null
    if ($result) {
        Write-Host "  🔴 $file — IN HISTORY (needs cleanup!)" -ForegroundColor Red
        $inHistory += $file
    } else {
        Write-Host "  ✅ $file — not in history" -ForegroundColor Green
    }
}

# Step 6: Provide next steps
Write-Host "`n" -NoNewline
if ($inHistory.Count -gt 0) {
    Write-Host "⚠️  CRITICAL: $($inHistory.Count) files found in Git history!" -ForegroundColor Red
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Review PRIVACY_BREACH_AUDIT.md for cleanup options"
    Write-Host "2. Choose cleanup method (BFG Repo-Cleaner recommended)"
    Write-Host "3. Run cleanup commands to remove from history"
    Write-Host "4. Force push to GitHub"
    Write-Host "`nAudit report: C:\Users\test\.gemini\antigravity\brain\fe283802-43f6-4596-9c32-67705fe2d19a\PRIVACY_BREACH_AUDIT.md"
} else {
    Write-Host "✅ No sensitive files in Git history!" -ForegroundColor Green
    Write-Host "`nYou're safe to commit .gitignore changes and push."
}

Write-Host "`n✅ Cleanup check complete!" -ForegroundColor Cyan
