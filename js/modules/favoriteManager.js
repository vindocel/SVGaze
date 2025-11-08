/**
 * SVGaze - Favorite Manager
 * Manage favorite SVGs with localStorage persistence
 */

import { appState, saveFavorites } from '../state.js';

export function toggleFavorite(path) {
  if (appState.favorites.has(path)) {
    appState.favorites.delete(path);
  } else {
    appState.favorites.add(path);
  }
  saveFavorites();
}

export function isFavorite(path) {
  return appState.favorites.has(path);
}

export function clearAllFavorites() {
  appState.favorites.clear();
  saveFavorites();
}

export function getFavorites() {
  return Array.from(appState.favorites);
}

export default { toggleFavorite, isFavorite, clearAllFavorites, getFavorites };
