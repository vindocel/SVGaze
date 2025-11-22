# SVGaze Editor - Complete Documentation

## Overview

The **SVGaze Editor** is a complete SVG code editor integrated into SVGaze. It allows editing, viewing, transforming, optimizing and exporting SVG files in multiple formats, all in real-time.

---

## Main Features

### 🎨 Split-Pane Interface
- **Code Editor** (left): Editor with custom syntax highlighting for SVG/XML
- **Live Preview** (right): Real-time visualization with advanced controls
- **Resizable Divider**: Adjust pane sizes as needed

---

## ✍️ Code Editor

### Syntax Highlighting
- Custom highlighting for SVG/XML tags, attributes, values and comments
- Adaptive colors per theme (light/dark)
- Full SVG syntax support

### Features
- Tab support for indentation (2 spaces)
- Configurable word wrap
- Preview auto-update (debounced 300ms)
- Real-time file size display
- Upload button to load SVG from system
- Copy code to clipboard

---

## 👁️ Live Preview

### Zoom Controls
- **Range**: 10% to 5000%
- **+/- Buttons**: Incremental zoom
- **Ctrl + Scroll**: Continuous zoom with mouse wheel
- **Fit to View**: Automatically adjusts to area size
- **Integer values**: Displays "106%" instead of "106.1520150601%"

### Pan/Navigation
- **Ctrl + Click + Drag**: Moves preview in viewing area
- Smooth and responsive navigation

### Viewing Options
- **Toggle Grid**: Reference grid for alignment
- **Toggle Checkered**: Checkered background to see transparency
- **Information**: Displays dimensions (width × height) of SVG

### Error Detection
- Shows error messages for invalid SVG
- Immediate visual feedback

---

## 🔄 Transformation Tools

### Rotation
- **90° clockwise rotation**: Rotates SVG to the right
- **90° counter-clockwise rotation**: Rotates SVG to the left

### Flipping
- **Horizontal Flip**: Mirrors horizontally
- **Vertical Flip**: Mirrors vertically

### Dimensions Editor
- Change SVG width and height
- **Proportional lock**: Maintains aspect ratio when changing dimensions
- Apply new dimensions to SVG

---

## ⚡ SVGO Optimization

### Configuration Modal
- **20+ optimization options** individually configurable
- Real-time before/after preview
- Size reduction display in percentage
- Button to reset settings to default

### Available Plugins
- Remove comments
- Remove XML declarations
- Remove DOCTYPE
- Remove unnecessary whitespace
- Round decimal numbers
- Remove attributes with default values
- Clean unused IDs
- Merge paths
- Remove empty elements
- And much more...

### Size Comparison
```
578 bytes → 493 bytes (-15%)
```

---

## 📤 Export System (5 Tabs)

### 1. Preview
- SVG visualization with all zoom controls
- Same features as main preview
- Ideal for detailed inspection

### 2. React (JSX)
- Converts SVG to functional React component
- **Configurable options**:
  - TypeScript (adds types)
  - Single quotes (style guide)
- Transforms HTML attributes to React props:
  - `class` → `className`
  - `stroke-width` → `strokeWidth`
  - `fill-opacity` → `fillOpacity`
  - etc.
- Copies complete component code
- Ready to use in React projects

### 3. React Native
- Template for react-native-svg
- Package installation instructions
- Ready component structure
- SVG code included as reference

### 4. PNG
- PNG image export
- **Available scales**: 1x, 2x, 3x, 4x
- Preview with max size of 400px
- Download preserves selected scale
- Ideal for assets at different densities

### 5. Data URI
- Encodes SVG as Data URI
- **Two formats**:
  - base64: `data:image/svg+xml;base64,...`
  - encodeURIComponent: `data:image/svg+xml,...`
- Can be used in CSS, HTML or JavaScript
- Copies directly to clipboard

---

## 🎨 Intelligent Color Detection

### How It Works
- Automatically detects if SVG is monochromatic or multicolored
- Analyzes all `fill` and `stroke` attributes
- Resolves colors from CSS classes (`<style>` tags)

### Theme Application
- **Monochromatic SVGs**: Applies theme color (black in light, white in dark)
- **Multicolored SVGs**: Preserves original colors
- Smooth transition between themes

### CSS Resolution
For SVGs with CSS classes like:
```xml
<style>.fil1 {fill:black}</style>
<path class="fil1" d="..."/>
```
The system converts to inline attributes before color detection.

---

## 🔗 Gallery Integration

### Open from Card
- **"Edit"** button on each gallery card
- Opens SVG directly in editor

### Open from Modal
- **"Edit"** button in preview modal
- Loads SVG with file name

### Navigation
- **Gallery ↔ Editor** switch in header
- Maintains context when switching views

### JavaScript API
```javascript
// Open SVG in editor programmatically
openInEditor(svgCode, fileName);
```

---

## 🔔 Notification System (Toast)

### States
- **Success**: Actions completed successfully
- **Error**: Failures with explanatory message

### Behavior
- Auto-dismiss after a few seconds
- Fixed positioning on screen
- Smooth entry/exit animation

---

## 📁 File Operations

### Upload (Load SVG)
- Opens system file picker
- Accepts `.svg` files
- Loads content in editor
- Updates file name

### Copy Code
- Copies SVG code to clipboard
- Visual feedback with toast

### Download
- Downloads SVG file
- Uses current file name
- Format: `<filename>.svg`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|--------|------|
| `Ctrl + Scroll` | Zoom in/out in preview |
| `Ctrl + Click + Drag` | Pan in preview |
| `Tab` | Insert 2 spaces (indentation) |
| `Esc` | Close modals |

---

## 🎯 How to Use

### 1. Access the Editor
- Click the **"Editor"** button in application header
- Or click **"Edit"** on any gallery card

### 2. Load SVG
- Click **"Load SVG"** to open file from system
- Or paste SVG code directly in editor
- Or click "Edit" on an icon from gallery

### 3. View in Real-Time
- Preview updates automatically as you type
- Use zoom controls to adjust visualization
- Toggle grid/checkered to assist with positioning

### 4. Transform SVG
- Use rotation and flip tools
- Adjust dimensions with proportional lock

### 5. Optimize with SVGO
- Click the **SVGO** button
- Configure desired plugins
- See before/after comparison
- Apply optimization

### 6. Export
- Choose desired export tab
- **Preview**: Visualization with zoom
- **React**: JSX component
- **React Native**: Template with react-native-svg
- **PNG**: Image with configurable scale
- **Data URI**: Encoded URI

---

## 🌓 Light/Dark Theme

### Automatic Adaptation
- Editor colors adapt to theme
- Preview respects global theme
- Syntax highlighting with appropriate colors

### Dynamic Favicon
- Favicon changes according to theme
- Dark mode: dark background
- Light mode: light background

---

## 📱 Responsiveness

### Desktop (≥ 900px)
- Horizontal layout (editor | preview)
- All tools visible

### Mobile (< 900px)
- Vertical layout (editor above, preview below)
- Optimized buttons
- Divider adjusted to drag vertically

---

## 🚀 Technical Architecture

### JavaScript Modules

```
js/modules/
├── viewManager.js              # Manages Gallery ↔ Editor switch
├── editorManager.js            # Main editor orchestrator
├── editorCodeManager.js        # Manages code editor
├── editorPreviewManager.js     # Manages live preview
├── editorToolsManager.js       # Main tools
├── editorExportManager.js      # Multi-format export
├── editorTabManager.js         # Export tab system
├── editorTransformManager.js   # Rotation, flip
├── editorDimensionsManager.js  # Dimensions editor
├── editorSvgoManager.js        # SVGO integration
├── editorSvgMapper.js          # SVG to React/RN mapping
├── editorSyntaxHighlighter.js  # Custom syntax highlighting
├── svgColorDetector.js         # Monochromatic/multicolored detection
└── toast.js                    # Notifications
```

### CSS Files

```
css/components/
├── editor.css       # Complete editor styles
├── svgo-modal.css   # SVGO configuration modal
└── toast.css        # Toast notifications
```

### Technologies
- **Zero Runtime Dependencies**: 100% vanilla JavaScript
- **CDN only for**: CodeMirror (syntax), SVGO (optimization), Prism (highlight)
- **ES6 Modules**: Modular and organized architecture
- **CSS Variables**: Consistent design system
- **Native APIs**: DOMParser, Canvas, Clipboard, FileReader

---

## 🐛 Error Handling

### Invalid Syntax
- Shows error in preview
- Indicates problem line when possible

### Empty File
- Shows informative placeholder

### Clipboard Failed
- Opens modal with code to copy manually
- Alternative for browsers without support

### Export Failed
- Displays clear error message
- Toast with problem information

---

## ✅ Implemented Features

- [x] Custom syntax highlighting for SVG/XML
- [x] Live preview synchronized with code
- [x] Zoom from 10% to 5000%
- [x] Pan with Ctrl+mouse
- [x] Toggle grid and checkered background
- [x] 90°/-90° rotation
- [x] Horizontal/vertical flipping
- [x] Dimensions editor with proportions
- [x] SVGO modal with 20+ options
- [x] React JSX export (optional TypeScript)
- [x] React Native export
- [x] PNG export with 1x-4x scales
- [x] Data URI export (base64 and encoded)
- [x] Intelligent color detection
- [x] CSS classes resolution to attributes
- [x] Gallery integration (Edit button)
- [x] Toast system for notifications
- [x] Adaptive light/dark theme

---

## 🔮 Next Improvements (v3.0)

- [ ] Visual path editing (control points)
- [ ] Inline color picker

**[📖 See complete roadmap](ROADMAP.md)**

---

**Developed with ❤️ for SVGaze**
