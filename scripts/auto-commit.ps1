# Auto-commit script with smart messages
# Usage: .\scripts\auto-commit.ps1 [-Message "custom message"] [-Push]

param(
    [string]$Message = "",
    [switch]$Push = $false
)

# Suppress Git warnings
$env:GIT_CONFIG_GLOBAL = ""
git config --local advice.addIgnoredFile false 2>$null
git config --local core.autocrlf true 2>$null
git config --local core.safecrlf false 2>$null

# Check if there are changes
$status = git status --porcelain 2>$null
if (-not $status) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    return
}

# Generate smart commit message if not provided
if (-not $Message) {
    # Stage all changes first to analyze them
    git add . 2>$null
    
    $added = @(git diff --cached --name-only --diff-filter=A 2>$null)
    $modified = @(git diff --cached --name-only --diff-filter=M 2>$null)
    $deleted = @(git diff --cached --name-only --diff-filter=D 2>$null)
    
    $parts = @()
    if ($added.Count -gt 0) { $parts += "add $($added.Count) files" }
    if ($modified.Count -gt 0) { $parts += "update $($modified.Count) files" }
    if ($deleted.Count -gt 0) { $parts += "remove $($deleted.Count) files" }
    
    $Message = "chore: " + ($parts -join ", ")
    
    # Add specific context for common patterns
    if ($added -match "\.md$") { $Message += " (docs)" }
    if ($modified -match "package\.json") { $Message += " (deps)" }
    if ($added -match "\.ts$|\.tsx$") { $Message += " (code)" }
    if ($modified -match "\.gitignore") { $Message += " (config)" }
}

Write-Host "📝 Committing: $Message" -ForegroundColor Cyan

# Add all changes
git add . 2>$null

# Commit with message
git commit -m $Message --quiet 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Committed successfully" -ForegroundColor Green
    
    if ($Push) {
        Write-Host "🚀 Pushing to origin..." -ForegroundColor Yellow
        git push --quiet 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Pushed successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Push failed - check your connection" -ForegroundColor Red
        }
    } else {
        Write-Host "💡 Use -Push to push changes to remote" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Commit failed" -ForegroundColor Red
}
