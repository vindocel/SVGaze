/**
 * SVGaze - Main Entry Point
 *
 * Initializes and orchestrates all modules.
 * This is the only script loaded by index.html.
 */

import { initI18n, t, getCurrentLanguage, setLanguage } from '../i18n/i18n.js';
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
import { initViewManager } from './modules/viewManager.js';
import { initEditorManager } from './modules/editorManager.js';

// DOM Elements
let dirInput, searchInput, categoryDropdown, colorPicker, sizeRange, clearFavBtn, activeColorLabel, themeToggle, appBranding, languageSelector, languageBtn, languageMenu, languageText;

// Track if user manually changed color (to preserve across theme changes)
let userChangedColor = false;

/**
 * Initialize the application
 */
function init() {
  console.log('🎨 SVGaze initializing...');

  // Initialize i18n system first
  initI18n();

  // Get DOM elements
  dirInput = document.getElementById('dir');
  searchInput = document.getElementById('search');
  categoryDropdown = document.getElementById('categoryDropdown');
  colorPicker = document.getElementById('colorPicker');
  sizeRange = document.getElementById('sizeRange');
  clearFavBtn = document.getElementById('clearFav');
  activeColorLabel = document.getElementById('activeColorLabel');
  themeToggle = document.getElementById('themeToggle');
  appBranding = document.querySelector('.app-branding');
  languageSelector = document.getElementById('languageSelector');
  languageBtn = document.getElementById('languageBtn');
  languageMenu = document.getElementById('languageMenu');
  languageText = document.getElementById('languageText');

  // Initialize modules
  initGallery();
  initModal();
  initViewManager();
  initEditorManager();

  // Setup mobile toolbar toggle
  initMobileToolbarToggle();

  // Setup sticky toolbar detection
  initStickyToolbar();

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
      if (confirm(t('confirmations.clearFavorites'))) {
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

      // Dispatch custom event to notify editor preview of theme change
      window.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme: newTheme }
      }));
    });
  }

  // Language selector
  if (languageSelector && languageBtn && languageMenu) {
    // Update UI to show current language
    updateLanguageUI();

    // Toggle language menu
    languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = languageSelector.classList.toggle('is-open');
      languageBtn.setAttribute('aria-expanded', isOpen);
    });

    // Handle language option selection
    languageMenu.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', async (e) => {
        e.stopPropagation();
        const selectedLang = option.getAttribute('data-lang');

        if (selectedLang && selectedLang !== getCurrentLanguage()) {
          // Change language
          await setLanguage(selectedLang);

          // Reload page to apply all translations
          window.location.reload();
        }

        // Close menu
        languageSelector.classList.remove('is-open');
        languageBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!languageSelector.contains(e.target)) {
        languageSelector.classList.remove('is-open');
        languageBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Logo branding - different behavior based on current view
  if (appBranding) {
    appBranding.style.cursor = 'pointer';
    appBranding.addEventListener('click', async () => {
      const currentView = appState.currentView;

      if (currentView === 'editor') {
        // If in editor, load logo SVG into editor at 400x400
        const { openInEditor } = await import('./modules/viewManager.js');

        // Detect current theme and get the correct logo
        const currentTheme = document.documentElement.getAttribute('data-theme') ||
                             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const logoClass = currentTheme === 'dark' ? 'dark-theme-logo' : 'light-theme-logo';
        const logoSvg = document.querySelector(`.app-logo.${logoClass}`);
        if (logoSvg) {
          // Clone and modify to 400x400
          const parser = new DOMParser();
          const doc = parser.parseFromString(logoSvg.outerHTML, 'image/svg+xml');
          const svg = doc.querySelector('svg');

          if (svg) {
            svg.setAttribute('width', '400');
            svg.setAttribute('height', '400');

            const serializer = new XMLSerializer();
            const svgCode = serializer.serializeToString(svg);
            openInEditor(svgCode, 'svgaze-logo.svg');
          }
        }
      } else {
        // If in gallery, reset filters (original behavior)
        if (searchInput) searchInput.value = '';
        setSearchFilter('');
        setCategoryFilter(''); // Empty string means "All Categories"

        // Reset dropdown to "Todas as categorias"
        if (categoryDropdown) {
          const trigger = categoryDropdown.querySelector('.dropdown-trigger');
          const allOption = categoryDropdown.querySelector('[data-value=""]');

          if (trigger) trigger.textContent = t('header.allCategories');

          // Update selected state in dropdown
          categoryDropdown.querySelectorAll('[role="option"]').forEach(opt => {
            opt.classList.remove('is-selected');
            opt.setAttribute('aria-selected', 'false');
          });

          if (allOption) {
            allOption.classList.add('is-selected');
            allOption.setAttribute('aria-selected', 'true');
          }
        }

        // Scroll to top smoothly
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        // Re-render gallery
        renderGallery();
      }
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
 * Update language selector UI based on current language
 */
function updateLanguageUI() {
  const currentLang = getCurrentLanguage();

  // Update button text (PT or EN)
  if (languageText) {
    languageText.textContent = currentLang === 'en-US' ? 'EN' : 'PT';
  }

  // Update selected state in menu
  if (languageMenu) {
    languageMenu.querySelectorAll('.language-option').forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === currentLang) {
        option.classList.add('is-selected');
      } else {
        option.classList.remove('is-selected');
      }
    });
  }
}

/**
 * Initialize mobile toolbar toggle functionality
 */
function initMobileToolbarToggle() {
  const toggleBtn = document.getElementById('mobileToolbarToggle');
  const toolbar = document.querySelector('.secondary-toolbar');

  if (!toggleBtn || !toolbar) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toolbar.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.setAttribute('aria-label', isOpen ? 'Fechar filtros' : 'Abrir filtros');
  });

  console.log('📱 Mobile toolbar toggle initialized');
}

/**
 * Initialize sticky toolbar detection
 */
function initStickyToolbar() {
  const toolbar = document.querySelector('.secondary-toolbar');
  if (!toolbar) return;

  // Use Intersection Observer to detect when toolbar becomes sticky
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Toggle 'is-stuck' class when toolbar is not intersecting (i.e., is stuck)
      toolbar.classList.toggle('is-stuck', !entry.isIntersecting);
    },
    {
      threshold: [1],
      rootMargin: '-60px 0px 0px 0px' // Offset by header height
    }
  );

  observer.observe(toolbar);
  console.log('📌 Sticky toolbar detection initialized');
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
