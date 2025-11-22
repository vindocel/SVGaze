# Gallery Guide

Complete guide to using SVGaze's gallery view for browsing, searching, and organizing your SVG icons.

---

## Overview

The gallery is the main view in SVGaze, displaying all your SVG icons in a responsive grid with powerful filtering and search capabilities.

---

## Gallery Features

### 📱 Responsive Grid

The gallery adapts to your screen size:

- **Desktop:** Multi-column grid (3-6 columns depending on width)
- **Tablet:** 2-3 columns
- **Mobile:** 1-2 columns

Icons automatically resize to maintain consistent appearance.

### 🎨 Card Components

Each SVG icon is displayed in a card with:

**Preview Area:**
- 1:1 aspect ratio square preview
- Theme-adaptive background (subtle pattern)
- Favorite star button in top-right corner
- Click to open full modal

**Info Section:**
- Filename (centered, below preview)
- Style badge (e.g., "Outline", "Solid")
- Subcategory badge (e.g., "Brands", "Devices")

**Action Buttons:**
- **Open** (primary) - Full-width blue button
- **Edit** (ghost) - Opens in SVG editor
- **Copy** (ghost) - Copies SVG code to clipboard

---

## Search & Filters

### 🔍 Instant Search

The search bar provides real-time filtering:

**Features:**
- Case-insensitive search
- Matches filename only
- Updates as you type
- No submit required

**Examples:**
```
"github"     → Finds "github.svg", "github-logo.svg"
"arrow"      → Finds all icons with "arrow" in name
"arrow-left" → Finds specific arrow direction
```

**Tips:**
- Search is partial match (finds "arrow" in "arrow-left")
- Use hyphens to narrow results ("arrow-left" vs "arrow")
- Clear search to see all icons again

### 📂 Category Filter

Dropdown menu to filter by folder:

**Options:**
- "All categories" - Shows everything
- Detected categories from your folder structure
- Each category shows icon count

**How Categories Work:**
SVGaze intelligently detects semantic categories (Brands, Devices) while ignoring style folders (Outline, Solid).

See [Categorization](Categorization) for details.

### 🎨 Style Filter (Coming Soon)

Filter icons by style:
- Outline
- Solid
- Linear
- Duotone
- etc.

---

## Icon Preview Modal

Click any icon to open the preview modal.

### Modal Features

**Large Preview:**
- Centered SVG display
- Scales to fit modal
- Applies current color theme

**Information:**
- Filename
- File path
- Style and subcategory badges

**Actions:**
- **Copy SVG** - Copy code to clipboard
- **Copy Name** - Copy filename
- **Copy Path** - Copy full file path
- **Edit** - Open in SVG editor
- **Close** / Press `Esc`

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Esc` | Close modal |
| `←` / `→` | Previous/Next icon (coming soon) |

---

## Favorites System

Mark frequently-used icons for quick access.

### Adding Favorites

**Method 1: From Card**
1. Hover over icon card
2. Click star icon in top-right of preview
3. Star turns yellow when favorited

**Method 2: From Modal**
1. Open icon modal
2. Click star icon
3. Star persists across sessions

### Viewing Favorites

The "Favorites" section appears at the top of the gallery when you have favorites:

- Shows all favorited icons
- Displays total count
- Same card layout as main gallery
- Persists between sessions (localStorage)

### Removing Favorites

Click the yellow star on any favorited icon to remove it.

### Managing Favorites

**Clear All:**
1. Click "Clear favorites" button in header
2. Confirm the action
3. All favorites are removed

**Export/Import:** (Coming soon)
- Export favorites list as JSON
- Import favorites from file

---

## Customization

### 🎨 Global Color

Change the color of all icons:

1. Click the color picker in header
2. Choose any color
3. All monochrome icons update instantly

**How it works:**
- Overrides `fill` and `stroke` attributes
- Only affects single-color icons
- Multicolor icons remain unchanged

**Tips:**
- Light theme: Try dark colors (#333)
- Dark theme: Try light colors (#fff)
- Match your app's color scheme

### 📏 Icon Size

Adjust display size with the slider:

- **Range:** 24px - 180px
- **Default:** 48px
- **Updates:** Real-time as you drag

**Use Cases:**
- Small (24-32px): See more icons at once
- Medium (48-64px): Balanced view
- Large (96-180px): Examine details

### 🌓 Theme Toggle

Switch between light and dark themes:

- Click moon/sun icon in header
- Smooth transition animation
- Preference saved to localStorage
- Icons adapt to theme automatically

---

## Toolbar Options

### Primary Toolbar

Located at the top of the page:

- **App logo** - Click to scroll to top, reset filters
- **Gallery/Editor toggle** - Switch views
- **Language selector** - PT-BR / EN-US
- **Theme toggle** - Light / Dark mode
- **Mobile menu** - Access filters on mobile

### Secondary Toolbar

Located below the header (sticky on scroll):

- **Select folder** - Choose SVG directory
- **Search bar** - Filter by filename
- **Category dropdown** - Filter by folder
- **Size slider** - Adjust icon size
- **Color picker** - Change icon color
- **Clear favorites** - Remove all favorites

---

## Performance Tips

### Large Icon Libraries

When working with 1000+ icons:

**1. Use Filters**
- Search for specific icons
- Select a category to narrow results
- Reduces visible icons = better performance

**2. Browser Optimization**
- Close unused tabs
- Clear browser cache
- Use hardware acceleration

**3. Folder Structure**
- Organize icons into logical categories
- Smaller category sizes load faster

### Lazy Loading

SVGaze uses virtual scrolling for large galleries:

- Only renders visible icons
- Loads more as you scroll
- Keeps memory usage low

---

## Mobile Experience

The gallery is fully optimized for mobile:

**Adaptations:**
- Single/double column layout
- Touch-friendly tap targets
- Swipe gestures (coming soon)
- Compact toolbar with menu button

**Mobile Toolbar:**
- Tap menu icon to show filters
- Filters appear in dropdown
- Select folder works via file picker

---

## Troubleshooting

### No Icons Showing

**Problem:** Gallery is empty after selecting folder.

**Solutions:**
1. Verify folder contains `.svg` files
2. Check subfolders are accessible
3. Look for errors in console (F12)

### Icons Appear Black

**Problem:** Icons are black instead of themed color.

**Solutions:**
1. SVGs may have hardcoded `fill` colors
2. Use color picker to override
3. Check SVG code in editor

### Search Not Working

**Problem:** Typing doesn't filter results.

**Solutions:**
1. Click in search box first
2. Check JavaScript is enabled
3. Refresh page and try again

### Slow Performance

**Problem:** Gallery lags with many icons.

**Solutions:**
1. Use category filter to reduce visible icons
2. Close other browser tabs
3. Try a more powerful device

---

## Advanced Tips

### Keyboard Workflows

**Fast Searching:**
1. Press `Ctrl/Cmd + F`
2. Start typing
3. First result is highlighted

**Quick Copy:**
1. Click icon (opens modal)
2. Press `C` to copy (coming soon)
3. Press `Esc` to close

### Batch Operations (Coming Soon)

- Select multiple icons
- Batch copy, export, or favorite
- Drag-and-drop to organize

---

## Related Guides

- **[Editor Guide](Editor-Guide)** - Edit SVG code and export
- **[Categorization](Categorization)** - How categories work
- **[Search & Filters](Search-and-Filters)** - Advanced filtering
- **[Keyboard Shortcuts](Keyboard-Shortcuts)** - Speed up workflow

---

## Next Steps

- Try the **[SVG Editor](Editor-Guide)** for advanced features
- Learn about **[Export Formats](Export-Formats)**
- Explore **[Customization](Settings)** options
