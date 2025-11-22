# SVG Editor Guide

Complete guide to SVGaze's integrated SVG editor with code editing, live preview, transformations, optimization, and multi-format export.

---

## Overview

The SVG Editor is a powerful tool for editing, optimizing, and exporting SVG icons in multiple formats. Access it by clicking "Edit" on any icon in the gallery.

---

## Opening the Editor

### From Gallery Card
1. Find your icon in the gallery
2. Click the **"Edit"** button (ghost link in footer)
3. Editor opens with your SVG loaded

### From Modal
1. Click any icon to open modal
2. Click the **"Edit"** button
3. Editor opens with your SVG loaded

### Direct Upload (Coming Soon)
- Drag and drop SVG file
- Upload from file picker
- Paste SVG code

---

## Editor Layout

The editor has two main panels:

### Left Panel: Code Editor
- Syntax-highlighted SVG/XML code
- Line numbers
- Auto-indentation
- Real-time validation

### Right Panel: Live Preview
- Interactive canvas
- Zoom controls (10%-5000%)
- Pan tool
- Grid/checkered background toggle
- Updates as you type

---

## Code Editor

### Features

**Syntax Highlighting:**
- XML tags in color
- Attributes highlighted
- Values distinctly colored
- Comments grayed out

**Editing:**
- Auto-indentation
- Line numbers
- Bracket matching
- Multi-line editing

**Shortcuts:**
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save/Export (coming soon) |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + F` | Find |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |

### Validation

Real-time SVG validation:
- ✅ Valid SVG shows green checkmark
- ❌ Invalid SVG shows error message
- Preview updates only for valid SVG

---

## Live Preview

### Zoom Controls

**Zoom Levels:**
- Minimum: 10%
- Maximum: 5000%
- Default: 100%

**Controls:**
- Slider for precise control
- `-` button to zoom out
- `+` button to zoom in
- Input field for exact value

**Tips:**
- Zoom in to see fine details
- Zoom out for overall composition
- Type exact percentage (e.g., "200")

### Pan Tool

Move the canvas to view different areas:

1. Click **"Pan"** button
2. Click and drag canvas
3. Click "Pan" again to disable

**Shortcuts (Coming Soon):**
- Hold `Space` + drag to pan
- Mouse wheel to zoom

### Background Options

Toggle between two backgrounds:

**Grid:**
- Light/dark grid pattern
- Helps align elements
- Shows SVG bounds

**Checkered:**
- Transparency checkerboard
- Shows actual transparency
- Standard in design tools

---

## Transformation Tools

### Rotation

Rotate your SVG in 90° increments:

**Clockwise:**
- Click "⟲ 90°" button
- Rotates SVG 90° to the right
- Updates code automatically

**Counter-Clockwise:**
- Click "⟳ 90°" button
- Rotates SVG 90° to the left
- Updates code automatically

**How it works:**
- Modifies `transform` attribute
- Preserves original dimensions
- Updates viewBox if needed

### Flipping

Mirror your SVG horizontally or vertically:

**Horizontal Flip:**
- Click "↔ Flip H" button
- Mirrors left-to-right
- Updates code automatically

**Vertical Flip:**
- Click "↕ Flip V" button
- Mirrors top-to-bottom
- Updates code automatically

**Use Cases:**
- Create arrow directions
- Mirror logos
- Generate icon variants

### Dimensions

Edit SVG width and height:

**Fields:**
- Width input (in pixels)
- Height input (in pixels)
- Lock icon (proportional toggle)

**Proportional Mode:**
- Click lock icon (🔒)
- Changing width auto-adjusts height
- Maintains aspect ratio

**Free Mode:**
- Unlocked icon (🔓)
- Change width/height independently
- Can distort proportions

**Tips:**
- Use proportional mode to scale
- Use free mode to stretch
- Original viewBox preserved

---

## SVGO Optimization

Optimize and compress SVGs with SVGO (SVG Optimizer).

### Opening SVGO Modal

1. Click **"Optimize"** button in toolbar
2. SVGO modal opens with options
3. Configure options and optimize

### Optimization Options

**20+ configurable options:**

**Structure:**
- Remove doctype
- Remove XML instructions
- Remove comments
- Remove metadata
- Remove editors data

**Attributes:**
- Remove hidden elements
- Remove empty attributes
- Remove default values
- Remove unknown attributes

**Paths:**
- Convert colors to hex
- Convert path data
- Merge paths
- Round numbers

**And more!**
- Full SVGO plugin support
- Presets for common use cases
- Custom configurations

### Using SVGO

1. **Select Options:**
   - Check desired optimizations
   - Most are enabled by default
   - Hover for descriptions

2. **Preview Results:**
   - See before/after size
   - Compression percentage
   - Visual preview

3. **Apply:**
   - Click "Optimize" button
   - Code editor updates
   - Preview refreshes

**Tips:**
- Start with default options
- Compare before/after carefully
- Some SVGs may break with aggressive optimization
- Always keep original file

---

## Export Formats

Export your SVG in 5 different formats.

### Preview Tab

**Live SVG preview** with interactive controls:

**Features:**
- Real-time rendering
- Zoom controls (10%-5000%)
- Pan tool
- Grid/checkered background
- Copy raw SVG code

**Use Cases:**
- View changes immediately
- Test at different sizes
- Verify appearance

### React Tab

Export as **React JSX component**:

**Options:**
- **TypeScript**: Generate `.tsx` instead of `.jsx`
- **Single Quotes**: Use `'` instead of `"`

**Generated Code:**
```jsx
export default function IconName(props) {
  return (
    <svg {...props}>
      {/* SVG content */}
    </svg>
  );
}
```

**Features:**
- Converts attributes (class → className, stroke-width → strokeWidth)
- Preserves props spreading
- Ready to use in React apps
- Formatted with proper indentation

**Copy & Use:**
1. Configure options
2. Click "Copy Code"
3. Paste into your React project
4. Import and use: `<IconName className="icon" />`

### React Native Tab

Export for **React Native** apps:

**Template:**
```jsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconName(props) {
  return (
    <Svg {...props}>
      {/* SVG elements */}
    </Svg>
  );
}
```

**Features:**
- Uses `react-native-svg` package
- Converts SVG elements (Path, Circle, etc.)
- Props support for width, height, fill
- Formatted and ready to use

**Setup Required:**
```bash
npm install react-native-svg
```

### PNG Tab

Export as **raster PNG image**:

**Scale Options:**
- 1x - Original size
- 2x - Retina displays
- 3x - High-DPI displays
- 4x - Maximum quality

**Process:**
1. Select scale multiplier
2. Click "Download PNG"
3. PNG file downloads

**How it works:**
- SVG rendered to canvas
- Canvas exported to PNG
- Transparency preserved
- Max size: 400px (configurable)

**Use Cases:**
- Email signatures
- Non-SVG environments
- Raster image requirements
- Social media assets

### Data URI Tab

Export as **embedded data URI**:

**Two Formats:**

**Base64:**
```
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0...
```
- Binary encoding
- Larger file size
- Universal compatibility

**URI Encoded:**
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'...
```
- Plain text encoding
- Smaller file size
- Better compression

**Use Cases:**
- Inline in CSS: `background-image: url(data:...)`
- Embed in HTML: `<img src="data:...">`
- No external file requests
- Faster loading for small icons

**Copy & Use:**
1. Choose encoding format
2. Click "Copy URI"
3. Paste into CSS or HTML

---

## Workflows

### Quick Edit Workflow

1. Open SVG in editor
2. Make code changes
3. See live preview
4. Copy to clipboard
5. Use in project

### Optimization Workflow

1. Open SVG in editor
2. Click "Optimize"
3. Review SVGO options
4. Apply optimization
5. Compare before/after
6. Export optimized version

### Multi-Format Export

1. Edit and optimize SVG
2. Export React component
3. Export React Native component
4. Export PNG for fallback
5. All formats from single source

---

## Tips & Tricks

### Faster Editing

- Use keyboard shortcuts
- Enable auto-save (coming soon)
- Duplicate tab for comparison

### Color Management

- Use color picker before editing
- Apply colors in preview
- Export with theme colors

### Testing

- Test at multiple zoom levels
- Toggle grid to check alignment
- Verify in different themes

---

## Troubleshooting

### Preview Not Updating

**Problem:** Preview doesn't reflect code changes.

**Solutions:**
1. Check for SVG syntax errors
2. Ensure SVG tags are closed
3. Refresh editor

### Export Failed

**Problem:** Export buttons don't work.

**Solutions:**
1. Check browser console for errors
2. Verify SVG is valid
3. Try different export format

### SVGO Broke My SVG

**Problem:** SVG looks wrong after optimization.

**Solutions:**
1. Undo optimization (Ctrl+Z)
2. Disable aggressive options
3. Keep original file as backup

---

## Advanced Features

### Custom ViewBox

Edit viewBox for responsive scaling:

```svg
<svg viewBox="0 0 24 24">
  <!-- content -->
</svg>
```

**Tips:**
- Keep viewBox for scalability
- Match icon artboard size
- Use standard sizes (24, 32, 48)

### Path Optimization

Manual path optimization techniques:

- Remove redundant points
- Simplify curves
- Combine multiple paths
- Use relative coordinates

### Accessibility

Add accessibility attributes:

```svg
<svg aria-label="Icon description" role="img">
  <title>Icon Name</title>
  <desc>Detailed description</desc>
  <!-- content -->
</svg>
```

---

## Related Guides

- **[Gallery Guide](Gallery-Guide)** - Browse and organize icons
- **[SVGO](SVGO)** - Detailed optimization guide
- **[Export Formats](Export-Formats)** - Format-specific guides
- **[Transformations](Transformations)** - Advanced transformations

---

## Next Steps

- Master **[SVGO Optimization](SVGO)**
- Learn **[Advanced Transformations](Transformations)**
- Explore **[Custom Workflows](Custom-Workflows)**
