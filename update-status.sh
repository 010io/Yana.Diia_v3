#!/bin/bash
# Auto-Update Project Status Script (Linux/Mac)
# Запуск: ./update-status.sh

echo "🔄 Оновлення статусу проєкту Yana.Diia.AI..."

# Get current date/time
timestamp=$(date '+%Y-%m-%d %H:%M')
demo_date="2025-11-29"
days_left=$(( ( $(date -d "$demo_date" +%s) - $(date +%s) ) / 86400 ))

# Count files
app_files=$(find app -name "*.tsx" | wc -l)
component_files=$(find components -name "*.tsx" | wc -l)
lib_files=$(find lib -name "*.ts" | wc -l)
config_files=$(find config -name "*.ts" | wc -l)
total_files=$((app_files + component_files + lib_files + config_files))

# Count lines of code
total_lines=$(find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | xargs wc -l | tail -1 | awk '{print $1}')

# Check npm
npm_status="❌ Не перевірено"
if npm list 2>&1 | grep -q "found 0 vulnerabilities"; then
    npm_status="✅ 0 vulnerabilities"
fi

# Generate status
cat > AUTO_STATUS.md << EOF
# 🎯 Yana.Diia.AI - Auto-Updated Status

**Останнє оновлення**: $timestamp  
**Днів до Demo Day**: **$days_left днів** 🔥  
**Автоматично згенеровано**: update-status.sh

---

## 📊 Code Metrics

| Metric | Value |
|--------|-------|
| **App Files (.tsx)** | $app_files |
| **Components (.tsx)** | $component_files |
| **Lib Files (.ts)** | $lib_files |
| **Config Files (.ts)** | $config_files |
| **Total TypeScript Files** | $total_files |
| **Total Lines of Code** | $total_lines |

---

## 🔧 Build Status

| Check | Status |
|-------|--------|
| NPM Dependencies | $npm_status |
| Dev Server | ⏳ Checking... |

---

## ✅ Features: 11/11 (100%)

- [x] Landing, Dashboard, Navigation
- [x] Lego Constructor
- [x] AI Debate Chamber ⭐
- [x] Pipeline, Evaluation
- [x] Quantum, Blockchain
- [x] Dev Panel, Mock Mode

---

**Days to Demo**: **$days_left** 🔥

**Next**: Run \`./update-status.sh\` to refresh
EOF

echo "✅ Статус оновлено! → AUTO_STATUS.md"
echo "📊 Files: $total_files | Lines: $total_lines"
echo "⏰ Days to Demo: $days_left"
