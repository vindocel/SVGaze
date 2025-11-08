/**
 * SVGaze - Smart Category Manager
 *
 * Intelligent categorization system that:
 * - Detects and ignores style folders (Outline, Solid, Fill, etc)
 * - Uses semantic folders as categories (Brands, Communication, Devices, etc)
 * - Unifies duplicate categories from different style folders
 * - Extracts style information from folder structure or SVG content
 */

// Common style folder names to ignore when determining categories
const STYLE_FOLDERS = new Set([
  'outline',
  'solid',
  'fill',
  'filled',
  'line',
  'linear',
  'duotone',
  'bold',
  'regular',
  'light',
  'thin',
  'sharp',
  'rounded',
  'straight'
]);

// Root folder names to ignore
const ROOT_FOLDERS = new Set([
  'icons',
  'svg',
  'svgs',
  'assets',
  'images',
  'hicon'
]);

/**
 * Extract style from folder name (e.g., "Call - Bold" → "Bold")
 * @param {string} folderName - Folder name to check
 * @returns {Object} { cleanName, style } - Cleaned name and extracted style
 */
function extractStyleFromName(folderName) {
  // Common separators: dash, pipe, underscore
  const separators = ['- ', ' - ', ' – ', ' | ', ' _ ', '_'];

  for (const sep of separators) {
    const parts = folderName.split(sep);
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim();
      const lastPartLower = lastPart.toLowerCase();

      // Check if last part is a known style (exact match)
      if (STYLE_FOLDERS.has(lastPartLower)) {
        return {
          cleanName: parts.slice(0, -1).join(sep).trim(),
          style: lastPart
        };
      }

      // Check if last part CONTAINS a known style word (for multi-word styles like "Linear (Border)")
      for (const styleWord of STYLE_FOLDERS) {
        // Match style word as a whole word in the last part
        const regex = new RegExp(`\\b${styleWord}\\b`, 'i');
        if (regex.test(lastPartLower)) {
          return {
            cleanName: parts.slice(0, -1).join(sep).trim(),
            style: lastPart  // Keep full style name like "Linear (Border)"
          };
        }
      }
    }
  }

  return { cleanName: folderName, style: '' };
}

/**
 * Parse file path and extract category, style, and metadata
 *
 * @param {string} webkitRelativePath - Full path from webkitdirectory
 * @param {string} fileName - Name of the file
 * @returns {Object} Parsed path information
 */
export function parseFilePath(webkitRelativePath, fileName) {
  const pathParts = webkitRelativePath.split('/');

  // Remove filename from path
  const folders = pathParts.slice(0, -1);

  if (folders.length === 0) {
    return {
      category: 'Root',
      style: '',
      subcategory: '',
      fullPath: fileName,
      originalPath: webkitRelativePath
    };
  }

  // Clean folder names (lowercase for comparison)
  const cleanFolders = folders.map(f => f.toLowerCase());

  // Find style folders and semantic folders
  let styleFolders = [];
  let semanticFolders = [];
  let rootFolderIndex = -1;
  let extractedStyle = '';

  cleanFolders.forEach((folder, index) => {
    const original = folders[index];

    if (ROOT_FOLDERS.has(folder)) {
      rootFolderIndex = index;
    } else if (STYLE_FOLDERS.has(folder)) {
      styleFolders.push({ name: original, index });
    } else if (index > rootFolderIndex) {
      // Check if style is in the folder name (e.g., "Call - Bold")
      const { cleanName, style: nameStyle } = extractStyleFromName(original);

      if (nameStyle && !extractedStyle) {
        extractedStyle = nameStyle;
        // Use cleaned name as category
        semanticFolders.push({ name: cleanName, index });
      } else {
        // Only consider folders after root folder
        semanticFolders.push({ name: original, index });
      }
    }
  });

  // Determine category (first semantic folder)
  let category = 'Root';
  let style = '';
  let subcategory = '';

  if (semanticFolders.length > 0) {
    category = semanticFolders[0].name;

    // Additional semantic folders become subcategory
    if (semanticFolders.length > 1) {
      subcategory = semanticFolders.slice(1).map(f => f.name).join(' › ');
    }
  } else if (styleFolders.length > 0) {
    // If only style folders exist, use the last one as category
    category = styleFolders[styleFolders.length - 1].name;
  } else {
    // Use first non-root folder
    const startIndex = rootFolderIndex >= 0 ? rootFolderIndex + 1 : 0;
    if (startIndex < folders.length) {
      category = folders[startIndex];
    }
  }

  // Determine style (prioritize first style folder found, then extracted from name)
  if (styleFolders.length > 0) {
    style = styleFolders[0].name;
  } else if (extractedStyle) {
    style = extractedStyle;
  }

  // Build full path for display
  const relevantFolders = folders.slice(rootFolderIndex >= 0 ? rootFolderIndex + 1 : 0);
  const fullPath = relevantFolders.length > 0
    ? relevantFolders.join(' › ')
    : fileName;

  return {
    category,
    style,
    subcategory,
    fullPath,
    originalPath: webkitRelativePath,
    _debug: {
      allFolders: folders,
      styleFolders: styleFolders.map(f => f.name),
      semanticFolders: semanticFolders.map(f => f.name),
      rootFolderIndex
    }
  };
}

/**
 * Detect style from SVG content
 * Analyzes SVG attributes and structure to determine if it's outline, solid, etc.
 *
 * @param {SVGElement} svgElement - Parsed SVG element
 * @returns {string} Detected style ('Outline', 'Solid', 'Fill', or '')
 */
export function detectStyleFromSVG(svgElement) {
  if (!svgElement) return '';

  // Count filled vs stroked elements
  let filledCount = 0;
  let strokedCount = 0;
  let totalElements = 0;

  const visualElements = svgElement.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, line');

  visualElements.forEach(el => {
    totalElements++;
    const fill = el.getAttribute('fill') || 'black';
    const stroke = el.getAttribute('stroke') || 'none';

    if (fill !== 'none' && fill !== 'transparent') {
      filledCount++;
    }
    if (stroke !== 'none' && stroke !== 'transparent') {
      strokedCount++;
    }
  });

  if (totalElements === 0) return '';

  // Determine style based on fill/stroke ratio
  const fillRatio = filledCount / totalElements;
  const strokeRatio = strokedCount / totalElements;

  if (strokeRatio > 0.5 && fillRatio < 0.3) {
    return 'Outline';
  } else if (fillRatio > 0.5) {
    return 'Solid';
  } else if (fillRatio > 0 && strokeRatio > 0) {
    return 'Duotone';
  }

  return '';
}

/**
 * Group items by category, merging items from different style folders
 *
 * @param {Array} items - Array of SVG items with category and style info
 * @returns {Object} Grouped items by category
 */
export function groupByCategory(items) {
  const grouped = {};

  items.forEach(item => {
    const { category } = item;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  });

  return grouped;
}

/**
 * Get unique categories from items
 *
 * @param {Array} items - Array of SVG items
 * @returns {Array} Sorted array of unique category names
 */
export function getUniqueCategories(items) {
  const categories = new Set(items.map(item => item.category));
  return Array.from(categories).sort((a, b) => {
    // Put 'Root' last
    if (a === 'Root') return 1;
    if (b === 'Root') return -1;
    return a.localeCompare(b);
  });
}

/**
 * Get unique styles from items in a category
 *
 * @param {Array} items - Array of SVG items from same category
 * @returns {Array} Sorted array of unique style names
 */
export function getStylesForCategory(items) {
  const styles = new Set(
    items
      .map(item => item.style)
      .filter(style => style !== '')
  );
  return Array.from(styles).sort();
}

/**
 * Filter items by category and optionally by style
 *
 * @param {Array} items - All items
 * @param {string} category - Category to filter by
 * @param {string} style - Optional style to filter by
 * @returns {Array} Filtered items
 */
export function filterByCategory(items, category, style = null) {
  let filtered = items;

  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }

  if (style) {
    filtered = filtered.filter(item => item.style === style);
  }

  return filtered;
}

/**
 * Get statistics about categories and styles
 *
 * @param {Array} items - All items
 * @returns {Object} Statistics object
 */
export function getCategoryStats(items) {
  const stats = {
    totalItems: items.length,
    totalCategories: 0,
    totalStyles: 0,
    categories: {},
    styles: new Set()
  };

  items.forEach(item => {
    const { category, style } = item;

    // Count categories
    if (!stats.categories[category]) {
      stats.categories[category] = {
        count: 0,
        styles: new Set()
      };
      stats.totalCategories++;
    }

    stats.categories[category].count++;

    // Count styles
    if (style) {
      stats.styles.add(style);
      stats.categories[category].styles.add(style);
    }
  });

  stats.totalStyles = stats.styles.size;

  // Convert Sets to Arrays for easier use
  Object.keys(stats.categories).forEach(cat => {
    stats.categories[cat].styles = Array.from(stats.categories[cat].styles);
  });

  return stats;
}

/**
 * Add or update style folders list (for customization)
 *
 * @param {Array<string>} folders - Array of folder names to treat as style folders
 */
export function addStyleFolders(folders) {
  folders.forEach(folder => {
    STYLE_FOLDERS.add(folder.toLowerCase());
  });
}

/**
 * Remove style folders from detection list
 *
 * @param {Array<string>} folders - Array of folder names to remove
 */
export function removeStyleFolders(folders) {
  folders.forEach(folder => {
    STYLE_FOLDERS.delete(folder.toLowerCase());
  });
}

/**
 * Get current list of style folders
 *
 * @returns {Array<string>} Current style folder names
 */
export function getStyleFolders() {
  return Array.from(STYLE_FOLDERS);
}

/**
 * Reset to default style folders
 */
export function resetStyleFolders() {
  STYLE_FOLDERS.clear();
  ['outline', 'solid', 'fill', 'filled', 'line', 'linear', 'duotone', 'bold',
   'regular', 'light', 'thin', 'sharp', 'rounded', 'straight'].forEach(f => {
    STYLE_FOLDERS.add(f);
  });
}

export default {
  parseFilePath,
  detectStyleFromSVG,
  groupByCategory,
  getUniqueCategories,
  getStylesForCategory,
  filterByCategory,
  getCategoryStats,
  addStyleFolders,
  removeStyleFolders,
  getStyleFolders,
  resetStyleFolders
};
