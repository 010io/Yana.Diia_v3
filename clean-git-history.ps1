# 🧹 Git History Cleanup Script
# Запускай цей скрипт у PowerShell, де працює git

$ErrorActionPreference = "Stop"

Write-Host "🛡️  Starting Git History Cleanup..." -ForegroundColor Cyan
Write-Host "   Target files: _PACKED_PROJECT.*, repomix-output.xml" -ForegroundColor Yellow

# 1. Check Git
try {
    $version = git --version
    Write-Host "   ✅ Git detected: $version" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Git not found! Please install Git first." -ForegroundColor Red
    exit 1
}

# 2. Confirm action
Write-Host "`n⚠️  WARNING: This will rewrite repository history!" -ForegroundColor Red
Write-Host "   This action is destructive and cannot be easily undone."
$confirm = Read-Host "   Type 'DELETE' to confirm"

if ($confirm -ne 'DELETE') {
    Write-Host "   ❌ Cancelled." -ForegroundColor Yellow
    exit 1
}

# 3. Run filter-branch
Write-Host "`n⏳ Running git filter-branch (this may take a minute)..." -ForegroundColor Cyan

# Files to remove (space separated)
$filesToRemove = "_PACKED_PROJECT.json _PACKED_PROJECT.md _PACKED_PROJECT.yaml repomix-output.xml"

# Construct command
# We use Invoke-Expression to handle the quoting correctly for the shell command inside filter-branch
$filterCommand = "git filter-branch --force --index-filter ""git rm --cached --ignore-unmatch $filesToRemove"" --prune-empty --tag-name-filter cat -- --all"

try {
    # Execute git command
    cmd /c $filterCommand
} catch {
    Write-Host "   ❌ Error running filter-branch" -ForegroundColor Red
    Write-Host $_
    exit 1
}

# 4. Cleanup refs and garbage collect
Write-Host "`n🗑️  Cleaning up old references..." -ForegroundColor Cyan
try {
    # Remove backup refs created by filter-branch
    git for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }
    
    # Expire reflog and garbage collect
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
} catch {
    Write-Host "   ⚠️  Cleanup warning (non-critical): $_" -ForegroundColor Yellow
}

# 5. Final instructions
Write-Host "`n✅ History Cleanup Complete!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Now you MUST force push to GitHub to apply changes:" -ForegroundColor Yellow
Write-Host "`n   git push origin --force --all" -ForegroundColor White
Write-Host "`nIf you have tags:"
Write-Host "   git push origin --force --tags"
