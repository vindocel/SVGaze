# 🔧 Troubleshooting - SVGaze

## ❌ Problem: SVGs Detected but Don't Appear

### Cause
You opened the file with double-click (`file://` protocol), but ES6 modules need HTTP server.

### Console Error (F12)
Probably shows:
```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

---

## ✅ QUICK SOLUTION

### Option 1: Python (RECOMMENDED)
```bash
# Open terminal in project folder
cd /path/to/SVGaze

# Start server
python -m http.server 8000

# Open browser at:
http://localhost:8000
```

### Option 2: Node.js
```bash
npx serve
```

### Option 3: VSCode Live Server
1. Install "Live Server" extension
2. Right-click on `index.html` → "Open with Live Server"

---

## 🐛 OTHER PROBLEMS

### SVGs Load but Wrong Categories
**See:** Console (F12) → Look for "Categorization Stats"
**Debug:**
```javascript
svgViewer.getAll()[0]
```

### Modal Doesn't Open
**Check:** Console has module error?
**Solution:** Use HTTP server

### Badges Don't Appear
**Check:** CSS loaded?
**Solution:** See Network tab (F12) if CSS files loaded

---

## 📞 Need Help?

1. Open Console (F12)
2. Copy error messages
3. Open issue on GitHub
