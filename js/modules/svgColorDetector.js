/**
 * SVGaze - SVG Color Detector
 *
 * Detects whether an SVG is monochromatic or multicolor
 * to determine if theme colors should be applied.
 */

/**
 * Detect if SVG is monochromatic (single color) or multicolor
 * @param {SVGElement} svgElement - SVG element to analyze
 * @returns {boolean} - true if monochrome, false if multicolor
 */
export function isSVGMonochromatic(svgElement) {
  if (!svgElement) return true;

  try {
    // Check for complex color features first (gradients, patterns)
    if (hasComplexColorFeatures(svgElement)) {
      return false;
    }

    // Extract all unique colors from the SVG
    const uniqueColors = extractUniqueColors(svgElement);

    // No colors found (all fill="none") - treat as monochrome
    if (uniqueColors.size === 0) {
      return true;
    }

    // Only one unique color - definitely monochrome
    if (uniqueColors.size === 1) {
      return true;
    }

    // 2+ distinct colors - multicolor
    return false;
  } catch (error) {
    console.error('Error detecting SVG color type:', error);
    // On error, assume monochrome (safer default)
    return true;
  }
}

/**
 * Extract all unique colors from SVG elements
 * @param {SVGElement} svgElement - SVG to analyze
 * @returns {Set<string>} - Set of normalized color values
 */
function extractUniqueColors(svgElement) {
  const colors = new Set();
  const walker = document.createTreeWalker(svgElement, NodeFilter.SHOW_ELEMENT);

  while (walker.nextNode()) {
    const el = walker.currentNode;

    // Get fill color
    const fill = el.getAttribute('fill');
    if (fill && fill !== 'none' && fill !== 'transparent' && fill !== 'currentColor') {
      const normalized = normalizeColor(fill);
      if (normalized) {
        colors.add(normalized);
      }
    }

    // Get stroke color
    const stroke = el.getAttribute('stroke');
    if (stroke && stroke !== 'none' && stroke !== 'transparent' && stroke !== 'currentColor') {
      const normalized = normalizeColor(stroke);
      if (normalized) {
        colors.add(normalized);
      }
    }

    // Check inline styles for fill/stroke
    const style = el.getAttribute('style');
    if (style) {
      const fillMatch = style.match(/fill:\s*([^;]+)/);
      if (fillMatch && fillMatch[1]) {
        const fillColor = fillMatch[1].trim();
        if (fillColor !== 'none' && fillColor !== 'transparent' && fillColor !== 'currentColor') {
          const normalized = normalizeColor(fillColor);
          if (normalized) {
            colors.add(normalized);
          }
        }
      }

      const strokeMatch = style.match(/stroke:\s*([^;]+)/);
      if (strokeMatch && strokeMatch[1]) {
        const strokeColor = strokeMatch[1].trim();
        if (strokeColor !== 'none' && strokeColor !== 'transparent' && strokeColor !== 'currentColor') {
          const normalized = normalizeColor(strokeColor);
          if (normalized) {
            colors.add(normalized);
          }
        }
      }
    }
  }

  return colors;
}

/**
 * Normalize color to comparable hex format
 * @param {string} color - Color string (named, hex, rgb, etc.)
 * @returns {string|null} - Normalized hex color or null
 */
function normalizeColor(color) {
  if (!color || color === 'none' || color === 'transparent' || color === 'currentColor') {
    return null;
  }

  color = color.trim().toLowerCase();

  // Named colors to hex
  const namedColors = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'green': '#008000',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'gray': '#808080',
    'grey': '#808080',
    'orange': '#ffa500',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'brown': '#a52a2a'
  };

  if (namedColors[color]) {
    return namedColors[color];
  }

  // Hex colors
  if (color.startsWith('#')) {
    // Convert shorthand hex (#fff) to full hex (#ffffff)
    if (color.length === 4) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    // Return uppercase for consistency
    return color.toUpperCase();
  }

  // RGB/RGBA colors
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`.toUpperCase();
    }
  }

  // Unknown format
  return null;
}

/**
 * Check if SVG has complex color features (gradients, patterns)
 * @param {SVGElement} svgElement - SVG to check
 * @returns {boolean} - true if has gradients or patterns
 */
function hasComplexColorFeatures(svgElement) {
  // Check for gradients
  const hasGradients = svgElement.querySelector('linearGradient, radialGradient');

  // Check for patterns
  const hasPatterns = svgElement.querySelector('pattern');

  return !!(hasGradients || hasPatterns);
}
