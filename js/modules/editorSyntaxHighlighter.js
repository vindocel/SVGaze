/**
 * SVGaze - Editor Syntax Highlighter
 *
 * Provides syntax highlighting for SVG code using Prism.js
 * Creates an overlay that syncs with the textarea for colored code display
 */

// DOM Elements
let editorContainer;
let textarea;
let highlightOverlay;
let highlightCode;

/**
 * Initialize syntax highlighter
 */
export function initSyntaxHighlighter() {
  // Wait for Prism.js to load
  if (typeof Prism === 'undefined') {
    console.warn('⚠️ Prism.js not loaded, syntax highlighting disabled');
    return;
  }

  console.log('✅ Syntax highlighter initialized');
}

/**
 * Setup highlighter for textarea
 * @param {HTMLTextAreaElement} textareaElement - Code editor textarea
 */
export function setupHighlighter(textareaElement) {
  if (typeof Prism === 'undefined') {
    console.warn('⚠️ Prism.js not available - syntax highlighting disabled');
    return;
  }

  console.log('🎨 Setting up syntax highlighter...');

  textarea = textareaElement;
  editorContainer = textarea.parentElement;

  // Create highlight overlay
  createHighlightOverlay();

  // Setup event listeners
  setupEventListeners();

  // Initial highlight with small delay to ensure content is loaded
  setTimeout(() => {
    updateHighlight();
  }, 100);

  console.log('✅ Syntax highlighter setup complete');
}

/**
 * Create the highlight overlay structure
 */
function createHighlightOverlay() {
  // Create overlay container
  highlightOverlay = document.createElement('div');
  highlightOverlay.className = 'syntax-highlight-overlay';

  // Create pre > code structure (required by Prism)
  const pre = document.createElement('pre');
  pre.className = 'language-markup';

  highlightCode = document.createElement('code');
  highlightCode.className = 'language-markup';

  pre.appendChild(highlightCode);
  highlightOverlay.appendChild(pre);

  // Insert before textarea
  editorContainer.insertBefore(highlightOverlay, textarea);

  // Make textarea transparent to show highlight behind
  textarea.style.background = 'transparent';
  textarea.style.position = 'relative';
  textarea.style.zIndex = '2';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Update highlight on input
  textarea.addEventListener('input', updateHighlight);

  // Sync scroll
  textarea.addEventListener('scroll', syncScroll);

  // Update on window resize
  window.addEventListener('resize', updateHighlight);
}

// Note: Hover highlighting removed - will be implemented in the future

/**
 * Update syntax highlighting
 */
export function updateHighlight() {
  if (!textarea || !highlightCode) return;

  const code = textarea.value;
  const lines = code.split('\n');

  // Build HTML with line numbers for accurate detection
  let html = '';
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    // Escape HTML and wrap each line with data-line attribute
    const escapedLine = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Use div for each line - block element that Prism won't break
    html += `<div class="code-line" data-line="${lineNum}">${escapedLine || ' '}</div>`;
  });

  // Set HTML content
  highlightCode.innerHTML = html;

  // Apply Prism highlighting
  try {
    Prism.highlightElement(highlightCode);
  } catch (error) {
    console.error('❌ Prism highlighting error:', error);
  }

  // Sync scroll position
  syncScroll();
}

/**
 * Sync scroll position between textarea and overlay
 */
function syncScroll() {
  if (!textarea || !highlightOverlay) return;

  highlightOverlay.scrollTop = textarea.scrollTop;
  highlightOverlay.scrollLeft = textarea.scrollLeft;
}

/**
 * Destroy highlighter (cleanup)
 */
export function destroyHighlighter() {
  if (highlightOverlay && editorContainer) {
    editorContainer.removeChild(highlightOverlay);
    highlightOverlay = null;
    highlightCode = null;
  }

  if (textarea) {
    textarea.removeEventListener('input', updateHighlight);
    textarea.removeEventListener('scroll', syncScroll);
    textarea.style.background = '';
    textarea.style.position = '';
    textarea.style.zIndex = '';
  }

  window.removeEventListener('resize', updateHighlight);
}

/**
 * Toggle syntax highlighting on/off
 * @param {boolean} enabled - Enable or disable highlighting
 */
export function toggleHighlighting(enabled) {
  if (!highlightOverlay) return;

  if (enabled) {
    highlightOverlay.style.display = 'block';
    textarea.style.background = 'transparent';
    updateHighlight();
  } else {
    highlightOverlay.style.display = 'none';
    textarea.style.background = '';
  }
}

/**
 * Get current highlighting state
 * @returns {boolean} - True if highlighting is enabled
 */
export function isHighlightingEnabled() {
  return highlightOverlay && highlightOverlay.style.display !== 'none';
}

// TODO: Implement hover highlighting in the future

export default {
  initSyntaxHighlighter,
  setupHighlighter,
  updateHighlight,
  destroyHighlighter,
  toggleHighlighting,
  isHighlightingEnabled
};
