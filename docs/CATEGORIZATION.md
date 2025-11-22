# 🗂️ Intelligent Categorization System - SVGaze

This document explains how SVGaze's intelligent categorization system works.

## 🎯 Objective

The categorization system was designed to be **intelligent and flexible**, working with different icon folder organization structures.

### Problems Solved

✅ **Ignores style folders** - Outline, Solid, Fill don't become categories
✅ **Detects semantic categories** - Brands, Communication, Devices
✅ **Unifies duplicate categories** - Devices/Outline + Devices/Solid = 1 category
✅ **Shows style badges** - Indicates if it's Solid, Outline, Fill, etc
✅ **Works with multiple structures** - Adapts automatically

---

## 📁 Supported Structures

### Structure 1: Category → Style
```
Icons/
├── arrow/              → Category: arrow
│   ├── Fill/          → Style: Fill
│   │   ├── arrow-left.svg
│   │   └── arrow-right.svg
│   └── Outline/       → Style: Outline
│       └── arrow-up.svg
├── social/            → Category: social
│   ├── facebook.svg   → Style: (detected from SVG)
│   └── twitter.svg
└── ui/                → Category: ui
    └── close.svg
```

**Result:**
- **Categories**: arrow, social, ui
- **Badges**: Fill, Outline (displayed on cards)

---

### Structure 2: Style → Category
```
svg/
├── Outline/           → Ignored (style folder)
│   ├── Brands/       → Category: Brands
│   │   ├── Adobe-After-effects.svg
│   │   └── Adobe-Illustrator.svg
│   ├── Communication/ → Category: Communication
│   │   ├── Comment.svg
│   │   └── Contacts.svg
│   └── Devices/       → Category: Devices
│       ├── Battery-empty.svg
│       └── Camera.svg
├── Solid/             → Ignored (style folder)
│   ├── Brands/       → Category: Brands (unified)
│   │   ├── Adobe-After-effects.svg
│   │   └── Adobe-Illustrator.svg
│   ├── Communication/ → Category: Communication (unified)
│   │   ├── Comment.svg
│   │   └── Contacts.svg
│   └── Devices/       → Category: Devices (unified)
│       ├── Battery-empty.svg
│       └── Camera.svg
```

**Result:**
- **Categories**: Brands, Communication, Devices (unified!)
- **Badges**: Outline, Solid (displayed on cards)
- When selecting "Devices", shows icons from both Devices/ folders

---

### Structure 3: Mixed
```
icons/
├── ui/
│   ├── Outline/
│   │   └── close.svg    → Category: ui, Style: Outline
│   └── Solid/
│       └── close.svg    → Category: ui, Style: Solid
└── brands/
    └── figma.svg        → Category: brands, Style: (auto)
```

**Result:**
- **Categories**: ui, brands
- **Badges**: Outline, Solid

---

## 🧠 How It Works

### 1. Style Folder Detection

The system automatically recognizes these folders as "style":

```javascript
'outline', 'solid', 'fill', 'filled', 'line', 'duotone',
'bold', 'regular', 'light', 'thin', 'sharp', 'rounded', 'straight'
```

These folders are **ignored** when determining categories.

### 2. Root Folder Detection

These folders are considered "container" and ignored:

```javascript
'icons', 'svg', 'svgs', 'assets', 'images'
```

### 3. Categorization Algorithm

```
For each SVG file:
  1. Gets the full path: "svg/Outline/Brands/Adobe.svg"
  2. Removes root folder: "Outline/Brands/Adobe.svg"
  3. Identifies style folders: ["Outline"]
  4. Identifies semantic folders: ["Brands"]
  5. Category = first semantic folder: "Brands"
  6. Style = first style folder: "Outline"
  7. Subcategory = remaining semantic folders
```

### 4. Category Unification

```javascript
// Before (without unification):
Categories: [Outline, Solid]
  Outline → Brands, Communication, Devices
  Solid → Brands, Communication, Devices

// After (with unification):
Categories: [Brands, Communication, Devices]
  Brands → [Outline icons, Solid icons]
  Communication → [Outline icons, Solid icons]
  Devices → [Outline icons, Solid icons]
```

### 5. Automatic Style Detection (Fallback)

If the style is not in the folder name, the system analyzes the **SVG content**:

```javascript
// Analyzes <path>, <circle>, etc elements
- If majority has stroke and little fill → "Outline"
- If majority has fill → "Solid"
- If has both fill AND stroke → "Duotone"
```

---

## 🎨 Style Badges

Cards display badges indicating the style:

```
┌─────────────────────┐
│   [Icon Preview]    │
│                     │
│  Adobe Illustrator  │
│  [Brands] [Outline] │ ← Badges
│  [Copy] [Download]  │
└─────────────────────┘
```

**Badge Types:**
- **Secondary category** (gray): "Brands", "Communication"
- **Style** (blue): "Outline", "Solid", "Fill"

---

## ⚙️ System API

### Main Functions

#### `parseFilePath(path, fileName)`
Analyzes the path and extracts category, style and metadata.

```javascript
const info = parseFilePath('svg/Outline/Brands/Adobe.svg', 'Adobe.svg');
// {
//   category: 'Brands',
//   style: 'Outline',
//   subcategory: '',
//   fullPath: 'Outline › Brands',
//   originalPath: 'svg/Outline/Brands/Adobe.svg'
// }
```

#### `detectStyleFromSVG(svgElement)`
Detects style by analyzing SVG content.

```javascript
const style = detectStyleFromSVG(svgElement);
// 'Outline' | 'Solid' | 'Duotone' | ''
```

#### `groupByCategory(items)`
Groups icons by category.

```javascript
const grouped = groupByCategory(allItems);
// {
//   'Brands': [...],
//   'Communication': [...],
//   'Devices': [...]
// }
```

#### `getCategoryStats(items)`
Returns statistics about categories and styles.

```javascript
const stats = getCategoryStats(allItems);
// {
//   totalItems: 145,
//   totalCategories: 8,
//   totalStyles: 2,
//   categories: {
//     'Brands': { count: 24, styles: ['Outline', 'Solid'] },
//     'Communication': { count: 18, styles: ['Outline', 'Solid'] }
//   }
// }
```

### Customization

#### Add custom style folders:
```javascript
categoryManager.addStyleFolders(['custom-style', 'special']);
```

#### Remove style folders:
```javascript
categoryManager.removeStyleFolders(['duotone']);
```

#### View current list:
```javascript
const styles = categoryManager.getStyleFolders();
// ['outline', 'solid', 'fill', ...]
```

#### Reset to default:
```javascript
categoryManager.resetStyleFolders();
```

---

## 🧪 Usage Examples

### Example 1: Process file
```javascript
import { parseFilePath, detectStyleFromSVG } from './categoryManager.js';

// Process path
const pathInfo = parseFilePath(
  'Icons/Outline/Communication/Comment.svg',
  'Comment.svg'
);

console.log(pathInfo);
// {
//   category: 'Communication',
//   style: 'Outline',
//   subcategory: '',
//   fullPath: 'Outline › Communication'
// }

// Detect style from SVG
const svgEl = parser.parseFromString(svgText, 'image/svg+xml').querySelector('svg');
const detectedStyle = detectStyleFromSVG(svgEl);
console.log(detectedStyle); // 'Outline'

// Use detected style if not in folder
const finalStyle = pathInfo.style || detectedStyle;
```

### Example 2: Group and statistics
```javascript
import { groupByCategory, getCategoryStats } from './categoryManager.js';

// Group by category
const grouped = groupByCategory(allItems);

// For each category, show how many icons
Object.entries(grouped).forEach(([category, items]) => {
  console.log(`${category}: ${items.length} icons`);

  // Available styles in this category
  const styles = new Set(items.map(i => i.style).filter(Boolean));
  console.log(`  Styles: ${Array.from(styles).join(', ')}`);
});

// General statistics
const stats = getCategoryStats(allItems);
console.log(`Total: ${stats.totalItems} icons`);
console.log(`Categories: ${stats.totalCategories}`);
console.log(`Styles: ${stats.totalStyles}`);
```

---

## 📊 Test Structures

### Compatible Structures

1. **Icons → Category → Style**
   ```
   Icons/arrow/Fill/arrow-left.svg
   Icons/arrow/Outline/arrow-up.svg
   ```
   - Category: arrow
   - Styles: Fill, Outline

2. **Style → Category**
   ```
   svg/Outline/Brands/Adobe.svg
   svg/Solid/Brands/Adobe.svg
   ```
   - Category: Brands (unified)
   - Styles: Outline, Solid

3. **Flat (no subcategories)**
   ```
   icons/close.svg
   icons/menu.svg
   ```
   - Category: Root
   - Style: (auto-detected)

---
