# 🧹 Clean Agent Artifacts from Repository
# Видаляє .gemini, .kiro та допоміжні скрипти з Git

$ErrorActionPreference = "Stop"

Write-Host "🗑️  Removing Agent Artifacts..." -ForegroundColor Cyan

# Step 1: Remove from Git index (keep locally)
Write-Host "`n1️⃣  Removing from Git tracking..." -ForegroundColor Yellow

$filesToRemove = @(
    ".gemini/*",
    ".kiro/*",
    "emergency-fix.ps1",
    "privacy-cleanup.ps1",
    "clean-git-history.ps1",
    "cleanup-git-artifacts.bat",
    "CHECK_ALL_REPOS.md",
    "CLEANUP_GIT_ARTIFACTS.md"
)

foreach ($file in $filesToRemove) {
    Write-Host "   Removing: $file" -ForegroundColor Gray
    git rm -r --cached $file 2>$null
}

# Step 2: Verify .gitignore
Write-Host "`n2️⃣  Verifying .gitignore..." -ForegroundColor Yellow
$ignoreContent = Get-Content .gitignore -Raw
if ($ignoreContent -notmatch '\.gemini/') {
    Write-Host "   ⚠️  Adding .gemini/ to .gitignore" -ForegroundColor Yellow
    Add-Content .gitignore "`n# Agent Artifacts`n.gemini/`n.kiro/"
} else {
    Write-Host "   ✅ .gitignore already has agent folders" -ForegroundColor Green
}

# Step 3: Commit removal
Write-Host "`n3️⃣  Committing changes..." -ForegroundColor Yellow
git add .gitignore
git commit -m "chore: remove agent artifacts and helper scripts from repo"

# Step 4: Clean history
Write-Host "`n4️⃣  Cleaning Git history (this may take a minute)..." -ForegroundColor Yellow
Write-Host "   Target: .gemini/, .kiro/, helper scripts" -ForegroundColor Gray

$confirm = Read-Host "`n⚠️  Clean Git history? Type 'YES' to confirm"
if ($confirm -ne 'YES') {
    Write-Host "   ❌ Skipped history cleanup" -ForegroundColor Yellow
    Write-Host "`n✅ Files removed from current commit, but still in history." -ForegroundColor Yellow
    Write-Host "   Run this script again and type 'YES' to clean history." -ForegroundColor Yellow
    exit 0
}

# Run filter-branch for .gemini and .kiro
$filesToClean = ".gemini .kiro emergency-fix.ps1 privacy-cleanup.ps1 clean-git-history.ps1 cleanup-git-artifacts.bat CHECK_ALL_REPOS.md CLEANUP_GIT_ARTIFACTS.md"

Write-Host "   Running git filter-branch..." -ForegroundColor Gray
cmd /c "git filter-branch --force --index-filter `"git rm -rf --cached --ignore-unmatch $filesToClean`" --prune-empty --tag-name-filter cat -- --all"

# Cleanup
git for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { git update-ref -d $_ }
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "`n✅ History cleaned!" -ForegroundColor Green
Write-Host "   Now run: git push origin --force --all" -ForegroundColor Yellow
