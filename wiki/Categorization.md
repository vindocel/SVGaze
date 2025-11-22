# Categorization System

Complete guide to SVGaze's intelligent folder structure detection and categorization system.

---

## Overview

SVGaze automatically analyzes your folder structure and creates smart categories based on semantic meaning, while filtering out style-based folders.

**Key Feature:** Separates **semantic categories** (what the icon represents) from **styles** (how it looks).

---

## How It Works

### Folder Analysis

SVGaze scans your selected directory and:

1. **Detects folder hierarchy** (parent → child relationships)
2. **Identifies style folders** (Outline, Solid, Linear, etc.)
3. **Extracts semantic categories** (Brands, Devices, Social, etc.)
4. **Assigns badges** to each icon (style + subcategory)

### Style Detection

**Recognized Styles:**
- Outline / Outlined
- Solid / Filled
- Linear / Line
- Duotone / Two Tone
- Bold / Heavy
- Light / Thin
- Regular / Normal

**How Detection Works:**
- Case-insensitive matching
- Partial word matching ("outline" matches "Outlined")
- Composite styles ("Linear (Border)")

### Category Extraction

**Semantic Categories:**
- Categories represent **what** the icon is
- Examples: Brands, Devices, Social, Weather, UI, etc.
- Based on folder names that aren't styles

**Subcategories:**
- Nested folder structure
- Can have multiple levels
- Displayed as badges on cards

---

## Folder Structures

### Simple Structure

**One level, no styles:**

```
icons/
├── brands/
│   ├── github.svg
│   └── twitter.svg
├── devices/
│   ├── phone.svg
│   └── laptop.svg
└── weather/
    ├── sun.svg
    └── cloud.svg
```

**Result:**
- Categories: Brands, Devices, Weather
- No style badges
- Each category shows in filter dropdown

---

### Style-Based Structure

**Style folders at top level:**

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
    │   ├── github.svg
    │   └── twitter.svg
    └── Devices/
        ├── phone.svg
        └── laptop.svg
```

**Result:**
- Categories: Brands, Devices (NOT Outline/Solid)
- Style badges: "Outline", "Solid"
- Subcategory badges: "Brands", "Devices"

**Why This Works:**
- "Outline" and "Solid" are detected as styles
- "Brands" and "Devices" are semantic categories
- Category filter shows only Brands and Devices

---

### Complex Structure

**Multiple levels with styles:**

```
icons/
├── Linear/
│   ├── Communication/
│   │   ├── Email/
│   │   │   ├── inbox.svg
│   │   │   └── sent.svg
│   │   └── Social/
│   │       ├── facebook.svg
│   │       └── twitter.svg
│   └── UI/
│       └── Arrows/
│           ├── left.svg
│           └── right.svg
└── Duotone/
    └── Communication/
        └── Email/
            └── inbox.svg
```

**Result:**
- Categories: Communication, UI
- Style badges: "Linear", "Duotone"
- Subcategory badges: "Email", "Social", "Arrows"
- Multi-level nesting preserved

---

### Mixed Structure

**Styles and non-styles at same level:**

```
icons/
├── Outline/           ← Style (ignored as category)
│   └── Brands/        ← Semantic category
├── Custom/            ← Not a style (becomes category)
│   └── Special/
└── Logos/             ← Semantic category
    └── company.svg
```

**Result:**
- Categories: Brands, Custom, Logos
- "Outline" filtered out as style
- "Custom" kept as semantic category

---

## Category Filter

### Filter Dropdown

Located in the secondary toolbar:

**Options:**
- **All categories** - Default, shows everything
- **Category 1** - Shows only icons in this category
- **Category 2** - Shows only icons in this category
- etc.

**Icon Counts:**
Each category shows the number of icons it contains.

### Filtering Behavior

**When you select a category:**
1. Gallery filters to show only that category
2. Dropdown displays selected category name
3. URL updates (coming soon)
4. Filter persists during session

**To clear filter:**
1. Select "All categories"
2. OR click app logo
3. Gallery shows all icons again

---

## Badges

### Style Badges

Displayed on icon cards when applicable:

**Appearance:**
- Small pill-shaped badge
- Subtle background color
- Located near filename

**Examples:**
- "Outline"
- "Solid"
- "Linear (Border)"
- "Duotone"

### Subcategory Badges

Shows the icon's subcategory:

**Appearance:**
- Similar to style badges
- Different color scheme
- Below style badge

**Examples:**
- "Brands"
- "Social"
- "Email"
- "Arrows"

### Badge Logic

**When badges appear:**
- Style badge: Only if style folder detected
- Subcategory badge: Only if nested category exists
- Both can appear together
- Neither appears for simple structures

---

## API Reference

### Detection Functions

**`detectStyle(path)`**
- Analyzes folder path for style keywords
- Returns style name or null
- Case-insensitive matching

**`extractCategories(items)`**
- Processes all SVG file paths
- Identifies unique categories
- Filters out style folders
- Returns category list

**`getSubcategory(path, mainCategory)`**
- Extracts nested folder name
- Relative to main category
- Returns subcategory or null

### Data Structures

**Item Object:**
```javascript
{
  name: "github.svg",
  path: "Outline/Brands/github.svg",
  category: "Brands",
  subcategory: null,
  style: "Outline",
  content: "<svg>...</svg>"
}
```

**Category Object:**
```javascript
{
  name: "Brands",
  count: 42,
  style: null
}
```

---

## Best Practices

### Folder Naming

**✅ Good Names:**
- Clear, descriptive
- Semantic meaning
- Consistent casing
- Standard styles

**Examples:**
```
Brands/
Communication/
Social Media/
User Interface/
Weather Icons/
```

**❌ Avoid:**
- Vague names (Misc, Other, Stuff)
- Inconsistent styles (outline vs Outlined)
- Deep nesting (>3 levels)
- Special characters

### Structure Organization

**Recommended Structure:**

```
icons/
├── [Style]/           ← Optional: Outline, Solid, etc.
│   ├── [Category]/    ← Required: Brands, UI, etc.
│   │   └── icon.svg
│   └── [Category]/
│       ├── [Subcategory]/  ← Optional: nested folders
│       │   └── icon.svg
│       └── icon.svg
└── [Style]/
    └── ...
```

**Tips:**
1. Style folders first (if using)
2. Categories second
3. Subcategories third (optional)
4. Keep hierarchy shallow (2-3 levels max)

---

## Examples

### Example 1: Icon Pack

**Feather Icons style structure:**

```
feather/
├── icons.svg          ← All in one file (not supported)
└── ...
```

**Convert to:**
```
feather/
└── UI/
    ├── alert-circle.svg
    ├── arrow-left.svg
    ├── check.svg
    └── ...
```

### Example 2: Design System

**Design system with variants:**

```
design-system/
├── Components/
│   ├── Outline/
│   │   ├── button.svg
│   │   └── card.svg
│   └── Filled/
│       ├── button.svg
│       └── card.svg
└── Icons/
    ├── Outline/
    └── Filled/
```

**Better structure:**
```
design-system/
├── Outline/
│   ├── Components/
│   │   ├── button.svg
│   │   └── card.svg
│   └── Icons/
│       └── ...
└── Filled/
    ├── Components/
    └── Icons/
```

---

## Troubleshooting

### Categories Not Detected

**Problem:** Dropdown shows "All categories" only.

**Solutions:**
1. Add folder structure to your SVGs
2. Ensure folders contain SVG files
3. Check folder names aren't all styles
4. Refresh and reselect folder

### Wrong Categories

**Problem:** Style folders appear as categories.

**Solutions:**
1. Rename to standard style names
2. Move styles to top level
3. Check for typos in folder names

### Missing Badges

**Problem:** Icons don't show style/subcategory badges.

**Solutions:**
1. Verify folder structure has styles
2. Check if detection matches your naming
3. Try standard style names

---

## Advanced Usage

### Custom Category Mapping (Coming Soon)

Define custom category rules:

```json
{
  "categoryMap": {
    "Social Media": "Social",
    "User Interface": "UI"
  },
  "styleMap": {
    "Line": "Linear",
    "Fill": "Solid"
  }
}
```

### Category Aliases (Coming Soon)

Multiple names for same category:

```json
{
  "aliases": {
    "UI": ["User Interface", "Interface", "Components"],
    "Social": ["Social Media", "Social Networks"]
  }
}
```

---

## Related Guides

- **[Gallery Guide](Gallery-Guide)** - Using categories in gallery
- **[Search & Filters](Search-and-Filters)** - Advanced filtering
- **[Folder Organization](Folder-Organization)** - Best practices

---

## Next Steps

- Organize your **icon library** with proper structure
- Use **category filter** to find icons faster
- Create **consistent naming** across projects
