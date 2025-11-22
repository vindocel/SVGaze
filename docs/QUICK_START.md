# 🚀 Quick Start - SVGaze

## TL;DR

### Windows
```bash
# Double click: start-local.bat
```

### Linux/Mac
```bash
# Run script:
./start-local.sh
```

### Any System (Python)
```bash
python -m http.server 8000
# Open: http://localhost:8000
```

---

## ⚡ Quick Start

### 1️⃣ Start HTTP Server

#### Option A: Automatic Script (Recommended)

**Windows:**
```bash
# Double click:
start-local.bat
```

**Linux/Mac:**
```bash
# In terminal:
./start-local.sh
```

**What the script does:**
- ✅ Checks if Node.js is installed
- ✅ Starts server on port 3000
- ✅ Opens browser automatically
- ✅ Shows clear instructions

#### Option B: Manually

**Python:**
```bash
cd /path/to/SVGaze
python -m http.server 8000
# Or: python3 -m http.server 8000
```

**Node.js:**
```bash
npx serve -l 3000
```

**VSCode:**
- Install "Live Server" extension
- Right-click → Open with Live Server

### 2️⃣ Open in Browser
```
http://localhost:8000
```

### 3️⃣ Select Folder
1. Click "Select folder" button
2. Navigate to `icons/` (in project root)
3. Select and confirm

### 4️⃣ Verify
**Should show:**
- ✅ Categories: Brands, Communication, Devices, Files, General, Interface, Media, Navigation, Status
- ✅ Cards with blue "Outline" or "Solid" badges
- ✅ Console without errors (F12)

---

## 🎯 What to Test

### Intelligent Categorization
1. Filter by "Brands"
2. See icons from **two** folders:
   - `icons/Outline/Brands/`
   - `icons/Solid/Brands/`
3. Each with correct badge

### Gallery Features
- 🎨 Change color → icons change
- 📏 Change size → icons grow/shrink
- 🔍 Search → filters instantly
- ⭐ Favorite → star turns golden
- 📂 Modal → large preview
- 📋 Copy → code to clipboard
- ⬇️ Download → file downloaded
- ✏️ Edit → opens in Editor

### 5️⃣ Use the SVG Editor
1. Click **"Editor"** button in header
2. Or click **"Edit"** on any card
3. Editor opens with SVG loaded

### Editor Features
- 📝 Edit code with syntax highlighting
- 👁️ Preview updates in real-time
- 🔍 Zoom with Ctrl+scroll or buttons
- 🔄 Rotate and flip SVG
- ⚡ Optimize with SVGO
- 📤 Export: React, React Native, PNG, Data URI
- 📐 Change dimensions with aspect ratio

---

## ✅ Everything OK?

**Console shows:**
```
🎨 SVGaze initializing...
✅ SVGaze initialized successfully
Successfully processed 145 SVG files
Categorization Stats: {...}
```

**No red errors!**

---

## ❌ Got Error?

### "Failed to load module"
**→ Use HTTP server** (methods above)

### Blank page
**→ Check console (F12)**

### Wrong categories
**→ Open issue on GitHub with screenshot**

---

## 📚 More Information

- **SVG Editor:** [EDITOR.md](EDITOR.md)
- **Complete tests:** [HOW_TO_TEST.md](HOW_TO_TEST.md)
- **Documentation:** [CATEGORIZATION.md](CATEGORIZATION.md)
- **Roadmap:** [ROADMAP.md](ROADMAP.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Questions?** Open issue on GitHub! 🚀
