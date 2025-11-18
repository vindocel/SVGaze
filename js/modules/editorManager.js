/**
 * SVGaze - Editor Manager
 *
 * Main orchestrator for the SVG editor.
 * Handles all editor functionality: file operations, toolbar actions, etc.
 */

import { t } from '../../i18n/i18n.js';
import { appState } from '../state.js';
import { initCodeEditor, setEditorContent, getEditorContent, clearEditor } from './editorCodeManager.js';
import { initPreviewManager } from './editorPreviewManager.js';
import { initToolsManager } from './editorToolsManager.js';
import { initTransformManager } from './editorTransformManager.js';
import { initSvgoManager, showSvgoModal } from './editorSvgoManager.js';
import { initDimensionsManager } from './editorDimensionsManager.js';
import { initTabManager } from './editorTabManager.js';

// DOM Elements
let uploadBtn, fileInput, copyBtn, downloadBtn, settingsBtn;
let resizer, codePanel, previewPanel;
let isResizing = false;

/**
 * Initialize the editor manager
 */
export function initEditorManager() {
  // Get DOM elements
  uploadBtn = document.getElementById('editorUpload');
  fileInput = document.getElementById('editorFileInput');
  copyBtn = document.getElementById('editorCopy');
  downloadBtn = document.getElementById('editorDownload');
  settingsBtn = document.getElementById('editorSettings');
  resizer = document.querySelector('.editor-resizer');
  codePanel = document.querySelector('.code-panel');
  previewPanel = document.querySelector('.preview-panel');

  if (!uploadBtn || !fileInput) {
    console.error('❌ Editor manager: Required elements not found');
    return;
  }

  // Initialize all editor components
  initCodeEditor(); // Now uses CodeMirror 5
  initPreviewManager();
  initToolsManager();
  initTabManager(); // New tab-based export system
  initTransformManager();
  initSvgoManager();
  initDimensionsManager();

  // Setup event listeners
  setupEventListeners();

  // Setup resizer
  setupResizer();

  console.log('✅ Editor manager initialized');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Upload file (triggers file input)
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  // Copy SVG code
  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopy);
  }

  // Download SVG
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Settings button - open SVGO modal
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      showSvgoModal();
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
  // Only handle shortcuts when editor is visible
  if (appState.currentView !== 'editor') return;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? e.metaKey : e.ctrlKey;

  // Ctrl/Cmd + S: Download
  if (modKey && e.key.toLowerCase() === 's') {
    e.preventDefault();
    handleDownload();
  }

  // Ctrl/Cmd + O: Open
  if (modKey && e.key.toLowerCase() === 'o') {
    e.preventDefault();
    fileInput.click();
  }
}

/**
 * Handle file select
 * @param {Event} e - Change event
 */
async function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Check file type
  if (!file.name.endsWith('.svg')) {
    alert(t('toasts.warningInvalidFile'));
    return;
  }

  try {
    const content = await file.text();
    appState.editor.fileName = file.name;
    setEditorContent(content);
    console.log(`📂 Opened ${file.name}`);
  } catch (error) {
    console.error('❌ Error reading file:', error);
    alert(t('toasts.errorReadFile'));
  }

  // Reset file input
  fileInput.value = '';
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
  const content = getEditorContent();

  if (!content.trim()) {
    alert(t('toasts.warningNoContentToCopy'));
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    showToast(t('toasts.svgCopied'));
  } catch (error) {
    console.error('❌ Error copying to clipboard:', error);
    // Fallback: select text
    alert(t('toasts.codeManualCopy'));
  }
}

/**
 * Handle download SVG
 */
function handleDownload() {
  const content = getEditorContent();

  if (!content.trim()) {
    alert(t('toasts.warningNoContentToDownload'));
    return;
  }

  // Create blob and download
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = appState.editor.fileName;
  a.click();
  URL.revokeObjectURL(url);

  console.log(`💾 Downloaded ${appState.editor.fileName}`);
  showToast(t('toasts.svgDownloaded'));
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 */
function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: var(--z-toast);
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

/**
 * Load SVG from gallery item
 * @param {string} svgCode - SVG code
 * @param {string} fileName - File name
 */
export function loadSVGInEditor(svgCode, fileName) {
  appState.editor.fileName = fileName;
  setEditorContent(svgCode);
}

/**
 * Setup panel resizer
 */
function setupResizer() {
  if (!resizer || !codePanel || !previewPanel) return;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const container = document.querySelector('.editor-split-pane');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newCodeWidth = e.clientX - containerRect.left;
    const totalWidth = containerRect.width;

    // Calculate percentages
    const codePercentage = (newCodeWidth / totalWidth) * 100;
    const previewPercentage = 100 - codePercentage;

    // Set minimum widths (20% each)
    if (codePercentage < 20 || previewPercentage < 20) return;

    // Apply flex-basis
    codePanel.style.flex = `0 0 ${codePercentage}%`;
    previewPanel.style.flex = `0 0 ${previewPercentage}%`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}
