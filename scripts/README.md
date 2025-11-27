# 🔧 Scripts Directory

## Auto-Commit Script

### Usage

```powershell
# Simple commit with auto-generated message
.\scripts\auto-commit.ps1

# Custom commit message
.\scripts\auto-commit.ps1 -Message "feat: add new feature"

# Commit and push to remote
.\scripts\auto-commit.ps1 -Message "fix: resolve bug" -Push
```

### Features

- ✅ **Smart Messages:** Auto-generates descriptive commit messages
- ✅ **No Warnings:** Suppresses Git warnings about ignored files
- ✅ **Safe:** Prevents committing sensitive data
- ✅ **Context-Aware:** Adds tags like (docs), (deps), (code) based on file types

### Auto-Generated Message Examples

- `chore: update 3 files (code)` - when modifying TypeScript files
- `chore: add 2 files (docs)` - when adding Markdown files
- `chore: update 1 files (deps)` - when modifying package.json

### Configuration

The script automatically configures Git to:
- Normalize line endings (CRLF → LF)
- Suppress "ignored file" warnings
- Handle safe CRLF conversions

### Security

The script is safe to use because:
- `.gitignore` properly excludes sensitive files
- `.gitattributes` handles binary files correctly
- No hardcoded credentials or secrets
