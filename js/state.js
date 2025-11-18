/**
 * SVGaze - Application State
 *
 * Centralized state management for the application.
 * All modules can import and modify this state.
 */

/**
 * Main application state
 */
export const appState = {
  // All loaded SVG items
  allItems: [],

  // Favorite items (Set of originalPath strings)
  favorites: new Set(JSON.parse(localStorage.getItem('svgFavs') || '[]')),

  // Current filters
  filters: {
    search: '',
    category: '',
    style: '',
    showFavoritesOnly: false
  },

  // UI state
  ui: {
    selectedSize: 72,
    selectedColor: null, // Will be set dynamically based on theme
    theme: localStorage.getItem('theme') || 'auto', // 'light', 'dark', 'auto'
    language: localStorage.getItem('language') || 'pt-BR'
  },

  // Modal state
  modal: {
    isOpen: false,
    currentItem: null
  },

  // Category icons (persisted during session)
  categoryIcons: {}, // { categoryName: { icon: SVGElement, style: 'Bold', fileName: 'heart.svg', itemPath: '...' } }
  categoryIconStyle: null, // 'Bold', 'Outline', etc. - ensures consistency across ALL categories

  // Editor state
  editor: {
    currentSVG: '', // Current SVG code being edited
    fileName: 'untitled.svg', // Current file name
    originalSize: 0, // Original file size in bytes
    optimizedSize: 0, // Optimized file size in bytes
    isModified: false, // Has the code been modified?
    zoom: 100, // Preview zoom level (percentage)
    showGrid: false, // Show grid in preview
    showCheckered: false, // Show checkered background in preview
    wordWrap: true, // Word wrap in code editor
    history: {
      past: [], // Undo stack
      future: [] // Redo stack
    }
  },

  // Current view ('gallery' or 'editor')
  currentView: 'gallery'
};

/**
 * Save favorites to localStorage
 */
export function saveFavorites() {
  localStorage.setItem('svgFavs', JSON.stringify(Array.from(appState.favorites)));
}

/**
 * Save theme preference
 * @param {string} theme - 'light', 'dark', or 'auto'
 */
export function saveTheme(theme) {
  appState.ui.theme = theme;
  localStorage.setItem('theme', theme);
}

/**
 * Save language preference
 * @param {string} language - Language code (e.g., 'pt-BR', 'en-US')
 */
export function saveLanguage(language) {
  appState.ui.language = language;
  localStorage.setItem('language', language);
}

/**
 * Reset all state (useful for testing)
 */
export function resetState() {
  appState.allItems = [];
  appState.favorites.clear();
  appState.filters = {
    search: '',
    category: '',
    style: '',
    showFavoritesOnly: false
  };
  appState.ui = {
    selectedSize: 72,
    selectedColor: '#000000',
    theme: 'auto',
    language: 'pt-BR'
  };
  appState.modal = {
    isOpen: false,
    currentItem: null
  };
  appState.categoryIcons = {};
  appState.categoryIconStyle = null;

  // Clear localStorage
  localStorage.removeItem('svgFavs');
  localStorage.removeItem('theme');
  localStorage.removeItem('language');
}

/**
 * Get current state (for debugging)
 */
export function getState() {
  return {
    ...appState,
    favorites: Array.from(appState.favorites)
  };
}

export default appState;
