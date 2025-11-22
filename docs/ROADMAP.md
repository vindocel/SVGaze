# 🗺️ SVGaze Roadmap

This document describes SVGaze's development planning, including implemented features, in-progress work, and future plans.

---

## 📊 Overall Project Status

| Version | Status | Progress | Date |
|--------|--------|-----------|------|
| v1.0 - Viewer | ✅ Completed | 100% | Jan 2025 |
| v1.1 - UX Improvements | ✅ Completed | 100% | Jan 2025 |
| v2.0 - SVG Editor | ✅ Completed | 100% | Jan 2025 |
| v3.0 - Advanced | 📋 Planned | 0% | TBD |

---

## ✅ v1.0 - Viewer (Completed)

### Goals
Create a local SVG file viewer with basic organization and customization features.

### Implemented Features

#### 🎯 Visualization
- [x] Responsive gallery with CSS Grid
- [x] Real-time preview of all SVGs
- [x] Enlarged view modal
- [x] Automatic grouping by folders
- [x] Subcategory badges
- [x] Aspect ratio preservation
- [x] viewBox support with automatic correction
- [x] Correct rendering of stroke-only icons (outline)
- [x] Optimized button layout (actions on same line)

#### 🔍 Search and Organization
- [x] Search system by file name
- [x] Category filter based on folder structure
- [x] Style filter (Outline, Solid, Linear, etc)
- [x] Intelligent sorting grouping variants
- [x] Support for compound styles ("Linear (Border)")
- [x] Support for varied separators ("Name- Style", "Name - Style")
- [x] Icon counter per category

#### 🎨 Customization
- [x] Global color picker with real-time preview
- [x] Size control via slider (24px - 180px)
- [x] `currentColor` application for SVGs
- [x] Modern interface with design system

#### ⭐ Management
- [x] Favorites system
- [x] Local persistence via localStorage
- [x] Favorites appear at top of list
- [x] Button to clear all favorites

#### 🔧 Utilities
- [x] Copy SVG code to clipboard
- [x] Copy file name
- [x] Copy full path
- [x] Individual SVG download
- [x] Keyboard shortcuts (Esc, Ctrl+F)

#### 🔒 Security
- [x] 100% local processing (no upload)
- [x] SVG sanitization (removes scripts, XSS)
- [x] No external dependencies
- [x] No tracking or analytics

#### 🌐 Compatibility
- [x] Works in modern browsers (Chrome, Edge, Firefox, Safari)
- [x] `webkitdirectory` support for folder selection
- [x] Responsive for mobile and desktop
- [x] Compatible with GitHub Pages

---

## ✅ v1.1 - User Experience Improvements (Completed)

### Goals
Improve usability, accessibility and overall user experience.

### Completed: January 2025

### Planned Features

#### 🌓 Light/Dark Theme
- [x] Theme system with CSS variables
- [x] Theme toggle in header
- [x] User preference persistence
- [x] Smooth transitions between themes
- [x] Respect system preference (`prefers-color-scheme`)
- [x] Dark theme with neutral gray palette (#1d1f24)
- [x] Adaptive colors per theme (black/white SVGs)

**Progress:** 100% ✅

#### 📦 Export and Backup
- [ ] Export favorites list as JSON
- [ ] Import favorites from JSON file
- [ ] Export entire SVG collection
- [ ] Automatic configuration backup

**Progress:** 0%

#### 🎨 Alternative View
- [ ] Toggle between Grid View and List View
- [ ] Compact grid (more icons per row)
- [ ] Expanded grid (fewer icons, larger)
- [ ] Persist view preference

**Progress:** 0%

#### ⌨️ Keyboard Shortcuts
- [x] Esc to close modal (implemented)
- [x] Ctrl+F for search (implemented)
- [ ] Arrows to navigate between icons in modal
- [ ] Enter to open modal of selected item
- [ ] Ctrl+C to copy selected SVG
- [ ] F key to add/remove favorite
- [ ] Help page with all shortcuts

**Progress:** 30%

#### 🎯 Drag & Drop
- [ ] Drag and drop SVG folder
- [ ] Drag and drop individual SVG files
- [ ] Visual feedback during drag
- [ ] Support for multiple folders

**Progress:** 0%

#### 🌍 Internationalization (i18n)
- [x] Translation system implemented
- [x] Portuguese language (pt-BR) complete
- [ ] English language (en-US)
- [ ] Language selector in header
- [ ] Automatic browser language detection
- [ ] Language choice persistence

**Progress:** 60% (Structure ready, missing English)

#### ♿ Accessibility
- [ ] Full screen reader support
- [ ] Enhanced keyboard navigation
- [ ] Visible focus indicators
- [ ] Adequate contrast in all themes
- [ ] Complete ARIA labels
- [ ] Tests with accessibility tools

**Progress:** 20%

#### 📊 Statistics and Information
- [ ] Statistics panel (total SVGs, categories, etc)
- [ ] Display SVG file sizes
- [ ] Show original SVG dimensions
- [ ] Loading time
- [ ] Distribution chart per category

**Progress:** 0%

---

## ✅ v2.0 - SVG Editor (Completed)

### Goals
Add a complete SVG editor with code, live preview, transformations and multi-format export.

### Completed: January 2025

### Implemented Features

#### 📝 Code Editor
- [x] Custom syntax highlighting for SVG/XML
- [x] Live preview synchronized with code
- [x] Real-time file size indicator
- [x] Upload button to load SVG
- [x] Copy code to clipboard

#### 👁️ Live Preview
- [x] Zoom from 10% to 5000%
- [x] Pan (drag with Ctrl+mouse)
- [x] Zoom with mouse wheel (Ctrl+scroll)
- [x] Zoom in/out buttons
- [x] Fit to view
- [x] Grid toggle
- [x] Checkered background toggle
- [x] SVG dimensions display

#### 📤 Export System (5 formats)
- [x] **Preview** - Visualization with zoom controls
- [x] **React** - JSX component (optional TypeScript, single quotes)
- [x] **React Native** - Template with react-native-svg
- [x] **PNG** - Export with 1x, 2x, 3x, 4x scales
- [x] **Data URI** - base64 and encodeURIComponent

#### ⚡ SVGO Optimization
- [x] Configuration modal with 20+ options
- [x] Before/after preview
- [x] Size reduction display (%)
- [x] Individually configurable plugins
- [x] Reset settings to default

#### 🔄 Transformation Tools
- [x] 90° clockwise rotation
- [x] 90° counter-clockwise rotation
- [x] Horizontal flip
- [x] Vertical flip
- [x] Dimensions editor with proportional lock

#### 🎨 Intelligent Color Detection
- [x] Detects if SVG is monochromatic or multicolored
- [x] Automatically applies theme in monochromatic SVGs
- [x] Preserves original colors in multicolored SVGs
- [x] Resolves CSS colors from `<style>` tags and classes

#### 🔗 Gallery Integration
- [x] "Edit" button on gallery cards
- [x] "Edit" button in preview modal
- [x] `openInEditor(svgCode, fileName)` to open SVG in editor
- [x] Gallery ↔ Editor view switch

#### 🔔 Notification System
- [x] Toast for action feedback
- [x] Success/error states
- [x] Auto-dismiss

#### 🆕 Updated Branding
- [x] New polished 400x400 viewBox logo
- [x] Dynamic favicons (dark/light)
- [x] Interactive logo (click opens logo in editor)

---

## 📋 v3.0 - Advanced Features (Planned)

### Goals
Add advanced visual editing and productivity features.

### Estimated Date: TBD

### Planned Features

#### ✏️ Visual Path Editing
- [ ] Control points visualization
- [ ] Move path points
- [ ] Add/remove points
- [ ] Automatically simplify paths
- [ ] Smooth curves

#### 🎨 Inline Color Picker
- [ ] Select colors directly in preview
- [ ] Change color of individual elements
- [ ] Suggested color palette
- [ ] Color history

#### 🌍 Complete Internationalization
- [ ] English language (en-US)
- [ ] Language selector in header
- [ ] Automatic browser language detection

---

## 🏗️ Architecture and Technical Refactoring

### In Progress (Parallel to v1.1)

#### 📦 Modularization
- [x] Separate CSS into component files
- [x] Create ES6 module system for JavaScript
- [x] Organized directory structure
- [x] Centralized state system
- [ ] Lazy loading of non-critical modules
- [ ] Service Worker for offline cache

#### 🧪 Testing
- [ ] Configure testing environment
- [ ] Unit tests for critical functions
- [ ] Integration tests
- [ ] Basic E2E tests
- [ ] Automated accessibility tests

#### 📝 Documentation
- [x] Complete README.md
- [x] Detailed ROADMAP.md
- [ ] Technical API documentation
- [ ] Expanded contribution guide
- [ ] GitHub wiki
- [ ] Video tutorials

#### 🚀 Performance
- [ ] List virtualization for large collections
- [ ] Web Workers for heavy processing
- [ ] IndexedDB for large SVG cache
- [ ] Rendering optimization
- [ ] Profiling and benchmarks

---

## 🎯 Long-term Goals

### 2025
- ✅ Launch v1.0 as functional viewer
- 🎯 Reach 100 stars on GitHub
- 🎯 Active contributor community
- 🎯 Support for 2+ languages
- 🎯 Functional basic editor (v2.0)

---

## 🤝 How to Contribute to the Roadmap

Your opinion matters! If you have feature suggestions:

1. **Open an Issue** on GitHub with the `feature-request` tag
2. **Vote on features** existing with 👍 on issues
3. **Join the discussion** in open issues
4. **Contribute code** for planned features

### Prioritization

Features are prioritized based on:
1. **User impact** - How many users benefit?
2. **Technical complexity** - How much effort is required?
3. **Vision alignment** - Does it make sense for the project?
4. **Community feedback** - How many users requested it?

---

## 📞 Feedback

Have suggestions for the roadmap? Get in touch:

- **GitHub Issues:** [github.com/vindocel/SVGaze/issues](https://github.com/vindocel/SVGaze/issues)
- **Discussions:** [github.com/vindocel/SVGaze/discussions](https://github.com/vindocel/SVGaze/discussions)

---

<div align="center">

**Last updated:** 2025-01-18

⭐ **Star the project on GitHub to follow progress!**

[🌐 App](https://app.svgaze.com) • [📖 README](README.md) • [🐛 Issues](https://github.com/vindocel/SVGaze/issues)

</div>
