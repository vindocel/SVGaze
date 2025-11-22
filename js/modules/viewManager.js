/**
 * SVGaze - View Manager
 *
 * Manages switching between Gallery and Editor views.
 */

import { appState } from '../state.js';
import { t } from '../../i18n/i18n.js';

// DOM elements
let galleryView, editorView, galleryBtn, editorBtn;

/**
 * Initialize view manager
 */
export function initViewManager() {
  // Get DOM elements
  galleryView = document.getElementById('gallery');
  editorView = document.getElementById('editor');
  galleryBtn = document.getElementById('viewGallery');
  editorBtn = document.getElementById('viewEditor');

  if (!galleryView || !editorView || !galleryBtn || !editorBtn) {
    console.error('❌ View manager: Required elements not found');
    return;
  }

  // Setup event listeners
  galleryBtn.addEventListener('click', () => switchToView('gallery'));
  editorBtn.addEventListener('click', () => switchToView('editor'));

  // Set initial view
  switchToView(appState.currentView);

  console.log('✅ View manager initialized');
}

/**
 * Switch to a specific view
 * @param {string} view - 'gallery' or 'editor'
 */
export function switchToView(view) {
  if (!galleryView || !editorView || !galleryBtn || !editorBtn) {
    console.error('❌ View manager not initialized');
    return;
  }

  // Update state
  appState.currentView = view;

  // Hide all views
  galleryView.style.display = 'none';
  editorView.style.display = 'none';

  // Remove active class from all buttons
  galleryBtn.classList.remove('active');
  editorBtn.classList.remove('active');

  // Update logo tooltip based on current view
  updateLogoTooltip(view);

  // Show selected view and activate button
  if (view === 'gallery') {
    galleryView.style.display = 'block';
    galleryBtn.classList.add('active');
  } else if (view === 'editor') {
    editorView.style.display = 'block';
    editorBtn.classList.add('active');

    // Dispatch custom event for editor initialization
    window.dispatchEvent(new CustomEvent('editor-view-shown'));
  }

  console.log(`🔄 Switched to ${view} view`);
}

/**
 * Update logo tooltip based on current view
 * @param {string} view - Current view
 */
function updateLogoTooltip(view) {
  const appBranding = document.querySelector('.app-branding');
  if (!appBranding) return;

  if (view === 'editor') {
    appBranding.setAttribute('title', t('editor.uploadTitle'));
  } else {
    appBranding.setAttribute('title', t('header.backToHome'));
  }
}

/**
 * Get current view
 * @returns {string} - 'gallery' or 'editor'
 */
export function getCurrentView() {
  return appState.currentView;
}

/**
 * Open editor with specific SVG content
 * @param {string} svgCode - SVG code to load
 * @param {string} fileName - File name
 */
export function openInEditor(svgCode, fileName = 'untitled.svg') {
  // Update editor state
  appState.editor.currentSVG = svgCode;
  appState.editor.fileName = fileName;
  appState.editor.originalSize = new Blob([svgCode]).size;
  appState.editor.isModified = false;

  // Switch to editor view
  switchToView('editor');

  // Dispatch custom event with SVG data
  window.dispatchEvent(new CustomEvent('editor-load-svg', {
    detail: { svgCode, fileName }
  }));

  console.log(`📝 Opened ${fileName} in editor`);
}
