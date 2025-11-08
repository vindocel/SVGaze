/**
 * SVGaze - Filter Manager
 * Handle search and filtering logic
 */

import { appState } from '../state.js';
import { isFavorite } from './favoriteManager.js';

export function getFilteredItems() {
  const { search, category, style, showFavoritesOnly } = appState.filters;
  let items = appState.allItems.slice();

  // Filter by category
  if (category) {
    items = items.filter(i => i.category === category);
  }

  // Filter by style
  if (style) {
    items = items.filter(i => i.style === style);
  }

  // Filter by search query
  if (search) {
    const query = search.toLowerCase();
    items = items.filter(i => {
      const searchText = `${i.fileName} ${i.originalPath} ${i.subcategory} ${i.style}`.toLowerCase();
      return searchText.includes(query);
    });
  }

  // Filter favorites only
  if (showFavoritesOnly) {
    items = items.filter(i => isFavorite(i.originalPath));
  }

  // Sort: favorites first, then by category, fileName, style, subcategory
  // This groups variants of the same icon together for easy comparison
  items.sort((a, b) => {
    const favA = isFavorite(a.originalPath) ? 0 : 1;
    const favB = isFavorite(b.originalPath) ? 0 : 1;
    if (favA !== favB) return favA - favB;

    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.fileName !== b.fileName) return a.fileName.localeCompare(b.fileName);
    if (a.style !== b.style) return a.style.localeCompare(b.style);
    if (a.subcategory !== b.subcategory) return a.subcategory.localeCompare(b.subcategory);
    return 0;
  });

  return items;
}

export function setSearchFilter(query) {
  appState.filters.search = query;
}

export function setCategoryFilter(category) {
  appState.filters.category = category;
}

export function setStyleFilter(style) {
  appState.filters.style = style;
}

export function toggleFavoritesOnly() {
  appState.filters.showFavoritesOnly = !appState.filters.showFavoritesOnly;
}

export function getUniqueCategories() {
  const categories = new Set(appState.allItems.map(item => item.category));
  return Array.from(categories).sort((a, b) => {
    if (a === 'Root') return 1;
    if (b === 'Root') return -1;
    return a.localeCompare(b);
  });
}

export function getUniqueStyles() {
  const styles = new Set(
    appState.allItems
      .map(item => item.style)
      .filter(style => style !== '')
  );
  return Array.from(styles).sort();
}

export default {
  getFilteredItems,
  setSearchFilter,
  setCategoryFilter,
  setStyleFilter,
  toggleFavoritesOnly,
  getUniqueCategories,
  getUniqueStyles
};
