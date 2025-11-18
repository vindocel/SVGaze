/**
 * SVGaze - Modal Manager
 * Handle modal dialog for SVG preview
 */

import { appState } from '../state.js';
import { escapeHtml } from './utils.js';
import { parseAndSanitizeSVG, ensureViewBox, applyCurrentColorToSVG, getSVGText } from './svgProcessor.js';
import { copySVGCode, copyFileName, copyFilePath } from './clipboardManager.js';
import { openInEditor } from './viewManager.js';

let modalBackdrop, modalContent, modalCopyBtn, modalNameBtn, modalEditBtn, modalPathBtn, modalCloseBtn;

export function initModal() {
  modalBackdrop = document.getElementById('modalBackdrop');
  modalContent = document.getElementById('modalContent');
  modalCopyBtn = document.getElementById('modalCopy');
  modalNameBtn = document.getElementById('modalName');
  modalEditBtn = document.getElementById('modalEdit');
  modalPathBtn = document.getElementById('modalPath');
  modalCloseBtn = document.getElementById('modalClose');

  if (!modalBackdrop || !modalContent) {
    console.error('Modal elements not found');
    return;
  }

  // Close button
  modalCloseBtn?.addEventListener('click', closeModal);

  // Click backdrop to close
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.modal.isOpen) {
      closeModal();
    }
  });
}

export function openModal(item) {
  if (!modalBackdrop || !modalContent) return;

  appState.modal.isOpen = true;
  appState.modal.currentItem = item;

  const svgText = getSVGText(item);
  modalContent.innerHTML = '';

  // Title
  const title = document.createElement('div');
  title.style.marginBottom = '8px';
  const pathDisplay = item.fullPath || item.originalPath;
  title.innerHTML = `<strong>${escapeHtml(item.fileName)}</strong> <span style="color:var(--text-muted);font-size:.9rem"> — ${escapeHtml(pathDisplay)}</span>`;

  // Preview
  const previewWrap = document.createElement('div');
  previewWrap.style.padding = '12px';

  const svgParsed = parseAndSanitizeSVG(svgText);
  if (svgParsed) {
    const svgEl = svgParsed.cloneNode(true);
    ensureViewBox(svgEl);
    applyCurrentColorToSVG(svgEl);
    svgEl.style.height = '320px';
    svgEl.style.width = 'auto';
    svgEl.style.display = 'block';
    svgEl.style.margin = '0 auto';
    svgEl.style.color = appState.ui.selectedColor;
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgEl.style.overflow = 'visible';
    previewWrap.appendChild(svgEl);
  } else {
    previewWrap.textContent = 'SVG inválido';
  }

  modalContent.appendChild(title);
  modalContent.appendChild(previewWrap);

  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden', 'false');

  // Attach button handlers
  if (modalCopyBtn) {
    modalCopyBtn.onclick = () => copySVGCode(item, modalCopyBtn);
  }
  if (modalNameBtn) {
    modalNameBtn.onclick = () => copyFileName(item, modalNameBtn);
  }
  if (modalEditBtn) {
    modalEditBtn.onclick = () => {
      const svgText = getSVGText(item);
      if (svgText) {
        openInEditor(svgText, item.name);
        closeModal();
      }
    };
  }
  if (modalPathBtn) {
    modalPathBtn.onclick = () => copyFilePath(item, modalPathBtn);
  }
}

export function closeModal() {
  if (!modalBackdrop) return;

  appState.modal.isOpen = false;
  appState.modal.currentItem = null;

  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';

  // Clear button handlers
  if (modalCopyBtn) modalCopyBtn.onclick = null;
  if (modalNameBtn) modalNameBtn.onclick = null;
  if (modalPathBtn) modalPathBtn.onclick = null;
}

export default { initModal, openModal, closeModal };
