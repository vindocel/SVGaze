/**
 * SVGaze - Category Icon Manager
 * Manages random icon selection for categories with style consistency
 */

import { appState } from '../state.js';
import { getUniqueStyles } from './filterManager.js';
import { prepareSVGForDisplay, applyCurrentColorToSVG } from './svgProcessor.js';

/**
 * Initialize category icons by selecting one random icon per category
 * All icons will use the same style for consistency
 * Call this once when items are loaded
 */
export function initializeCategoryIcons() {
  if (!appState.allItems || appState.allItems.length === 0) {
    return;
  }

  // Determine the style to use for ALL category icons
  // Strategy: Pick the most common style across ALL items
  const styleCounts = {};
  appState.allItems.forEach(item => {
    if (item.style) {
      styleCounts[item.style] = (styleCounts[item.style] || 0) + 1;
    }
  });

  // Get most common style
  const mostCommonStyle = Object.entries(styleCounts).length > 0
    ? Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0][0]
    : '';

  appState.categoryIconStyle = mostCommonStyle;

  // Now select one random icon per category using that style
  const categories = new Set(appState.allItems.map(item => item.category));

  categories.forEach(category => {
    selectRandomIconForCategory(category);
  });

  console.log(`✨ Initialized category icons with style: ${appState.categoryIconStyle || 'Default'}`);
}

/**
 * Select an intelligent icon for a category using semantic matching
 * Priority order:
 * 1. Filename matches category name (exact match or substring)
 * 2. Semantic/keyword matching
 * 3. First alphabetical icon (consistent and deterministic)
 */
export function selectRandomIconForCategory(category) {
  // Get all items in this category
  let itemsInCategory = appState.allItems.filter(item => item.category === category);

  if (itemsInCategory.length === 0) {
    return;
  }

  // Prefer items with the consistent style
  if (appState.categoryIconStyle) {
    const itemsWithStyle = itemsInCategory.filter(item => item.style === appState.categoryIconStyle);
    if (itemsWithStyle.length > 0) {
      itemsInCategory = itemsWithStyle;
    }
  }

  let selectedItem = null;

  // Strategy 1: Try exact filename match to category name
  const categoryLower = category.toLowerCase();
  const categoryNormalized = categoryLower.replace(/[^a-z0-9]/g, '');

  selectedItem = itemsInCategory.find(item => {
    const fileNameNormalized = item.fileName.toLowerCase().replace(/\.svg$/, '').replace(/[^a-z0-9]/g, '');
    return fileNameNormalized === categoryNormalized;
  });

  // Strategy 2: Try substring match (category name contains filename or vice versa)
  if (!selectedItem) {
    selectedItem = itemsInCategory.find(item => {
      const fileNameBase = item.fileName.toLowerCase().replace(/\.svg$/, '');
      return categoryLower.includes(fileNameBase) || fileNameBase.includes(categoryLower);
    });
  }

  // Strategy 3: Try first word of category
  if (!selectedItem) {
    const firstWord = categoryLower.split(/[\s-]+/)[0];
    if (firstWord.length > 2) {
      selectedItem = itemsInCategory.find(item =>
        item.fileName.toLowerCase().includes(firstWord)
      );
    }
  }

  // Strategy 4: Pick first alphabetically (deterministic, not random)
  if (!selectedItem) {
    itemsInCategory.sort((a, b) => a.fileName.localeCompare(b.fileName));
    selectedItem = itemsInCategory[0];
  }

  // Store the selected icon
  appState.categoryIcons[category] = {
    icon: selectedItem.svgElement ? selectedItem.svgElement.cloneNode(true) : null,
    style: selectedItem.style,
    fileName: selectedItem.fileName,
    itemPath: selectedItem.originalPath
  };
}

/**
 * Get stored icon for a category
 * Returns object with: { icon: SVGElement, style, fileName, itemPath }
 */
export function getCategoryIcon(category) {
  return appState.categoryIcons[category] || null;
}

/**
 * Create a displayable SVG element for category header
 * Returns a prepared SVG element ready to insert into DOM
 */
export function getCategoryIconElement(category, size = 24) {
  const iconData = getCategoryIcon(category);

  if (!iconData || !iconData.icon) {
    return null;
  }

  // Clone the icon
  const clone = iconData.icon.cloneNode(true);

  // Ensure SVG uses currentColor for theme support
  applyCurrentColorToSVG(clone);

  // Prepare for display with specified size
  const prepared = prepareSVGForDisplay(clone, size, 'currentColor');

  return prepared;
}

/**
 * Get the global category icon style
 * Useful for displaying which style is being used
 */
export function getCategoryIconStyle() {
  return appState.categoryIconStyle || 'Default';
}

/**
 * Regenerate all category icons (useful for resetting or changing style)
 */
export function regenerateCategoryIcons() {
  appState.categoryIcons = {};
  initializeCategoryIcons();
}

export default {
  initializeCategoryIcons,
  selectRandomIconForCategory,
  getCategoryIcon,
  getCategoryIconElement,
  getCategoryIconStyle,
  regenerateCategoryIcons
};
