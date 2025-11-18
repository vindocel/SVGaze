/**
 * SVGaze - Editor Export Manager
 *
 * Handles exporting SVG to different formats:
 * - PNG Image
 * - React JSX Component
 * - React Native Component
 * - Data URI
 */

import { appState } from '../state.js';
import { getEditorContent } from './editorCodeManager.js';

// DOM Elements
let exportBtn, exportDropdown;

/**
 * Initialize export manager
 */
export function initExportManager() {
  // Get DOM elements
  exportBtn = document.getElementById('editorExport');
  exportDropdown = document.getElementById('exportDropdown');

  if (!exportBtn || !exportDropdown) {
    console.error('❌ Export manager: Required elements not found');
    return;
  }

  // Setup event listeners for export buttons
  const exportButtons = exportDropdown.querySelectorAll('button[data-format]');
  exportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const format = e.currentTarget.getAttribute('data-format');
      handleExport(format);
    });
  });

  console.log('✅ Export manager initialized');
}

/**
 * Handle export
 * @param {string} format - Export format (png, react, react-native, data-uri)
 */
async function handleExport(format) {
  const content = getEditorContent();

  if (!content.trim()) {
    alert('Não há conteúdo para exportar.');
    return;
  }

  try {
    switch (format) {
      case 'png':
        await exportToPNG(content);
        break;
      case 'react':
        exportToReact(content);
        break;
      case 'react-native':
        exportToReactNative(content);
        break;
      case 'data-uri':
        exportToDataURI(content);
        break;
      default:
        console.error('Unknown export format:', format);
    }
  } catch (error) {
    console.error(`❌ Error exporting to ${format}:`, error);
    alert(`Erro ao exportar para ${format}.`);
  }
}

/**
 * Export SVG to PNG image
 * @param {string} svgCode - SVG code
 */
async function exportToPNG(svgCode) {
  return new Promise((resolve, reject) => {
    // Parse SVG to get dimensions
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      reject(new Error('No SVG element found'));
      return;
    }

    // Get dimensions
    let width = parseInt(svgElement.getAttribute('width')) || 400;
    let height = parseInt(svgElement.getAttribute('height')) || 400;

    // If viewBox is present, use it
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
      const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(Number);
      if (vbWidth && vbHeight) {
        width = vbWidth;
        height = vbHeight;
      }
    }

    // Create image from SVG
    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      // Draw SVG
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to PNG and download
      canvas.toBlob(blob => {
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = appState.editor.fileName.replace('.svg', '.png');
        a.click();

        // Cleanup
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);

        showToast('✓ Exportado para PNG!');
        resolve();
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };

    img.src = url;
  });
}

/**
 * Export SVG to React JSX component
 * @param {string} svgCode - SVG code
 */
function exportToReact(svgCode) {
  try {
    // Parse SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      throw new Error('No SVG element found');
    }

    // Convert to JSX
    const jsx = svgToReactJSX(svgElement);

    // Create component code
    const componentName = 'SvgComponent';
    const componentCode = `import React from 'react';

const ${componentName} = (props) => (
${jsx}
);

export default ${componentName};
`;

    // Copy to clipboard
    navigator.clipboard.writeText(componentCode).then(() => {
      showToast('✓ Código React JSX copiado!');
    }).catch(() => {
      // Fallback: show in modal
      showCodeModal('React JSX', componentCode);
    });

  } catch (error) {
    console.error('❌ Error converting to React:', error);
    alert('Erro ao converter para React JSX.');
  }
}

/**
 * Convert SVG element to React JSX string
 * @param {Element} element - SVG element
 * @param {number} indent - Indentation level
 * @returns {string} - JSX string
 */
function svgToReactJSX(element, indent = 1) {
  const indentStr = '  '.repeat(indent);
  let jsx = indentStr + '<' + element.tagName;

  // Convert attributes
  Array.from(element.attributes).forEach(attr => {
    const name = convertAttributeName(attr.name);
    let value = attr.value;

    // Handle special cases
    if (name === 'style' && typeof value === 'string') {
      // Convert inline style to object
      value = `{{${value.split(';').filter(s => s.trim()).map(s => {
        const [key, val] = s.split(':').map(str => str.trim());
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        return `${camelKey}: '${val}'`;
      }).join(', ')}}}`;
    } else {
      value = `"${value}"`;
    }

    jsx += `\n${indentStr}  ${name}={${value}}`;
  });

  // Handle children
  if (element.children.length === 0) {
    const textContent = element.textContent.trim();
    if (textContent) {
      jsx += `>\n${indentStr}  {${JSON.stringify(textContent)}}\n${indentStr}</${element.tagName}>`;
    } else {
      jsx += '\n' + indentStr + '/>';
    }
  } else {
    jsx += '\n' + indentStr + '>';

    // Add children
    Array.from(element.children).forEach(child => {
      jsx += '\n' + svgToReactJSX(child, indent + 1);
    });

    jsx += '\n' + indentStr + '</' + element.tagName + '>';
  }

  return jsx;
}

/**
 * Convert HTML attribute name to React prop name
 * @param {string} name - Attribute name
 * @returns {string} - React prop name
 */
function convertAttributeName(name) {
  // Special cases
  const specialCases = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex',
    'readonly': 'readOnly',
    'maxlength': 'maxLength',
    'cellspacing': 'cellSpacing',
    'cellpadding': 'cellPadding',
    'rowspan': 'rowSpan',
    'colspan': 'colSpan',
    'usemap': 'useMap',
    'frameborder': 'frameBorder',
    'contenteditable': 'contentEditable',
    'crossorigin': 'crossOrigin'
  };

  if (specialCases[name]) {
    return specialCases[name];
  }

  // Convert hyphenated to camelCase
  if (name.includes('-')) {
    return name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  return name;
}

/**
 * Export SVG to React Native component
 * @param {string} svgCode - SVG code
 */
function exportToReactNative(svgCode) {
  try {
    const componentName = 'SvgComponent';
    const componentCode = `import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const ${componentName} = (props) => (
  <Svg {...props}>
    {/* Replace with your SVG elements */}
    {/* Note: React Native SVG requires importing specific components */}
  </Svg>
);

export default ${componentName};

/*
  Original SVG:
  ${svgCode}

  Note: You'll need to manually convert SVG elements to React Native SVG components.
  Install: npm install react-native-svg
*/
`;

    // Copy to clipboard
    navigator.clipboard.writeText(componentCode).then(() => {
      showToast('✓ Template React Native copiado!');
    }).catch(() => {
      // Fallback: show in modal
      showCodeModal('React Native', componentCode);
    });

  } catch (error) {
    console.error('❌ Error converting to React Native:', error);
    alert('Erro ao converter para React Native.');
  }
}

/**
 * Export SVG to Data URI
 * @param {string} svgCode - SVG code
 */
function exportToDataURI(svgCode) {
  try {
    // Encode SVG to Data URI
    const encoded = encodeURIComponent(svgCode)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');

    const dataURI = `data:image/svg+xml,${encoded}`;

    // Copy to clipboard
    navigator.clipboard.writeText(dataURI).then(() => {
      showToast('✓ Data URI copiado!');
    }).catch(() => {
      // Fallback: show in modal
      showCodeModal('Data URI', dataURI);
    });

  } catch (error) {
    console.error('❌ Error creating Data URI:', error);
    alert('Erro ao criar Data URI.');
  }
}

/**
 * Show code in a modal (fallback when clipboard fails)
 * @param {string} title - Modal title
 * @param {string} code - Code to show
 */
function showCodeModal(title, code) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
  `;

  modal.innerHTML = `
    <div style="
      background: var(--card);
      border-radius: var(--radius-lg);
      padding: var(--space-2xl);
      max-width: 800px;
      max-height: 80vh;
      overflow: auto;
      box-shadow: var(--shadow-lg);
    ">
      <h3 style="margin: 0 0 var(--space-lg) 0;">${title}</h3>
      <textarea readonly style="
        width: 100%;
        min-height: 300px;
        font-family: monospace;
        font-size: 13px;
        padding: var(--space-md);
        background: var(--bg);
        color: var(--text-primary);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
      ">${code}</textarea>
      <div style="margin-top: var(--space-lg); text-align: right;">
        <button class="btn" onclick="this.closest('div[style*=fixed]').remove()">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Select text
  const textarea = modal.querySelector('textarea');
  textarea.select();
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 */
function showToast(message) {
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

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
