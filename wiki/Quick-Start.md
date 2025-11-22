# Quick Start Guide

Get started with SVGaze in 30 seconds! This guide will help you view your first SVG icons.

---

## Option 1: Online (Recommended) 🌐

The fastest way to start using SVGaze:

1. **Visit:** [app.svgaze.com](https://app.svgaze.com)
2. **Click** "Select folder" button in the header
3. **Choose** a folder containing your SVG files
4. **Browse** your icons in the gallery! 🎉

**That's it!** No installation, no configuration required.

---

## Option 2: Local Server 💻

For offline use or development:

### Windows

```bash
# Navigate to SVGaze folder
cd path/to/SVGaze

# Run the start script
start-local.bat
```

Your browser will open automatically at `http://localhost:8000`

### macOS / Linux

```bash
# Navigate to SVGaze folder
cd path/to/SVGaze

# Make script executable (first time only)
chmod +x start-local.sh

# Run the start script
./start-local.sh
```

Your browser will open automatically at `http://localhost:8000`

### Manual Server Setup

If the scripts don't work, start a server manually:

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## First Steps

### 1. Select Your SVG Folder

Click the **"Select folder"** button in the header and choose a directory containing SVG files.

**Recommended folder structure:**
```
icons/
├── Outline/
│   ├── Brands/
│   │   ├── github.svg
│   │   └── twitter.svg
│   └── Devices/
│       ├── phone.svg
│       └── laptop.svg
└── Solid/
    ├── Brands/
    └── Devices/
```

### 2. Browse Your Icons

- **Gallery view** shows all your SVGs as a responsive grid
- **Click any card** to open a larger preview modal
- **Search bar** filters icons by filename
- **Category dropdown** filters by folder structure
- **Size slider** adjusts icon display size

### 3. Use Your Icons

**Copy SVG Code:**
1. Click on any icon card
2. Click "Copy SVG" in the modal
3. Paste into your project

**Edit SVG:**
1. Click "Edit" on any icon card
2. Modify code in the editor
3. Export in multiple formats (React, PNG, etc.)

**Mark Favorites:**
1. Click the star icon on any card
2. Access favorites quickly via the "Favorites" section

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modal |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + K` | Open command palette (coming soon) |

---

## Next Steps

- **[Gallery Guide](Gallery-Guide)** - Learn all gallery features
- **[Editor Guide](Editor-Guide)** - Master the SVG editor
- **[Search & Filters](Search-and-Filters)** - Find icons faster
- **[Export Formats](Export-Formats)** - Export for different platforms

---

## Troubleshooting

### Can't Select Folder?

**Problem:** "Select folder" button doesn't work.

**Solutions:**
- Use a supported browser (Chrome 90+, Edge 90+, Safari 14+)
- Make sure you're using HTTPS or localhost (not `file://`)
- Check if File System Access API is enabled in your browser

### Icons Not Appearing?

**Problem:** Gallery is empty after selecting folder.

**Solutions:**
- Verify the folder contains `.svg` files
- Check browser console (F12) for errors
- Try a different folder with known-good SVGs

### Performance Issues?

**Problem:** App is slow with many SVGs.

**Solutions:**
- Close other browser tabs to free memory
- Use category filters to reduce visible icons
- Clear browser cache and reload

---

## Need Help?

- 📖 [Full Documentation](Home)
- 💬 [Ask a Question](https://github.com/vindocel/SVGaze/discussions)
- 🐛 [Report a Bug](https://github.com/vindocel/SVGaze/issues)
- 🌐 [Live Demo](https://app.svgaze.com)
