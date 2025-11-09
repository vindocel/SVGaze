/**
 * SVGaze - Main Entry Point
 *
 * Initializes and orchestrates all modules.
 * This is the only script loaded by index.html.
 */

import { appState } from './state.js';
import { initFileHandler } from './modules/fileHandler.js';
import { initGallery, renderGallery, populateCategoryFilter } from './modules/galleryRenderer.js';
import { initModal } from './modules/modalManager.js';
import { applyColor, setColor, getDefaultColorForTheme } from './modules/colorManager.js';
import { applySize, setSize } from './modules/sizeManager.js';
import { setSearchFilter, setCategoryFilter } from './modules/filterManager.js';
import { clearAllFavorites } from './modules/favoriteManager.js';
import { debounce } from './modules/utils.js';
import { initializeCategoryIcons } from './modules/categoryIconManager.js';
import { initDropdown } from './modules/dropdownManager.js';

// DOM Elements
let dirInput, searchInput, categoryDropdown, colorPicker, sizeRange, clearFavBtn, activeColorLabel, themeToggle;

// Track if user manually changed color (to preserve across theme changes)
let userChangedColor = false;

/**
 * Initialize the application
 */
function init() {
  console.log('🎨 SVGaze initializing...');

  // Get DOM elements
  dirInput = document.getElementById('dir');
  searchInput = document.getElementById('search');
  categoryDropdown = document.getElementById('categoryDropdown');
  colorPicker = document.getElementById('colorPicker');
  sizeRange = document.getElementById('sizeRange');
  clearFavBtn = document.getElementById('clearFav');
  activeColorLabel = document.getElementById('activeColorLabel');
  themeToggle = document.getElementById('themeToggle');

  // Initialize modules
  initGallery();
  initModal();

  // Setup file handler
  initFileHandler(
    dirInput,
    onFilesLoaded,
    onFilesError
  );

  // Setup event listeners
  setupEventListeners();

  // Apply initial UI state
  applyInitialState();

  // Expose API for debugging
  window.svgViewer = {
    getAll: () => appState.allItems,
    getFavorites: () => Array.from(appState.favorites),
    getState: () => appState
  };

  console.log('✅ SVGaze initialized successfully');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Search - debounced for performance
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      setSearchFilter(e.target.value);
      renderGallery();
    }, 300));
  }

  // Category dropdown
  if (categoryDropdown) {
    initDropdown(categoryDropdown, (value, text) => {
      setCategoryFilter(value);
      renderGallery();
    });
  }

  // Color picker
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      userChangedColor = true; // Mark that user manually changed color
      setColor(e.target.value);
      applyColor();
      if (activeColorLabel) {
        activeColorLabel.textContent = e.target.value;
      }
    });
  }

  // Size range
  if (sizeRange) {
    sizeRange.addEventListener('input', (e) => {
      setSize(parseInt(e.target.value, 10));
      applySize();
    });
  }

  // Clear favorites
  if (clearFavBtn) {
    clearFavBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar todos os favoritos?')) {
        clearAllFavorites();
        renderGallery();
      }
    });
  }

  // Theme toggle
  if (themeToggle) {
    // Set initial state based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark' ||
                   (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    themeToggle.checked = isDark;

    // Toggle theme on change
    themeToggle.addEventListener('change', (e) => {
      const newTheme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+F or Cmd+F - Focus search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

/**
 * Apply initial UI state from appState
 */
function applyInitialState() {
  // Initialize color based on theme if not set
  if (!appState.ui.selectedColor) {
    appState.ui.selectedColor = getDefaultColorForTheme();
  }

  // Set color
  if (colorPicker) {
    colorPicker.value = appState.ui.selectedColor;
  }
  if (activeColorLabel) {
    activeColorLabel.textContent = appState.ui.selectedColor;
  }

  // Set size
  if (sizeRange) {
    sizeRange.value = appState.ui.selectedSize;
  }

  // Listen for theme changes to update default color
  const observer = new MutationObserver(() => {
    // Only update color if user hasn't manually changed it
    if (!userChangedColor) {
      const newDefaultColor = getDefaultColorForTheme();
      appState.ui.selectedColor = newDefaultColor;
      if (colorPicker) colorPicker.value = newDefaultColor;
      if (activeColorLabel) activeColorLabel.textContent = newDefaultColor;
      applyColor(newDefaultColor);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

/**
 * Callback when files are successfully loaded
 * @param {Array} items - Loaded SVG items
 */
function onFilesLoaded(items) {
  console.log(`📂 Loaded ${items.length} SVG files`);

  // Initialize category icons with random selections
  initializeCategoryIcons();

  // Populate category dropdown
  if (categoryDropdown) {
    populateCategoryFilter(categoryDropdown);
  }

  // Render gallery
  renderGallery();

  // Apply colors and sizes
  applyColor();
  applySize();
}

/**
 * Callback when file loading fails
 * @param {Error} error - Error object
 */
function onFilesError(error) {
  console.error('❌ Error loading files:', error);

  const grid = document.getElementById('grid');
  if (grid) {
    grid.innerHTML = `
      <div class="card" style="grid-column:1/-1;padding:18px;color:var(--error)">
        <strong>Erro ao carregar arquivos SVG</strong>
        <p style="margin:8px 0 0 0;color:var(--text-secondary)">
          ${error.message}
        </p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
