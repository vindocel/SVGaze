# 🛠️ Developer Guide - SVGaze

This guide is for developers who want to integrate SVGaze's categorization system into their own projects or extend SVGaze functionality.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Module System](#module-system)
- [Integration Examples](#integration-examples)
- [API Reference](#api-reference)
- [Extending SVGaze](#extending-svgaze)
- [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

SVGaze uses a modular architecture with ES6 modules:

```
SVGaze/
├── js/
│   ├── modules/
│   │   ├── categoryManager.js    # Category detection & grouping
│   │   ├── sanitizer.js          # SVG sanitization
│   │   ├── themeManager.js       # Theme switching
│   │   ├── favoriteManager.js    # Favorites persistence
│   │   └── modalManager.js       # Modal interactions
│   └── main.js                    # App initialization
```

### Key Modules

- **categoryManager.js**: Intelligent categorization system
- **sanitizer.js**: XSS prevention and SVG cleaning
- **themeManager.js**: Light/dark theme management
- **favoriteManager.js**: LocalStorage favorites
- **modalManager.js**: Modal preview handling

---

## 📦 Module System

### ES6 Modules

SVGaze uses ES6 imports/exports. **Requires HTTP server** (no `file://` protocol).

```javascript
// Import from module
import { parseFilePath, detectStyleFromSVG } from './js/modules/categoryManager.js';

// Use the functions
const info = parseFilePath('icons/Outline/Brands/Adobe.svg', 'Adobe.svg');
```

---

## 🔗 Integration Examples

### Example 1: Basic File Processing

```javascript
import { parseFilePath, detectStyleFromSVG } from './js/modules/categoryManager.js';

function handleFiles(e) {
  const files = Array.from(e.target.files || []);
  const svgFiles = files.filter(f => f.name.endsWith('.svg'));

  const readPromises = svgFiles.map(file => readFile(file).then(text => {
    const path = file.webkitRelativePath || file.name;
    const fileName = path.split('/').pop();

    // Parse file path to extract metadata
    const pathInfo = parseFilePath(path, fileName);

    // Parse SVG for style detection
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    const detectedStyle = detectStyleFromSVG(svgElement);

    // Use folder style OR detected style as fallback
    const finalStyle = pathInfo.style || detectedStyle;

    return {
      category: pathInfo.category,
      style: finalStyle,
      subcategory: pathInfo.subcategory,
      fullPath: pathInfo.fullPath,
      fileName,
      svgText: text,
      svgElement,
      originalPath: path
    };
  }));

  Promise.all(readPromises).then(items => {
    console.log(`Processed ${items.length} SVG files`);
    // Do something with items...
  });
}
```

### Example 2: Grouping and Statistics

```javascript
import { groupByCategory, getCategoryStats } from './js/modules/categoryManager.js';

// Group all items by category
const grouped = groupByCategory(allItems);

// Display categories and counts
Object.entries(grouped).forEach(([category, items]) => {
  console.log(`${category}: ${items.length} icons`);

  // Get unique styles in this category
  const styles = new Set(items.map(i => i.style).filter(Boolean));
  console.log(`  Styles: ${Array.from(styles).join(', ')}`);
});

// Get overall statistics
const stats = getCategoryStats(allItems);
console.log(`Total: ${stats.totalItems} icons`);
console.log(`Categories: ${stats.totalCategories}`);
console.log(`Styles: ${stats.totalStyles}`);

// Category breakdown
Object.entries(stats.categories).forEach(([name, info]) => {
  console.log(`${name}: ${info.count} icons, styles: ${info.styles.join(', ')}`);
});
```

### Example 3: Custom Style Folders

```javascript
import { categoryManager } from './js/modules/categoryManager.js';

// Add custom style folders
categoryManager.addStyleFolders(['custom-style', 'special']);

// Remove unwanted style folders
categoryManager.removeStyleFolders(['duotone']);

// Check current style folders
const styles = categoryManager.getStyleFolders();
console.log('Recognized styles:', styles);

// Reset to defaults
categoryManager.resetStyleFolders();
```

### Example 4: SVG Sanitization

```javascript
import { parseAndSanitizeSVG } from './js/modules/sanitizer.js';

// Read SVG file
const svgText = await readFile(file);

// Parse and sanitize (XSS protection)
const sanitizedSVG = parseAndSanitizeSVG(svgText);

// Safe to display
container.appendChild(sanitizedSVG.cloneNode(true));
```

### Example 5: Theme Integration

```javascript
import { themeManager } from './js/modules/themeManager.js';

// Initialize theme
themeManager.init();

// Get current theme
const currentTheme = themeManager.getTheme();

// Toggle theme
themeManager.toggleTheme();

// Set specific theme
themeManager.setTheme('dark');

// Listen to theme changes
themeManager.on('change', (theme) => {
  console.log(`Theme changed to: ${theme}`);
});
```

---

## 📚 API Reference

### categoryManager.js

#### `parseFilePath(path, fileName)`

Analyzes file path and extracts category, style, and metadata.

**Parameters:**
- `path` (string): Full file path (e.g., `"icons/Outline/Brands/Adobe.svg"`)
- `fileName` (string): File name (e.g., `"Adobe.svg"`)

**Returns:**
```javascript
{
  category: string,      // e.g., "Brands"
  style: string,         // e.g., "Outline"
  subcategory: string,   // e.g., ""
  fullPath: string,      // e.g., "Outline › Brands"
  originalPath: string   // Original path
}
```

**Example:**
```javascript
const info = parseFilePath('icons/Outline/Brands/Adobe.svg', 'Adobe.svg');
// {
//   category: 'Brands',
//   style: 'Outline',
//   subcategory: '',
//   fullPath: 'Outline › Brands'
// }
```

---

#### `detectStyleFromSVG(svgElement)`

Detects style by analyzing SVG content.

**Parameters:**
- `svgElement` (SVGElement): The SVG element to analyze

**Returns:**
- `'Outline'` - If majority uses stroke
- `'Solid'` - If majority uses fill
- `'Duotone'` - If uses both fill and stroke
- `''` - If unable to determine

**Example:**
```javascript
const parser = new DOMParser();
const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
const svgEl = svgDoc.querySelector('svg');
const style = detectStyleFromSVG(svgEl);
// 'Outline' | 'Solid' | 'Duotone' | ''
```

---

#### `groupByCategory(items)`

Groups items by category.

**Parameters:**
- `items` (Array): Array of items with `category` property

**Returns:**
```javascript
{
  'CategoryName': [...items],
  'AnotherCategory': [...items]
}
```

**Example:**
```javascript
const grouped = groupByCategory(allItems);
// {
//   'Brands': [item1, item2, ...],
//   'Communication': [item3, item4, ...]
// }
```

---

#### `getCategoryStats(items)`

Returns statistics about categories and styles.

**Parameters:**
- `items` (Array): Array of items

**Returns:**
```javascript
{
  totalItems: number,
  totalCategories: number,
  totalStyles: number,
  categories: {
    'CategoryName': {
      count: number,
      styles: string[]
    }
  }
}
```

**Example:**
```javascript
const stats = getCategoryStats(allItems);
// {
//   totalItems: 145,
//   totalCategories: 9,
//   totalStyles: 2,
//   categories: {
//     'Brands': { count: 24, styles: ['Outline', 'Solid'] }
//   }
// }
```

---

#### `categoryManager.addStyleFolders(folders)`

Add custom style folder names.

**Parameters:**
- `folders` (string[]): Array of folder names

**Example:**
```javascript
categoryManager.addStyleFolders(['custom-style', 'special']);
```

---

#### `categoryManager.removeStyleFolders(folders)`

Remove style folder names.

**Parameters:**
- `folders` (string[]): Array of folder names to remove

**Example:**
```javascript
categoryManager.removeStyleFolders(['duotone']);
```

---

#### `categoryManager.getStyleFolders()`

Get current list of recognized style folders.

**Returns:**
- `string[]` - Array of style folder names

**Example:**
```javascript
const styles = categoryManager.getStyleFolders();
// ['outline', 'solid', 'fill', 'duotone', ...]
```

---

#### `categoryManager.resetStyleFolders()`

Reset to default style folders.

**Example:**
```javascript
categoryManager.resetStyleFolders();
```

---

### sanitizer.js

#### `parseAndSanitizeSVG(svgText)`

Parses and sanitizes SVG, removing dangerous elements/attributes.

**Parameters:**
- `svgText` (string): Raw SVG text

**Returns:**
- `SVGElement` - Sanitized SVG element

**Example:**
```javascript
import { parseAndSanitizeSVG } from './js/modules/sanitizer.js';

const safeSVG = parseAndSanitizeSVG(rawSVGText);
container.appendChild(safeSVG);
```

---

### themeManager.js

#### `themeManager.init()`

Initialize theme system.

#### `themeManager.getTheme()`

Get current theme (`'light'` or `'dark'`).

#### `themeManager.setTheme(theme)`

Set theme (`'light'` or `'dark'`).

#### `themeManager.toggleTheme()`

Toggle between light and dark.

#### `themeManager.on(event, callback)`

Listen to theme changes.

**Example:**
```javascript
themeManager.on('change', (theme) => {
  console.log('New theme:', theme);
});
```

---

## 🔌 Extending SVGaze

### Adding a New Module

1. **Create module file**: `js/modules/yourModule.js`

```javascript
// yourModule.js
export function doSomething() {
  // Implementation
}

export const yourModule = {
  init() {
    // Initialization
  }
};
```

2. **Import in main.js**:

```javascript
import { yourModule } from './modules/yourModule.js';

yourModule.init();
```

### Creating Custom Filters

```javascript
// Add custom filter logic
function filterByCustomCriteria(items, criteria) {
  return items.filter(item => {
    // Your custom logic
    return item.someProperty === criteria;
  });
}
```

### Extending Category Detection

```javascript
// Override or extend parseFilePath
import { parseFilePath as originalParse } from './modules/categoryManager.js';

function customParseFilePath(path, fileName) {
  const result = originalParse(path, fileName);

  // Add custom logic
  if (path.includes('special-folder')) {
    result.category = 'Special';
  }

  return result;
}
```

---

## ✅ Best Practices

### Performance

- **Lazy load**: Only process visible items initially
- **Virtual scrolling**: For large icon sets (1000+)
- **Web Workers**: Move heavy processing off main thread
- **Debounce**: Search and filter inputs

### Security

- **Always sanitize SVGs**: Use `parseAndSanitizeSVG()`
- **CSP headers**: Add Content Security Policy
- **Validate inputs**: Check file types, sizes
- **No eval()**: Never use eval with user data

### Code Quality

- **ES6+**: Use modern JavaScript features
- **Type hints**: JSDoc comments for functions
- **Error handling**: Try-catch for file operations
- **Console logs**: Use for debugging, remove in production

### Module Organization

```javascript
// Good: Named exports for utilities
export function utilityFunction() { }

// Good: Default export for main object
export default {
  init() { },
  doSomething() { }
};

// Good: Mix both when appropriate
export const config = { };
export default mainObject;
```

---

## 🐛 Debugging

### Enable Debug Mode

```javascript
// In main.js
const DEBUG = true;

if (DEBUG) {
  console.log('Debug info:', data);
}
```

### Common Issues

1. **CORS Errors**: Use HTTP server, not `file://`
2. **Module not found**: Check import paths (case-sensitive)
3. **Categories wrong**: Check folder structure and style folders
4. **SVG not displaying**: Check sanitization and console errors

### Debug Categorization

```javascript
// Get first item's debug info
const item = svgViewer.getAll()[0];
console.log(item._debug);

// Get all categories
const categories = [...new Set(svgViewer.getAll().map(i => i.category))];
console.log('Categories found:', categories);
```

---

## 📖 Further Reading

- [MDN: ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [SVG Security](https://html5sec.org/#svg)
- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [LocalStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Need help?** Check [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub!
