# SVGaze 🔍

> Modern SVG icon viewer and editor — fully local, no uploads, 100% privacy

**SVGaze** is an open-source web application that lets you view, organize, edit, and export local SVG files directly in your browser, with no upload or backend required.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://app.svgaze.com)

---

## ✨ Key Features

### 🎯 SVG Gallery
- Responsive gallery with adaptive grid and real-time preview
- Smart categorization — detects semantic categories vs styles
- Instant search and filters by category/style
- Favorites system with local persistence
- Style badges (Outline, Solid) on cards

### ✏️ Integrated SVG Editor
- Code editor with syntax highlighting
- Live preview with zoom (10%-5000%), pan, and grid
- 5 export formats: Preview, React, React Native, PNG, Data URI
- SVGO optimization with 20+ configurable options
- Transformation tools (rotate, flip, dimensions)

**[📖 Complete Editor Documentation](docs/EDITOR.md)**

### 🌍 Internationalization
- Automatic system language detection (PT-BR, EN-US)
- Manual language switcher in header
- Complete UI translation on language change
- Language preference saved to localStorage

### 🎨 Customization
- Global color picker with theme-adaptive colors
- Light/dark theme with smooth transitions
- Size control (24px - 180px)
- Standardized 20×20px icons across all UI elements

### 🔒 Security
- 100% local processing — your files never leave the browser
- SVG sanitization — removes scripts and malicious content
- No tracking — complete privacy

---

## 🚀 How to Use

### Online (Recommended)
1. Visit: **[app.svgaze.com](https://app.svgaze.com)**
2. Click **"Select folder"**
3. Choose your SVG folder
4. Enjoy! 🎉

### Local

```bash
git clone https://github.com/vindocel/SVGaze.git
cd SVGaze

# Windows:
start-local.bat

# Linux/Mac:
./start-local.sh
```

**[📖 Complete Installation Guide](docs/QUICK_START.md)** | **[🧪 How to Test](docs/HOW_TO_TEST.md)**

---

## 📁 Smart Categorization

SVGaze automatically detects your folder structure:

```
icons/
├── Outline/           ← Style (ignored as category)
│   ├── Brands/        ← Semantic category
│   └── Devices/
└── Solid/             ← Style
    ├── Brands/
    └── Devices/
```

**Result:** Filter shows "Brands" and "Devices" (not "Outline"/"Solid"), with style badges on cards.

**[📖 Complete Categorization Documentation](docs/CATEGORIZATION.md)**

---

## 🛠️ Technologies

- **26 JavaScript ES6 modules** — modular architecture
- **12 CSS files** — componentized design system
- **Zero runtime dependencies** — vanilla JS
- **Native APIs:** File System Access, DOMParser, Clipboard, LocalStorage

---

## 📚 Documentation

| Guide | Description |
|------|-----------|
| 🚀 **[Quick Start](docs/QUICK_START.md)** | Get started in 30 seconds |
| 🧪 **[How to Test](docs/HOW_TO_TEST.md)** | Complete guide with troubleshooting |
| ✏️ **[SVG Editor](docs/EDITOR.md)** | Complete editor documentation |
| 🧠 **[Categorization](docs/CATEGORIZATION.md)** | Smart detection system |
| 🔧 **[Troubleshooting](docs/TROUBLESHOOTING.md)** | Problem solving |
| 🗺️ **[Roadmap](docs/ROADMAP.md)** | Development plan |

---

## 🗺️ Roadmap

| Version | Status |
|--------|--------|
| v1.0 - Viewer | ✅ Completed |
| v1.1 - UX Improvements | ✅ Completed |
| v2.0 - SVG Editor | ✅ Completed |
| v2.1 - Internationalization | ✅ Completed |
| v3.0 - Advanced | 📋 Planned |

**[📖 View complete roadmap](docs/ROADMAP.md)**

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|-----------|--------|--------|
| Chrome | 90+ | ✅ |
| Edge | 90+ | ✅ |
| Firefox | 88+ | ⚠️ Experimental |
| Safari | 14+ | ✅ |

---

## 🤝 Contributing

Contributions are welcome!

- 🐛 **[Report bugs](https://github.com/vindocel/SVGaze/issues)**
- 💡 **Suggest features**
- 🔧 **Pull requests**

### Guidelines
- Vanilla code (no dependencies)
- ES6 modules
- Semantic commits

---

## 📄 License

**MIT License** — use commercially, modify, distribute freely.

⚠️ **"SVGaze"** and **"svgaze.com"** are registered trademarks.

---

## 👤 Author

**Vindocel** — [@vindocel](https://github.com/vindocel) | [app.svgaze.com](https://app.svgaze.com)

---

<div align="center">

**If this project was helpful, consider giving it a ⭐ on the repository!**

[🌐 App](https://app.svgaze.com) • [📖 Docs](docs/) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
