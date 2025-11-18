/**
 * SVGaze - Editor Code Manager (CodeMirror 5)
 *
 * Manages the code editor using CodeMirror 5 for professional SVG editing
 */

import { appState } from '../state.js';

// CodeMirror instance
let editor = null;
let editorContainer = null;

// Default SVG template
const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f0f0f0"/>
  <circle cx="200" cy="200" r="100" fill="#3b82f6"/>
  <text x="200" y="210" text-anchor="middle" font-size="24" fill="white" font-family="Arial">
    SVGaze
  </text>
</svg>`;

/**
 * Initialize the code editor with CodeMirror
 */
export function initCodeEditor() {
  editorContainer = document.getElementById('editorCode');

  if (!editorContainer) {
    console.error('❌ Code editor container not found');
    return;
  }

  // Wait for CodeMirror to be loaded
  const initInterval = setInterval(() => {
    if (window.CodeMirror) {
      clearInterval(initInterval);
      setupCodeMirror();
    }
  }, 100);

  console.log('⏳ Waiting for CodeMirror to load...');
}

/**
 * Setup CodeMirror editor
 */
function setupCodeMirror() {
  // Check theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Create CodeMirror instance
  editor = CodeMirror(editorContainer, {
    value: appState.editor.currentSVG || DEFAULT_SVG,
    mode: 'xml',
    theme: isDark ? 'material-darker' : 'default',
    lineNumbers: true,
    lineWrapping: appState.editor.wordWrap,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    autoCloseTags: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  });

  // Set height to 100%
  editor.setSize('100%', '100%');

  // Listen for changes
  editor.on('change', () => {
    handleCodeChange(editor.getValue());
  });

  console.log('✅ Code editor initialized with CodeMirror 5');

  // Listen for theme changes
  observeThemeChange();

  // Listen for editor load event
  window.addEventListener('editor-load-svg', handleLoadSVG);

  // Listen for editor view shown
  window.addEventListener('editor-view-shown', () => {
    if (editor) {
      editor.refresh();
      editor.focus();
    }
  });

  // Setup word wrap toggle
  setupWordWrapToggle();

  // Initial file size update
  updateFileSize(editor.getValue());
}

/**
 * Handle code changes
 * @param {string} code - New code content
 */
function handleCodeChange(code) {
  appState.editor.currentSVG = code;
  appState.editor.isModified = true;
  appState.editor.originalSize = new Blob([code]).size;

  // Update file size badge
  updateFileSize(code);

  // Trigger preview update (debounced)
  clearTimeout(handleCodeChange.timeout);
  handleCodeChange.timeout = setTimeout(() => {
    window.dispatchEvent(new CustomEvent('editor-code-changed', {
      detail: { svgCode: code }
    }));
  }, 300);
}

/**
 * Update file size display
 * @param {string} code - SVG code
 */
function updateFileSize(code) {
  const fileSizeBadge = document.getElementById('editorFileSize');
  if (fileSizeBadge) {
    const bytes = new Blob([code]).size;
    fileSizeBadge.textContent = formatBytes(bytes);
  }
}

/**
 * Format bytes to human readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
}

/**
 * Get current editor content
 * @returns {string} - Current SVG code
 */
export function getEditorContent() {
  if (!editor) return '';
  return editor.getValue();
}

/**
 * Set editor content
 * @param {string} code - SVG code to set
 */
export function setEditorContent(code) {
  if (!editor) {
    console.error('❌ Editor not initialized');
    return;
  }

  editor.setValue(code);
  appState.editor.currentSVG = code;
  appState.editor.isModified = false;
  updateFileSize(code);
}

/**
 * Clear editor content
 */
export function clearEditor() {
  setEditorContent(DEFAULT_SVG);
  appState.editor.fileName = 'untitled.svg';
  appState.editor.isModified = false;
}

/**
 * Handle load SVG event from view manager
 * @param {CustomEvent} e - Custom event with SVG data
 */
function handleLoadSVG(e) {
  const { svgCode, fileName } = e.detail;
  setEditorContent(svgCode);
  appState.editor.fileName = fileName;
}

/**
 * Setup word wrap toggle
 */
function setupWordWrapToggle() {
  const wrapToggle = document.getElementById('editorWrap');
  if (wrapToggle) {
    wrapToggle.addEventListener('change', (e) => {
      appState.editor.wordWrap = e.target.checked;
      if (editor) {
        editor.setOption('lineWrapping', e.target.checked);
      }
    });

    // Set initial state
    wrapToggle.checked = appState.editor.wordWrap;
  }
}

/**
 * Observe theme changes and update CodeMirror theme
 */
function observeThemeChange() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        updateEditorTheme();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

/**
 * Update editor theme based on current app theme
 */
function updateEditorTheme() {
  if (!editor) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  editor.setOption('theme', isDark ? 'material-darker' : 'default');

  console.log(`🎨 Editor theme updated to ${isDark ? 'dark' : 'light'}`);
}

/**
 * Focus the editor
 */
export function focusEditor() {
  if (editor) {
    editor.focus();
  }
}

export default {
  initCodeEditor,
  getEditorContent,
  setEditorContent,
  clearEditor,
  focusEditor
};
