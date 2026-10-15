# 🚀 How to Test SVGaze Locally

## ✅ Easiest Method: Automatic Script

### Option A: Windows
1. **Double click** on `start-local.bat`
2. Wait for browser to open automatically
3. Done! 🎉

### Option B: Linux/Mac
1. Open terminal in project folder
2. Execute: `./start-local.sh`
3. Wait for browser to open automatically
4. Done! 🎉

**What the script does:**
- ✅ Checks if Node.js is installed
- ✅ Starts server on port 3000
- ✅ Opens browser automatically (macOS, Linux, WSL)
- ✅ Shows clear instructions

**If Node.js is not installed:**
- Download: https://nodejs.org/ (choose LTS)
- Install
- Run script again

---

### Option C: VSCode Live Server (Recommended for Development)

#### First time (setup):
1. Open VSCode
2. Open project folder: `File → Open Folder` → SVGaze
3. Go to Extensions (Ctrl+Shift+X)
4. Search "Live Server"
5. Install extension by **Ritwick Dey**

#### Every time you want to test:
1. Open `index.html` in VSCode
2. **Right-click** in code
3. Click "**Open with Live Server**"
4. Opens automatically! ✅

**Advantages:**
- 🔥 Hot reload (saves and updates automatically)
- 🎨 See changes instantly
- 💯 No terminal needed

---

## 🧪 Testing the App

### 1. Select Icon Folder
- Click "**Select folder**" button
- Navigate to `icons/` (in project root)
- Confirm

### 2. Verify Categories
**Should appear in filter:**
```
All categories
Brands
Communication
Devices
Files
General
Interface
Media
Navigation
Status
```

**Should NOT appear:**
- ❌ Outline
- ❌ Solid
- ❌ icons (root folder)

### 3. Verify Badges
Each card should have:
- 🔵 **Blue badge** → "Outline" or "Solid"
- File name
- Buttons: ★ Open Copy Download

### 4. Test Filter
- Select "**Brands**" in filter
- Should show icons from:
  - `icons/Outline/Brands/`
  - `icons/Solid/Brands/`
- Both in same list!
- Each with correct badge

### 5. Test Gallery Features
- [ ] **Search:** Type "Adobe" → filters
- [ ] **Color:** Change color → icons change
- [ ] **Size:** Drag slider → icons grow
- [ ] **Favorite:** Click ★ → turns golden
- [ ] **Modal:** Click "Open" → large preview
- [ ] **Copy:** Click "Copy" → code copied
- [ ] **Download:** Click "Download" → file downloaded
- [ ] **Edit:** Click "Edit" → opens in Editor

---

## ✏️ Testing the SVG Editor

### 1. Access the Editor
- [ ] Click **"Editor"** button in header
- [ ] Or click **"Edit"** on any gallery card
- [ ] Editor should open with split-pane interface

### 2. Load SVG
- [ ] Click **"Load SVG"** → select file
- [ ] File loads in editor
- [ ] File name updates
- [ ] Preview shows the SVG

### 3. Edit Code
- [ ] Type/paste SVG code in editor
- [ ] Preview updates in real-time
- [ ] Syntax highlighting works (colors in tags)
- [ ] Tab inserts 2 spaces

### 4. Preview Controls
- [ ] **Zoom +/-:** Buttons work
- [ ] **Ctrl + Scroll:** Zoom with mouse works
- [ ] **Fit to View:** Adjusts to area size
- [ ] **Pan:** Ctrl + Click + Drag moves preview
- [ ] **Grid toggle:** Turns grid on/off
- [ ] **Checkered toggle:** Turns checkered background on/off
- [ ] **Dimensions:** Shows width × height

### 5. Transformation Tools
- [ ] **90° clockwise rotation:** SVG rotates right
- [ ] **90° counter-clockwise rotation:** SVG rotates left
- [ ] **Horizontal flip:** Mirrors horizontally
- [ ] **Vertical flip:** Mirrors vertically
- [ ] **Dimensions editor:** Changes size with aspect ratio

### 6. SVGO Optimization
- [ ] Click **SVGO** button → modal opens
- [ ] Configure plugins (checkboxes)
- [ ] Click **Optimize** → code optimized
- [ ] Shows comparison: "578 bytes → 493 bytes (-15%)"
- [ ] **Reset** restores default settings

### 7. Export Tabs
- [ ] **Preview:** Shows SVG with zoom controls
- [ ] **React:** Generates JSX component
  - [ ] TypeScript toggle works
  - [ ] Single quotes toggle works
  - [ ] Copy button copies code
- [ ] **React Native:** Shows template with instructions
  - [ ] Copy button works
- [ ] **PNG:** Shows image preview
  - [ ] Scale selector (1x-4x) works
  - [ ] Download button downloads PNG
- [ ] **Data URI:** Shows encoded URI
  - [ ] base64/encoded toggle works
  - [ ] Copy button works

### 8. Gallery Integration
- [ ] Click "Edit" on card → opens in Editor with SVG
- [ ] Click "Edit" in modal → opens in Editor with SVG
- [ ] File name appears in editor
- [ ] Gallery ↔ Editor switch in header works

### 9. Toast System
- [ ] Copy code → "Copied!" toast appears
- [ ] Error → red toast appears
- [ ] Toast disappears automatically

### 10. Light/Dark Theme
- [ ] Editor adapts colors to theme
- [ ] Syntax highlighting changes colors
- [ ] Preview adapts to theme
- [ ] Monochromatic SVGs change color (black/white)

---

## 🔍 Check Console (Debug)

### Open Console:
- Press **F12**
- Or right-click → "Inspect"
- Tab "**Console**"

### Expected messages:
```
🎨 SVGaze initializing...
✅ SVGaze initialized successfully
📂 Loaded 145 SVG files
Categorization Stats: {
  totalItems: 145,
  totalCategories: 9,
  totalStyles: 2,
  categories: {
    Brands: { count: 24, styles: ['Outline', 'Solid'] }
    ...
  }
}
```

### Should NOT have:
- ❌ Red errors
- ❌ "Failed to load module"
- ❌ "CORS policy"
- ❌ "Cannot find module"

---

## 🐛 Troubleshooting

### Problem: "Failed to load module"
**Cause:** Opened with double-click (`file://` protocol)
**Solution:** Use `start-local.bat` or Live Server

### Problem: Node.js not found
**Solution:**
1. Install Node.js: https://nodejs.org/
2. Restart terminal/VSCode
3. Try again

### Problem: Blank page
**Debug:**
1. Open console (F12)
2. See error messages
3. Check if CSS/JS files loaded (Network tab)

### Problem: Wrong categories
**Debug in console:**
```javascript
// See detected structure
svgaze.getAll()[0]._debug

// See all categories
svgaze.getAll().map(i => i.category)
```

---

## ✅ Testing Checklist

### Gallery Features:
- [ ] HTTP server working
- [ ] Icons load from `icons/` folder
- [ ] Correct categories (Brands, Communication, etc)
- [ ] Badges appear (Outline, Solid)
- [ ] Search works
- [ ] Filter works
- [ ] Color and size work
- [ ] Modal opens and closes
- [ ] Copy and download work
- [ ] "Edit" button works
- [ ] Console without errors

### Editor Features:
- [ ] Editor opens correctly
- [ ] Load SVG works
- [ ] Syntax highlighting works
- [ ] Live preview works
- [ ] Zoom and pan work
- [ ] Rotation and flip work
- [ ] SVGO optimizes correctly
- [ ] React export works
- [ ] React Native export works
- [ ] PNG export works
- [ ] Data URI export works
- [ ] Toast notifications appear
- [ ] Gallery integration works
- [ ] Light/dark theme adapts

---

## 🎯 Quick Reference

| Action | Command/Method |
|------|----------------|
| Start server | Double click `start-local.bat` |
| VSCode Live Server | Right-click → Open with Live Server |
| See console | F12 |
| Debug categories | `svgaze.getAll()[0]._debug` |
| Hard refresh (no cache) | Ctrl+Shift+R |

---

## 💡 Tips

### For Effective Tests:
- Use **VSCode Live Server** → automatic hot reload
- Keep console open (F12) → see errors immediately
- Use `Ctrl+Shift+R` → hard refresh without cache
- Test in different browsers (Chrome, Firefox, Safari)
- Test with different folder structures
- Always check console to detect problems

---

## 🚀 You're ready!

1. **Double click** on `start-local.bat`
2. **Select folder** `icons/`
3. **See the magic happen** ✨

**Problems?** See `TROUBLESHOOTING.md` or open issue! 🎯
