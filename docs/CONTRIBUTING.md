# 🤝 Contributing to SVGaze

Thank you for your interest in contributing to SVGaze! This guide will help you get started.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (LTS version) - https://nodejs.org/
- **Git** - https://git-scm.com/
- A code editor (VSCode recommended)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/SVGaze.git
cd SVGaze

# Start local server
./start-local.sh  # Linux/Mac
# or
start-local.bat   # Windows
```

---

## 🔧 Development Workflow

### File Structure

```
SVGaze/
├── index.html              # Main application
├── js/
│   ├── modules/
│   │   ├── categoryManager.js
│   │   ├── sanitizer.js
│   │   ├── themeManager.js
│   │   └── ...
│   └── main.js
├── css/
│   └── styles.css
├── docs/                   # Documentation
└── icons/                  # Test icons (gitignored)
```

### Files Ignored by Git

These files/folders are safe to create for local testing:

#### Files:
- `*_test.html` (e.g., `index_test.html`)
- `*_backup.*` (e.g., `index_old_backup.html`)
- `*_old.*`
- `*.tmp`, `*.temp`, `*.log`

#### Folders:
- `/_tests/`
- `/_local/`
- `/_dev/`
- `/icons/` (your test icons)
- `/node_modules/`

### Local Development

1. **Use VSCode Live Server** (recommended):
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"
   - Hot reload enabled ✨

2. **Or use the provided scripts**:
   ```bash
   ./start-local.sh   # Linux/Mac/WSL
   start-local.bat    # Windows
   ```

---

## 🌿 Git Workflow

### Before You Start

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

```bash
# Check what files you've modified
git status

# Review your changes
git diff

# Add specific files (recommended)
git add path/to/file.js

# Or add all changes (be careful)
git add .
```

### Committing

```bash
# Commit with a descriptive message
git commit -m "feat: add style detection fallback"
```

#### Commit Message Convention

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add duotone style detection"
git commit -m "fix: category unification not working with nested folders"
git commit -m "docs: update CATEGORIZATION.md with new examples"
git commit -m "refactor: simplify parseFilePath logic"
```

### Before Pushing - Checklist

- [ ] `git status` - Verify what's being committed
- [ ] `git diff` - Review your changes
- [ ] No test files in staging
- [ ] No backup files in staging
- [ ] Code tested locally
- [ ] Console has no errors
- [ ] Commit message is descriptive

### Pushing Changes

```bash
# Push your feature branch
git push origin feature/your-feature-name

# If it's your first push on this branch
git push -u origin feature/your-feature-name
```

---

## 🎨 Code Style

### JavaScript

- Use ES6+ features (modules, arrow functions, etc.)
- Use `const` and `let`, avoid `var`
- Descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

**Example:**
```javascript
/**
 * Detects style from SVG element content
 * @param {SVGElement} svgElement - The SVG element to analyze
 * @returns {string} Detected style: 'Outline', 'Solid', 'Duotone', or ''
 */
function detectStyleFromSVG(svgElement) {
  // Implementation...
}
```

### HTML/CSS

- Semantic HTML
- CSS variables for theming
- Mobile-first responsive design
- Accessible (ARIA labels where needed)

---

## 🧪 Testing

### Manual Testing

Before submitting:

1. **Test locally**:
   - Start server
   - Load test icons
   - Verify categories work
   - Test all features

2. **Check console** (F12):
   - No red errors
   - No warnings about modules
   - Categorization stats look correct

3. **Test different scenarios**:
   - Different folder structures
   - Mixed styles
   - Edge cases

### What to Test

- [ ] Icon loading
- [ ] Category detection
- [ ] Style badges display
- [ ] Search functionality
- [ ] Filter functionality
- [ ] Color picker
- [ ] Size slider
- [ ] Favorites
- [ ] Modal preview
- [ ] Copy to clipboard
- [ ] Download

See [HOW_TO_TEST.md](HOW_TO_TEST.md) for detailed testing guide.

---

## 📤 Submitting Changes

### Pull Request Process

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**:
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Description should include**:
   - What changed
   - Why it changed
   - Screenshots (if UI changes)
   - Testing done
   - Related issues

### Example PR Description

```markdown
## Description
Added support for Duotone style detection in SVG files.

## Changes
- Added duotone detection logic in `categoryManager.js`
- Updated style badges to show duotone
- Added tests for duotone icons

## Testing
- ✅ Tested with duotone icons from multiple icon packs
- ✅ Verified badges display correctly
- ✅ No console errors
- ✅ Works with existing outline/solid detection

## Screenshots
[Include screenshots if applicable]

Closes #42
```

---

## 📋 Quick Reference

### Common Git Commands

```bash
# Check status
git status

# See changes
git diff

# Add files
git add file.js

# Commit
git commit -m "feat: description"

# Push
git push origin branch-name

# Update from main
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

### Development Commands

```bash
# Start server (Linux/Mac)
./start-local.sh

# Start server (Windows)
start-local.bat

# Or use Python
python -m http.server 8000

# Or use Node
npx serve -l 3000
```

---

## 🆘 Getting Help

- **Bug found?** Open an issue on GitHub
- **Question?** Check existing issues or create a new one
- **Documentation unclear?** Open an issue to improve it

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to SVGaze! 🎉**
