/**
 * SVGaze - Editor Preview Manager
 *
 * Manages the live preview panel for the SVG editor.
 * Handles rendering, zoom, pan, and grid display.
 */

import { appState } from '../state.js';
import { parseSvgCode, applyDataAttributes } from './editorSvgMapper.js';
import { getDefaultColorForTheme } from './colorManager.js';
import { applyCurrentColorToSVG } from './svgProcessor.js';

// DOM Elements
let previewContainer, previewContent, previewDimensions;
let zoomInBtn, zoomOutBtn, zoomLevel, fitBtn, gridBtn, checkeredBtn;

// Preview state
let currentZoom = 100;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };

/**
 * Initialize the preview manager
 */
export function initPreviewManager() {
  // Get DOM elements
  previewContainer = document.getElementById('previewContainer');
  previewContent = document.getElementById('previewContent');
  previewDimensions = document.getElementById('previewDimensions');

  zoomInBtn = document.getElementById('previewZoomIn');
  zoomOutBtn = document.getElementById('previewZoomOut');
  zoomLevel = document.getElementById('previewZoomLevel');
  fitBtn = document.getElementById('previewFit');
  gridBtn = document.getElementById('previewGrid');
  checkeredBtn = document.getElementById('previewCheckered');

  if (!previewContainer || !previewContent) {
    console.error('❌ Preview manager: Required elements not found');
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Listen for code changes
  window.addEventListener('editor-code-changed', handleCodeChange);

  // Listen for editor view shown
  window.addEventListener('editor-view-shown', () => {
    updatePreview(appState.editor.currentSVG);
  });

  // Listen for theme changes
  window.addEventListener('theme-changed', (e) => {
    // Update checkered background theme if active
    if (appState.editor.showCheckered && previewContainer) {
      previewContainer.setAttribute('data-theme', e.detail.theme);
    }

    // Re-render SVG with new theme color
    if (appState.editor.currentSVG) {
      updatePreview(appState.editor.currentSVG);
    }
  });

  console.log('✅ Preview manager initialized');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Zoom controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => zoomIn());
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => zoomOut());
  }

  if (fitBtn) {
    fitBtn.addEventListener('click', () => fitToView());
  }

  if (gridBtn) {
    gridBtn.addEventListener('click', () => toggleGrid());
  }

  if (checkeredBtn) {
    checkeredBtn.addEventListener('click', () => toggleCheckered());
  }

  // Download SVG button
  const downloadSVGBtn = document.getElementById('downloadPreviewSVG');
  if (downloadSVGBtn) {
    downloadSVGBtn.addEventListener('click', () => downloadSVG());
  }

  // Pan functionality
  if (previewContainer) {
    previewContainer.addEventListener('mousedown', handlePanStart);
    previewContainer.addEventListener('mousemove', handlePanMove);
    previewContainer.addEventListener('mouseup', handlePanEnd);
    previewContainer.addEventListener('mouseleave', handlePanEnd);

    // Zoom with mouse wheel
    previewContainer.addEventListener('wheel', handleWheel, { passive: false });
  }

  // Keyboard shortcuts for preview (when editor view is active)
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle code change event
 * @param {CustomEvent} e - Event with SVG code
 */
function handleCodeChange(e) {
  if (e.detail && e.detail.svgCode) {
    updatePreview(e.detail.svgCode);
  }
}

/**
 * Update preview with new SVG code
 * @param {string} svgCode - SVG code to render
 */
function updatePreview(svgCode) {
  if (!previewContent) return;

  // Clear current preview
  previewContent.innerHTML = '';

  // Check if code is empty
  if (!svgCode || !svgCode.trim()) {
    showPlaceholder();
    return;
  }

  try {
    // Parse and sanitize SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      showError('Erro de sintaxe no código SVG');
      return;
    }

    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      showError('Nenhum elemento <svg> encontrado');
      return;
    }

    // Clone and append to preview
    const svgClone = svgElement.cloneNode(true);

    // If SVG doesn't have width/height but has viewBox, set them from viewBox
    if (!svgClone.hasAttribute('width') || !svgClone.hasAttribute('height')) {
      const viewBox = svgClone.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length === 4) {
          if (!svgClone.hasAttribute('width')) {
            svgClone.setAttribute('width', parts[2]);
          }
          if (!svgClone.hasAttribute('height')) {
            svgClone.setAttribute('height', parts[3]);
          }
        }
      }
    }

    // Apply theme-aware color via CSS FIRST
    const defaultColor = getDefaultColorForTheme();

    // Set CSS color property
    svgClone.style.color = defaultColor;

    // Apply currentColor transformation (converts fills/strokes to currentColor for monochrome SVGs)
    applyCurrentColorToSVG(svgClone);

    // Parse SVG code and create mapping
    const mapping = parseSvgCode(svgCode);

    // Apply data attributes to elements for interactive highlighting
    applyDataAttributes(svgClone, mapping);

    // Apply current zoom
    applyZoom(currentZoom);

    // Append to preview
    previewContent.appendChild(svgClone);

    // Note: Hover highlighting is triggered from CODE only, not from SVG
    // setupSvgElementHoverListeners(svgClone); // DISABLED - only code → SVG highlighting

    // Update dimensions display
    updateDimensions(svgClone);

  } catch (error) {
    console.error('❌ Error rendering SVG:', error);
    showError('Erro ao renderizar SVG');
  }
}

/**
 * Show placeholder message
 */
function showPlaceholder() {
  previewContent.innerHTML = `
    <div class="preview-placeholder">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
      <p>Cole ou digite código SVG no editor</p>
    </div>
  `;

  if (previewDimensions) {
    previewDimensions.textContent = '—';
  }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  previewContent.innerHTML = `
    <div class="preview-placeholder" style="color: var(--error);">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>${message}</p>
    </div>
  `;

  if (previewDimensions) {
    previewDimensions.textContent = '—';
  }
}

/**
 * Update dimensions display
 * @param {SVGElement} svg - SVG element
 */
function updateDimensions(svg) {
  if (!previewDimensions) return;

  const width = svg.getAttribute('width') || svg.viewBox?.baseVal?.width || '?';
  const height = svg.getAttribute('height') || svg.viewBox?.baseVal?.height || '?';
  const viewBox = svg.getAttribute('viewBox') || 'none';

  previewDimensions.textContent = `${width} × ${height} • ViewBox: ${viewBox}`;
}

/**
 * Zoom in
 */
function zoomIn() {
  const newZoom = Math.min(currentZoom + 25, 400);
  setZoom(newZoom);
}

/**
 * Zoom out
 */
function zoomOut() {
  const newZoom = Math.max(currentZoom - 25, 25);
  setZoom(newZoom);
}

/**
 * Set zoom level
 * @param {number} zoom - Zoom percentage
 */
function setZoom(zoom) {
  currentZoom = zoom;
  appState.editor.zoom = zoom;

  // Update zoom label
  if (zoomLevel) {
    zoomLevel.textContent = `${zoom}%`;
  }

  // Apply zoom to preview
  applyZoom(zoom);
}

/**
 * Apply zoom transform
 * @param {number} zoom - Zoom percentage
 */
function applyZoom(zoom) {
  if (previewContent) {
    const scale = zoom / 100;
    // CRITICAL FIX: translate FIRST, then scale (prevents pan offset from being multiplied by zoom)
    // Add conditional transition: disable during pan for instant feedback, enable otherwise for smooth effect
    previewContent.style.transition = isPanning ? 'none' : 'transform 0.1s ease-out';
    previewContent.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`;
  }
}

/**
 * Fit SVG to view
 */
function fitToView() {
  setZoom(100);
  panOffset = { x: 0, y: 0 };
  applyZoom(100);
}

/**
 * Toggle grid display
 */
function toggleGrid() {
  appState.editor.showGrid = !appState.editor.showGrid;

  if (previewContainer) {
    if (appState.editor.showGrid) {
      previewContainer.classList.add('show-grid');
    } else {
      previewContainer.classList.remove('show-grid');
    }
  }
}

/**
 * Toggle checkered background
 */
function toggleCheckered() {
  appState.editor.showCheckered = !appState.editor.showCheckered;

  if (previewContainer) {
    if (appState.editor.showCheckered) {
      previewContainer.classList.add('show-checkered');
      // Apply theme attribute for CSS selectors
      previewContainer.setAttribute('data-theme',
        document.documentElement.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      );
    } else {
      previewContainer.classList.remove('show-checkered');
    }
  }
}

/**
 * Handle pan start
 * @param {MouseEvent} e - Mouse event
 */
function handlePanStart(e) {
  // Pan with left mouse button (free panning like svgviewer.dev)
  if (e.button === 0) {
    isPanning = true;
    panStart = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    previewContainer.style.cursor = 'grabbing';
    previewContainer.style.userSelect = 'none';
  }
}

/**
 * Handle pan move
 * @param {MouseEvent} e - Mouse event
 */
function handlePanMove(e) {
  if (!isPanning) return;

  // Direct update (removed requestAnimationFrame for better responsiveness)
  let newPanX = e.clientX - panStart.x;
  let newPanY = e.clientY - panStart.y;

  // Apply pan boundaries (prevent panning too far away)
  const maxPanX = previewContainer.clientWidth * 1.5;
  const maxPanY = previewContainer.clientHeight * 1.5;

  panOffset = {
    x: Math.max(-maxPanX, Math.min(maxPanX, newPanX)),
    y: Math.max(-maxPanY, Math.min(maxPanY, newPanY))
  };

  applyZoom(currentZoom);
}

/**
 * Handle pan end
 */
function handlePanEnd() {
  if (isPanning) {
    isPanning = false;
    previewContainer.style.cursor = 'grab';
    previewContainer.style.userSelect = '';
  }
}

/**
 * Handle mouse wheel zoom
 * @param {WheelEvent} e - Wheel event
 */
function handleWheel(e) {
  // Zoom without Ctrl key requirement (like svgviewer.dev)
  e.preventDefault();

  if (!previewContainer || !previewContent) return;

  // Get mouse position relative to preview container
  const rect = previewContainer.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Calculate zoom delta (smoother with smaller increments)
  const delta = e.deltaY * -0.001;
  const newZoom = Math.round(Math.max(10, Math.min(5000, currentZoom + (delta * currentZoom * 0.1))));

  // Calculate scale ratio for position adjustment
  const oldScale = currentZoom / 100;
  const newScale = newZoom / 100;
  const scaleRatio = newScale / oldScale;

  // Adjust pan offset to keep mouse position fixed during zoom
  const newPanX = mouseX - (mouseX - panOffset.x) * scaleRatio;
  const newPanY = mouseY - (mouseY - panOffset.y) * scaleRatio;

  // Apply boundaries
  const maxPanX = previewContainer.clientWidth * 1.5;
  const maxPanY = previewContainer.clientHeight * 1.5;

  panOffset = {
    x: Math.max(-maxPanX, Math.min(maxPanX, newPanX)),
    y: Math.max(-maxPanY, Math.min(maxPanY, newPanY))
  };

  setZoom(newZoom);
}

/**
 * Handle keyboard shortcuts for preview control
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
  // Only handle shortcuts when editor view is active
  if (appState.currentView !== 'editor') return;

  // Ignore if user is typing in an input/textarea
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch(e.key) {
    case '0':
    case 'Escape':
      // Reset view to 100% and center
      e.preventDefault();
      resetPreview();
      break;

    case 'f':
    case 'F':
      // Fit to view
      e.preventDefault();
      fitToView();
      break;

    case '+':
    case '=':
      // Zoom in
      e.preventDefault();
      zoomIn();
      break;

    case '-':
    case '_':
      // Zoom out
      e.preventDefault();
      zoomOut();
      break;
  }
}

/**
 * Setup hover listeners on SVG elements for interactive highlighting
 * @param {SVGElement} svgRoot - Root SVG element
 */
function setupSvgElementHoverListeners(svgRoot) {
  const interactiveElements = svgRoot.querySelectorAll('.svg-interactive-element');

  interactiveElements.forEach(element => {
    // Hover enter - highlight element and corresponding code lines
    element.addEventListener('mouseenter', (e) => {
      e.stopPropagation();

      // Add hover class to element
      element.classList.add('svg-element-hovered');

      // Get line range for this element
      const lineStart = parseInt(element.getAttribute('data-line-start'));
      const lineEnd = parseInt(element.getAttribute('data-line-end'));

      // Dispatch event for code editor to highlight lines
      window.dispatchEvent(new CustomEvent('svg-element-hover', {
        detail: { lineStart, lineEnd, action: 'enter' }
      }));
    });

    // Hover leave - remove highlight
    element.addEventListener('mouseleave', (e) => {
      e.stopPropagation();

      // Remove hover class
      element.classList.remove('svg-element-hovered');

      // Dispatch event to remove code highlighting
      window.dispatchEvent(new CustomEvent('svg-element-hover', {
        detail: { action: 'leave' }
      }));
    });
  });
}

/**
 * Get current zoom level
 * @returns {number} - Current zoom percentage
 */
export function getZoom() {
  return currentZoom;
}

/**
 * Download current SVG
 */
function downloadSVG() {
  const svgElement = previewContent.querySelector('svg');
  if (!svgElement) {
    return;
  }

  // Clone the SVG to avoid modifying the preview
  const svgClone = svgElement.cloneNode(true);
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Create blob and download
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'icon.svg';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Reset preview
 */
export function resetPreview() {
  setZoom(100);
  panOffset = { x: 0, y: 0 };
  appState.editor.showGrid = false;
  if (previewContainer) {
    previewContainer.classList.remove('show-grid');
  }
  showPlaceholder();
}
