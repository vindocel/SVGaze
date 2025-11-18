/**
 * SVGaze - Editor Dimensions Manager
 *
 * Manages the dimensions modal and proportional resizing
 */

import { getEditorContent, setEditorContent } from './editorCodeManager.js';

// DOM Elements
let dimensionsBtn, dimensionsLabel, dimensionsModal, dimensionsModalClose;
let modalWidthInput, modalHeightInput, proportionalToggle, dimensionsApply;

// State
let currentWidth = 400;
let currentHeight = 400;
let aspectRatio = 1;
let isProportional = true;
let isUpdatingProgrammatically = false;

/**
 * Initialize dimensions manager
 */
export function initDimensionsManager() {
  // Get DOM elements
  dimensionsBtn = document.getElementById('dimensionsBtn');
  dimensionsLabel = document.getElementById('dimensionsLabel');
  dimensionsModal = document.getElementById('dimensionsModal');
  dimensionsModalClose = document.getElementById('dimensionsModalClose');
  modalWidthInput = document.getElementById('modalDimensionWidth');
  modalHeightInput = document.getElementById('modalDimensionHeight');
  proportionalToggle = document.getElementById('proportionalToggle');
  dimensionsApply = document.getElementById('dimensionsApply');

  if (!dimensionsBtn || !dimensionsModal) {
    console.error('❌ Dimensions manager: Required elements not found');
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Listen for code changes and update dimensions automatically
  window.addEventListener('editor-code-changed', handleCodeChange);

  // Initialize with current SVG dimensions
  updateFromSVG();

  console.log('✅ Dimensions manager initialized');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Open modal
  if (dimensionsBtn) {
    dimensionsBtn.addEventListener('click', openModal);
  }

  // Close modal
  if (dimensionsModalClose) {
    dimensionsModalClose.addEventListener('click', closeModal);
  }

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (dimensionsModal.classList.contains('active')) {
      // Check if click is outside modal and button
      if (!dimensionsModal.contains(e.target) && !dimensionsBtn.contains(e.target)) {
        closeModal();
      }
    }
  });

  // Proportional toggle
  if (proportionalToggle) {
    proportionalToggle.addEventListener('change', (e) => {
      isProportional = e.target.checked;
      if (isProportional) {
        // Recalculate aspect ratio based on current values
        const width = parseInt(modalWidthInput.value, 10) || 1;
        const height = parseInt(modalHeightInput.value, 10) || 1;
        aspectRatio = width / height;
      }
    });
  }

  // Width input - update height proportionally
  if (modalWidthInput) {
    modalWidthInput.addEventListener('input', (e) => {
      if (isUpdatingProgrammatically) return;

      const newWidth = parseInt(e.target.value, 10);
      if (isNaN(newWidth) || newWidth <= 0) return;

      if (isProportional) {
        isUpdatingProgrammatically = true;
        const newHeight = Math.round(newWidth / aspectRatio);
        modalHeightInput.value = newHeight;
        isUpdatingProgrammatically = false;
      }
    });
  }

  // Height input - update width proportionally
  if (modalHeightInput) {
    modalHeightInput.addEventListener('input', (e) => {
      if (isUpdatingProgrammatically) return;

      const newHeight = parseInt(e.target.value, 10);
      if (isNaN(newHeight) || newHeight <= 0) return;

      if (isProportional) {
        isUpdatingProgrammatically = true;
        const newWidth = Math.round(newHeight * aspectRatio);
        modalWidthInput.value = newWidth;
        isUpdatingProgrammatically = false;
      }
    });
  }

  // Apply button
  if (dimensionsApply) {
    dimensionsApply.addEventListener('click', applyDimensions);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (dimensionsModal.classList.contains('active')) {
      // Escape to close
      if (e.key === 'Escape') {
        closeModal();
      }
      // Enter to apply
      if (e.key === 'Enter') {
        applyDimensions();
      }
    }
  });
}

/**
 * Open dimensions modal
 */
function openModal() {
  // Update inputs with current values
  updateFromSVG();

  // Position modal below the button
  positionModal();

  // Show modal
  dimensionsModal.classList.add('active');

  // Focus first input
  if (modalWidthInput) {
    setTimeout(() => {
      modalWidthInput.focus();
      modalWidthInput.select();
    }, 100);
  }
}

/**
 * Position modal below the dimensions button
 */
function positionModal() {
  if (!dimensionsBtn || !dimensionsModal) return;

  const btnRect = dimensionsBtn.getBoundingClientRect();
  const modalContent = dimensionsModal.querySelector('.dimensions-modal-content');

  if (modalContent) {
    // Position below button with small gap
    dimensionsModal.style.top = `${btnRect.bottom + 4}px`;
    dimensionsModal.style.left = `${btnRect.left}px`;
  }
}

/**
 * Close dimensions modal
 */
function closeModal() {
  dimensionsModal.classList.remove('active');
}

/**
 * Apply dimensions to SVG
 */
function applyDimensions() {
  const newWidth = parseInt(modalWidthInput.value, 10);
  const newHeight = parseInt(modalHeightInput.value, 10);

  if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
    alert('Por favor, insira dimensões válidas.');
    return;
  }

  // Update SVG dimensions in code
  updateSVGDimensions(newWidth, newHeight);

  // Update state
  currentWidth = newWidth;
  currentHeight = newHeight;
  aspectRatio = newWidth / newHeight;

  // Update button label
  updateLabel(newWidth, newHeight);

  // Close modal
  closeModal();

  console.log(`✓ Dimensions updated: ${newWidth}px × ${newHeight}px`);
}

/**
 * Update SVG dimensions in the code editor
 */
function updateSVGDimensions(width, height) {
  const svgCode = getEditorContent();

  // Parse SVG to update width and height attributes
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    console.warn('⚠️ No SVG element found');
    return;
  }

  // Update attributes
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());

  // Serialize back to string
  const serializer = new XMLSerializer();
  const updatedSVG = serializer.serializeToString(doc);

  // Update editor content
  setEditorContent(updatedSVG);
}

/**
 * Update dimensions from current SVG in editor
 */
function updateFromSVG() {
  const svgCode = getEditorContent();

  // Parse SVG to get current dimensions
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    console.warn('⚠️ No SVG element found, using default 400x400');
    currentWidth = 400;
    currentHeight = 400;
  } else {
    // Get width and height from attributes
    const widthAttr = svg.getAttribute('width');
    const heightAttr = svg.getAttribute('height');

    // Parse values (handle 'px', '%', etc.)
    currentWidth = parseFloat(widthAttr) || 400;
    currentHeight = parseFloat(heightAttr) || 400;
  }

  // Update aspect ratio
  aspectRatio = currentWidth / currentHeight;

  // Update modal inputs
  if (modalWidthInput) modalWidthInput.value = currentWidth;
  if (modalHeightInput) modalHeightInput.value = currentHeight;

  // Update button label
  updateLabel(currentWidth, currentHeight);
}

/**
 * Update button label
 */
function updateLabel(width, height) {
  if (dimensionsLabel) {
    dimensionsLabel.textContent = `${Math.round(width)}px × ${Math.round(height)}px`;
  }
}

/**
 * Handle code change event - update dimensions automatically
 * @param {CustomEvent} e - Event with SVG code
 */
function handleCodeChange(e) {
  if (e.detail && e.detail.svgCode) {
    updateFromSVG();
  }
}

/**
 * Get current dimensions
 */
export function getCurrentDimensions() {
  return {
    width: currentWidth,
    height: currentHeight,
    aspectRatio
  };
}

/**
 * Set dimensions programmatically
 */
export function setDimensions(width, height) {
  currentWidth = width;
  currentHeight = height;
  aspectRatio = width / height;

  if (modalWidthInput) modalWidthInput.value = width;
  if (modalHeightInput) modalHeightInput.value = height;

  updateLabel(width, height);
}
