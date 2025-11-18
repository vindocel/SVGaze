/**
 * SVGaze - Editor Tools Manager
 *
 * Handles SVG processing tools: Prettify, Minify, Validate.
 * Note: Optimize is handled by editorSvgoManager.js for advanced SVGO optimization.
 */

import { getEditorContent, setEditorContent } from './editorCodeManager.js';
import { showToast } from './toast.js';

// DOM Elements
let prettifyBtn, minifyBtn, validateBtn;

/**
 * Initialize tools manager
 */
export function initToolsManager() {
  // Get DOM elements
  prettifyBtn = document.getElementById('editorPrettify');
  minifyBtn = document.getElementById('editorMinify');
  validateBtn = document.getElementById('editorValidate');

  // Setup event listeners
  // Note: Optimize button is handled by editorSvgoManager.js for advanced SVGO optimization

  if (prettifyBtn) {
    prettifyBtn.addEventListener('click', handlePrettify);
  }

  if (minifyBtn) {
    minifyBtn.addEventListener('click', handleMinify);
  }

  if (validateBtn) {
    validateBtn.addEventListener('click', handleValidate);
  }

  console.log('✅ Tools manager initialized');
}

/**
 * Handle prettify (format SVG)
 */
function handlePrettify() {
  const content = getEditorContent();

  if (!content.trim()) {
    alert('Não há conteúdo para formatar.');
    return;
  }

  try {
    // Format SVG
    const formatted = prettifySVG(content);

    // Update editor
    setEditorContent(formatted);

    showToast('✓ SVG formatado!');
  } catch (error) {
    console.error('❌ Error formatting:', error);
    alert('Erro ao formatar SVG.');
  }
}

/**
 * Prettify/format SVG code
 * @param {string} svg - SVG code
 * @returns {string} - Formatted SVG
 */
function prettifySVG(svg) {
  // Parse SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');

  // Check for parsing errors
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid SVG syntax');
  }

  // Format with indentation
  const formatted = formatXML(doc.documentElement, 0);

  return formatted;
}

/**
 * Format XML with indentation
 * @param {Element} element - XML element
 * @param {number} level - Indentation level
 * @returns {string} - Formatted XML
 */
function formatXML(element, level = 0) {
  const indent = '  '.repeat(level);
  let result = indent + '<' + element.tagName;

  // Add attributes
  Array.from(element.attributes).forEach(attr => {
    result += ` ${attr.name}="${attr.value}"`;
  });

  // Check if element has children
  if (element.children.length === 0) {
    // Check if element has text content
    const textContent = element.textContent.trim();
    if (textContent) {
      result += '>' + textContent + '</' + element.tagName + '>\n';
    } else {
      result += '/>\n';
    }
  } else {
    result += '>\n';

    // Add children
    Array.from(element.children).forEach(child => {
      result += formatXML(child, level + 1);
    });

    result += indent + '</' + element.tagName + '>\n';
  }

  return result;
}

/**
 * Handle minify (remove whitespace)
 */
function handleMinify() {
  const content = getEditorContent();

  if (!content.trim()) {
    alert('Não há conteúdo para minificar.');
    return;
  }

  try {
    // Minify SVG
    const minified = minifySVG(content);

    // Update editor
    setEditorContent(minified);

    showToast('✓ SVG minificado!');
  } catch (error) {
    console.error('❌ Error minifying:', error);
    alert('Erro ao minificar SVG.');
  }
}

/**
 * Minify SVG (remove all unnecessary whitespace)
 * @param {string} svg - SVG code
 * @returns {string} - Minified SVG
 */
function minifySVG(svg) {
  let minified = svg;

  // Remove comments
  minified = minified.replace(/<!--[\s\S]*?-->/g, '');

  // Remove all whitespace between tags
  minified = minified.replace(/>\s+</g, '><');

  // Remove leading/trailing whitespace
  minified = minified.trim();

  // Remove newlines
  minified = minified.replace(/\n/g, '');

  return minified;
}

/**
 * Handle validate (check SVG syntax)
 */
function handleValidate() {
  const content = getEditorContent();

  if (!content.trim()) {
    alert('Não há conteúdo para validar.');
    return;
  }

  try {
    // Parse SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      const errorText = parserError.textContent;
      alert(`❌ Erro de sintaxe no SVG:\n\n${errorText}`);
      return;
    }

    // Check if SVG element exists
    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      alert('❌ Nenhum elemento <svg> encontrado.');
      return;
    }

    // Validation passed
    showToast('✓ SVG válido!');

    // Optional: Show warnings for missing attributes
    const warnings = [];

    if (!svgElement.hasAttribute('xmlns')) {
      warnings.push('- Atributo "xmlns" ausente (recomendado)');
    }

    if (!svgElement.hasAttribute('viewBox') && !svgElement.hasAttribute('width')) {
      warnings.push('- Nenhum "viewBox" ou "width" definido');
    }

    if (warnings.length > 0) {
      console.warn('⚠️ SVG Warnings:\n' + warnings.join('\n'));
    }

  } catch (error) {
    console.error('❌ Error validating:', error);
    alert('Erro ao validar SVG.');
  }
}

