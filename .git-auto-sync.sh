#!/bin/bash
# Auto Git Sync Script
# Запускається кожні 5 хвилин

cd "$(dirname "$0")"

echo "🔄 Auto Git Sync Started..."

# Pull latest changes first
git pull origin main --rebase

# Add all changes
git add .

# Check if there are changes
if git diff --staged --quiet; then
  echo "✅ No changes to commit"
else
  # Commit with timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  git commit -m "auto-sync: $timestamp"
  
  # Push to remote
  git push origin main
  
  echo "✅ Changes pushed to GitHub"
fi

echo "🎯 Sync complete!"
