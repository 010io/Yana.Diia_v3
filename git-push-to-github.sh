#!/bin/bash
# Git Push Script for Yana.Diia_v3
# Run this on VM or machine with Git installed

echo "🚀 Preparing to push Yana.Diia_v3 to GitHub..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Run 'git init' first."
    exit 1
fi

echo "✅ Git found"
echo ""

# Show current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Check if .env is staged (should NOT be)
if git diff --cached --name-only | grep -q "^backend/.env$"; then
    echo "⚠️  WARNING: backend/.env is staged!"
    echo "This file contains secrets and should NOT be committed."
    echo "Run: git reset backend/.env"
    exit 1
fi

echo "✅ No .env file in staging area"
echo ""

# Add new files
echo "📦 Adding new backend files..."
git add backend/config/
git add backend/models/
git add backend/utils/
git add backend/.env.example
git add backend/requirements.txt
git add backend/main.py
git add backend/routes/
git add backend/services/
git add .kiro/memory/
git add .kiro/antigravity/
git add .gitignore

echo "✅ Files added"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git diff --cached --name-only
echo ""

# Confirm before commit
read -p "🤔 Proceed with commit? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Commit
echo "💾 Creating commit..."
git commit -m "feat(backend): production-ready architecture

Backend Infrastructure:
- Dependency injection for CodeMie service (FastAPI Depends)
- HTTP connection pooling (httpx AsyncClient singleton)
- Retry logic with exponential backoff (3 attempts)
- Centralized settings (Pydantic BaseSettings)
- Custom exception handlers (5 types)
- Structured logging (structlog with JSON output)

Code Organization:
- config/ - Settings and configuration
- models/ - Pydantic request/response models
- utils/ - Validators, retry, http_client, error_handlers
- Refactored routes to use dependency injection

Security:
- .env.example cleaned (no real credentials)
- All secrets in .env (gitignored)
- Input validation and sanitization
- XSS/SQL injection detection

Ready for:
- VM deployment
- Real CodeMie SDK integration
- Rate limiting (slowapi ready)
- Unit testing

Breaking Changes: None
Migration: pip install -r requirements.txt"

echo "✅ Commit created"
echo ""

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $BRANCH"
echo ""

# Confirm before push
read -p "🚀 Push to origin/$BRANCH? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push aborted by user"
    echo "💡 You can push manually later with: git push origin $BRANCH"
    exit 1
fi

# Push
echo "🚀 Pushing to GitHub..."
git push origin $BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps on VM:"
    echo "  1. git pull origin $BRANCH"
    echo "  2. cd backend && pip install -r requirements.txt"
    echo "  3. Create backend/.env with real credentials"
    echo "  4. python main.py"
    echo ""
    echo "Слава Україні! 🇺🇦"
else
    echo ""
    echo "❌ Push failed. Check your credentials and network connection."
    exit 1
fi
