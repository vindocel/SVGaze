# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Internationalization System
- **Complete i18n implementation** with 2 languages (PT-BR, EN-US)
  - Dynamic language loading with ES6 async imports
  - Automatic system language detection via `navigator.language`
  - Manual language switcher with globe icon in header
  - Language preference saved to localStorage
  - Full page reload on language change for 100% translation coverage
- **Translation system**:
  - 375+ translation keys covering entire UI
  - Nested key support with dot notation (`header.title`)
  - Variable interpolation (`{count} items`)
  - Plural forms support
  - `data-i18n` attributes for static HTML elements
  - `t()` function calls for dynamic JavaScript content

### Added - Icon Standardization
- **Consistent 20×20px icons** across entire navbar
  - View toggle buttons (Gallery/Editor): 16px → 20px
  - Language selector: 16px → 20px
  - Mobile menu toggle: maintained at 20px
- **Uniform button styling** in mobile view:
  - All buttons: 40×40px with 8px padding
  - Perfect vertical and horizontal centering
  - Harmonious visual proportion

### Added - UX & Interface Improvements
- **Modernized card design**:
  - Preview with 1:1 aspect-ratio and themed background
  - Favorite button positioned at top-right of preview
  - Centered filename below preview
  - Centered style and subcategory badges
  - "Open" button as primary action spanning full width
  - "Edit" and "Copy" buttons as secondary ghost links in footer
- **Icons in header buttons**:
  - "Gallery" button with gallery icon (image)
  - "Editor" button with workflow/git icon
  - "Select folder" button with folder icon
  - Desktop: icon + text visible
  - Mobile: icon only (except "Select folder" which keeps both)
- **Logo behavior improvements**:
  - Clicking logo in gallery mode resets filters to "All categories"
  - Smooth scroll to top when clicking logo
  - Correct dropdown state update
- **Mobile header optimization**:
  - Scaled-down elements (24px logo, smaller buttons, compact switch)
  - Eliminates horizontal scroll
  - Mobile menu button moved to primary header
  - More harmonious and compact layout

### Added - SVG Editor View
- **Dual view system** (Gallery ↔ Editor) with view manager
- **Code editor** with custom SVG/XML syntax highlighting
- **Live preview** with zoom controls (10%-5000%), pan, and grid/checkered toggle
- **5-tab export system**:
  - Preview: SVG visualization with zoom controls
  - React: JSX component conversion with options (TypeScript, single quotes)
  - React Native: Component template with react-native-svg
  - PNG: Image export with scale selector (1x-4x)
  - Data URI: Base64 and encodeURIComponent URI generation
- **SVGO modal** with 20+ configurable optimization options
- **Transformation tools**:
  - Rotation (90° clockwise and counter-clockwise)
  - Flipping (Horizontal and Vertical)
  - Dimensions editor with proportional lock
- **"Edit" button** in gallery cards and modal to open SVG in editor
- **Smart color detection** (monochrome vs multicolor) for automatic theme application

### Added - Technical Infrastructure
- **26 JavaScript ES6 modules** — fully modular architecture
- **12 CSS files** — componentized design system
- **i18n module** (`i18n/i18n.js`) with dynamic imports
- **Translation files**: `i18n/en-US.js` and `i18n/pt-BR.js`
- **Dropdown manager** adapted for i18n with span support

### Added - Features & Capabilities
- **Toast notification system** for user feedback (success, error, info, warning)
- **Modal system** with keyboard navigation (Esc to close)
- **Settings persistence** across sessions
- **Export code formatting** (Prettier-like) for React components
- **PNG export** renders at limited size (max 400px) for better visualization

### Fixed
- Dropdown text being cut off
- Icons appearing black in dark theme (now adapt correctly)
- Dropdown menu being cut off inside toolbar (overflow context)
- Duplicate favorites in gallery
- Padding conflict in dropdown button
- SVGs with `fill="none"` on root element now receive correct coloring
- SVGs with elements inside `<g>` (groups) now process correctly
- Unnecessary horizontal scroll in mobile header
- Incorrect behavior when clicking logo (didn't reset to "All categories")
- Language menu misalignment and inconsistent icon sizes
- Missing translation imports in `modalManager.js` and `viewManager.js`

## [1.1.0] - 2025-01-07

### Added
- 100% modular architecture (13 JS modules + 7 CSS files)
- Smart categorization system
- Automatic style detection (Outline, Solid, Linear, etc)
- Composite style support ("Linear (Border)")
- Subcategory extraction from folder structure
- Style filter dropdown
- Badge system (style + subcategory) on cards
- Color picker for global icon color
- Size slider (24px - 180px)
- Instant search
- Favorites system with localStorage
- Copy SVG to clipboard
- SVG sanitization (removes scripts and dangerous content)
- ViewBox support with smart correction
- 100% local processing (no upload)

## [1.0.0] - 2025-01-05

### Added
- Initial release
- SVG gallery with responsive grid
- Category filter
- Light/dark theme
- Modal preview
- Favorites system
- Copy SVG to clipboard
- SVG sanitization (removes scripts and dangerous content)
- ViewBox support with smart correction
- 100% local processing (no upload)

[Unreleased]: https://github.com/vindocel/SVGaze/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/vindocel/SVGaze/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vindocel/SVGaze/releases/tag/v1.0.0
