/**
 * Editor Tab Manager
 * Handles tab switching and export content generation with syntax highlighting
 */

import { getEditorContent } from './editorCodeManager.js';
import { showToast } from './toast.js';
import { getDefaultColorForTheme } from './colorManager.js';
import { applyCurrentColorToSVG } from './svgProcessor.js';

// Tab state
let currentTab = 'preview';

// Settings state for React
let reactSettings = {
  typescript: false,
  singleQuotes: false,
  stripSemicolons: false
};

// Settings state for React Native
let reactNativeSettings = {
  typescript: false,
  singleQuotes: false,
  stripSemicolons: false
};

/**
 * Initialize tab manager
 */
export function initTabManager() {
  const tabButtons = document.querySelectorAll('.export-tab');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
    });
  });

  // Set up copy buttons for Data URI
  setupDataURICopyButtons();

  // Set up PNG export
  setupPNGExport();

  // Set up PNG checkered background toggle
  setupPNGCheckeredToggle();

  // Set up settings dropdowns
  setupSettingsDropdowns();

  // Set up React/React Native copy buttons
  setupCodeCopyButtons();

  // Listen for theme changes
  window.addEventListener('theme-changed', (e) => {
    const previewArea = document.getElementById('pngPreviewArea');

    // Update PNG checkered background theme if active
    if (previewArea && previewArea.classList.contains('show-checkered')) {
      previewArea.setAttribute('data-theme', e.detail.theme);
    }

    // Re-render current tab if it's PNG
    if (currentTab === 'png') {
      const svgCode = getEditorContent();
      if (svgCode.trim()) {
        generatePNGPreview(svgCode);
      }
    }
  });
}

/**
 * Switch to a specific tab
 */
function switchTab(tabName) {
  if (currentTab === tabName) return;

  currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll('.export-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    const contentTabName = content.id.replace('tab', '').toLowerCase();
    const isActive = contentTabName === tabName.toLowerCase().replace('-', '');
    content.classList.toggle('active', isActive);
  });

  // Generate content for the active tab
  if (tabName !== 'preview') {
    generateTabContent(tabName);
  }
}

/**
 * Generate content for a specific tab
 */
function generateTabContent(tabName) {
  const svgCode = getEditorContent();

  if (!svgCode.trim()) {
    showEmptyState(tabName);
    return;
  }

  switch (tabName) {
    case 'react':
      generateReactCode(svgCode);
      break;
    case 'react-native':
      generateReactNativeCode(svgCode);
      break;
    case 'data-uri':
      generateDataURIBoxes(svgCode);
      break;
    case 'png':
      generatePNGPreview(svgCode);
      break;
  }
}

/**
 * Show empty state for tabs
 */
function showEmptyState(tabName) {
  if (tabName === 'react') {
    const output = document.querySelector('#reactCodeOutput code');
    if (output) output.textContent = '// Cole ou digite código SVG no editor';
  } else if (tabName === 'react-native') {
    const output = document.querySelector('#reactNativeCodeOutput code');
    if (output) output.textContent = '// Cole ou digite código SVG no editor';
  } else if (tabName === 'data-uri') {
    ['minifiedDataURI', 'base64DataURI', 'encodedDataURI'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  } else if (tabName === 'png') {
    const preview = document.getElementById('pngPreviewArea');
    if (preview) preview.innerHTML = '<p style="color: var(--text-secondary);">Nenhum SVG para visualizar</p>';
  }
}

/**
 * Generate React component code
 */
function generateReactCode(svgCode) {
  const codeElement = document.querySelector('#reactCodeOutput code');
  if (!codeElement) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      codeElement.textContent = '// SVG inválido';
      return;
    }

    // Convert SVG to React-friendly format
    let reactSVG = svgCode;

    // Convert attributes to camelCase
    reactSVG = reactSVG.replace(/fill-rule/g, 'fillRule');
    reactSVG = reactSVG.replace(/clip-rule/g, 'clipRule');
    reactSVG = reactSVG.replace(/stroke-width/g, 'strokeWidth');
    reactSVG = reactSVG.replace(/stroke-linecap/g, 'strokeLinecap');
    reactSVG = reactSVG.replace(/stroke-linejoin/g, 'strokeLinejoin');
    reactSVG = reactSVG.replace(/stroke-miterlimit/g, 'strokeMiterlimit');
    reactSVG = reactSVG.replace(/stroke-dasharray/g, 'strokeDasharray');
    reactSVG = reactSVG.replace(/stroke-dashoffset/g, 'strokeDashoffset');
    reactSVG = reactSVG.replace(/font-family/g, 'fontFamily');
    reactSVG = reactSVG.replace(/font-size/g, 'fontSize');
    reactSVG = reactSVG.replace(/text-anchor/g, 'textAnchor');
    reactSVG = reactSVG.replace(/class=/g, 'className=');

    // Add props
    reactSVG = reactSVG.replace('<svg', '<svg {...props}');

    // Indent the SVG content
    const indentedSVG = reactSVG
      .split('\n')
      .map(line => '    ' + line)
      .join('\n')
      .trim();

    // Build component code
    let componentCode = '';

    // Imports
    if (reactSettings.typescript) {
      componentCode += `import * as React from "react";\nimport { SVGProps } from "react";\n`;
    } else {
      componentCode += `import * as React from "react";\n`;
    }

    // Component declaration
    const propsType = reactSettings.typescript ? '(props: SVGProps<SVGSVGElement>)' : '(props)';
    componentCode += `const SVGComponent = ${propsType} => (\n  ${indentedSVG}\n);\n`;

    // Export
    componentCode += `export default SVGComponent;`;

    // Apply single quotes if needed
    if (reactSettings.singleQuotes) {
      componentCode = componentCode.replace(/"/g, "'");
    }

    // Strip semicolons if needed
    if (reactSettings.stripSemicolons) {
      componentCode = componentCode.replace(/;/g, '');
    }

    // Set content and apply syntax highlighting
    codeElement.textContent = componentCode;
    if (window.Prism) {
      window.Prism.highlightElement(codeElement);
    }
  } catch (error) {
    codeElement.textContent = `// Erro ao gerar código React:\n// ${error.message}`;
  }
}

/**
 * Generate React Native component code
 */
function generateReactNativeCode(svgCode) {
  const codeElement = document.querySelector('#reactNativeCodeOutput code');
  if (!codeElement) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      codeElement.textContent = '// SVG inválido';
      return;
    }

    const width = svgElement.getAttribute('width') || '100';
    const height = svgElement.getAttribute('height') || '100';
    const viewBox = svgElement.getAttribute('viewBox') || `0 0 ${width} ${height}`;

    // Extract SVG content (children)
    let svgContent = svgElement.innerHTML;

    // Convert to React Native SVG components
    svgContent = svgContent.replace(/<(\/?)(path|circle|rect|ellipse|line|polyline|polygon|g|defs|clipPath|linearGradient|radialGradient|stop)/g,
      (match, slash, tag) => `<${slash}${tag.charAt(0).toUpperCase() + tag.slice(1)}`);

    // Convert attributes
    svgContent = svgContent.replace(/fill-rule/g, 'fillRule');
    svgContent = svgContent.replace(/clip-rule/g, 'clipRule');
    svgContent = svgContent.replace(/stroke-width/g, 'strokeWidth');
    svgContent = svgContent.replace(/stroke-linecap/g, 'strokeLinecap');
    svgContent = svgContent.replace(/stroke-linejoin/g, 'strokeLinejoin');

    // Indent content
    const indentedContent = svgContent
      .split('\n')
      .map(line => '      ' + line.trim())
      .join('\n')
      .trim();

    // Build component code
    let componentCode = '';

    // Imports
    if (reactNativeSettings.typescript) {
      componentCode += `import * as React from "react";\nimport Svg, { Path, Circle, Rect, G } from "react-native-svg";\nimport { SVGProps } from "react";\n`;
    } else {
      componentCode += `import * as React from "react";\nimport Svg, { Path, Circle, Rect, G } from "react-native-svg";\n`;
    }

    // Component declaration
    const propsType = reactNativeSettings.typescript ? '(props: SVGProps<SVGSVGElement>)' : '(props)';
    componentCode += `const SVGComponent = ${propsType} => (\n  <Svg\n    width={${width}}\n    height={${height}}\n    viewBox="${viewBox}"\n    {...props}\n  >\n    ${indentedContent}\n  </Svg>\n);\n`;

    // Export
    componentCode += `export default SVGComponent;`;

    // Apply single quotes if needed
    if (reactNativeSettings.singleQuotes) {
      componentCode = componentCode.replace(/"/g, "'");
    }

    // Strip semicolons if needed
    if (reactNativeSettings.stripSemicolons) {
      componentCode = componentCode.replace(/;/g, '');
    }

    // Set content and apply syntax highlighting
    codeElement.textContent = componentCode;
    if (window.Prism) {
      window.Prism.highlightElement(codeElement);
    }
  } catch (error) {
    codeElement.textContent = `// Erro ao gerar código React Native:\n// ${error.message}`;
  }
}

/**
 * Generate Data URI boxes with three different encodings
 */
function generateDataURIBoxes(svgCode) {
  try {
    // Minify SVG
    const minified = svgCode
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();

    // 1. Minified Data URI (URL encoded)
    const minifiedDataURI = 'data:image/svg+xml,' + encodeURIComponent(minified)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');

    const minifiedEl = document.getElementById('minifiedDataURI');
    const minifiedSize = document.getElementById('minifiedSize');
    if (minifiedEl) minifiedEl.textContent = minifiedDataURI;
    if (minifiedSize) minifiedSize.textContent = formatBytes(minifiedDataURI.length);

    // 2. Base64 encoded
    const base64 = btoa(unescape(encodeURIComponent(minified)));
    const base64DataURI = `data:image/svg+xml;base64,${base64}`;

    const base64El = document.getElementById('base64DataURI');
    const base64Size = document.getElementById('base64Size');
    if (base64El) base64El.textContent = base64DataURI;
    if (base64Size) base64Size.textContent = formatBytes(base64DataURI.length);

    // 3. encodeURIComponent (same as minified, shown for reference)
    const encodedDataURI = encodeURIComponent(minified);

    const encodedEl = document.getElementById('encodedDataURI');
    const encodedSize = document.getElementById('encodedSize');
    if (encodedEl) encodedEl.textContent = encodedDataURI;
    if (encodedSize) encodedSize.textContent = formatBytes(encodedDataURI.length);

  } catch (error) {
    console.error('Error generating Data URI:', error);
    showToast('✗ Erro ao gerar Data URI', 'error');
  }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(2) + ' kB';
  return (kb / 1024).toFixed(2) + ' MB';
}

/**
 * Generate PNG preview at selected scale
 */
function generatePNGPreview(svgCode) {
  const previewArea = document.getElementById('pngPreviewArea');
  if (!previewArea) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      previewArea.innerHTML = '<p style="color: var(--text-secondary);">SVG inválido</p>';
      return;
    }

    // Clone and insert SVG
    const svgClone = svgElement.cloneNode(true);

    // Get scale from selector
    const scaleSelector = document.getElementById('pngSizeSelector');
    const scale = scaleSelector ? parseFloat(scaleSelector.value) : 1;

    // Apply scale
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');

    if (width) svgClone.setAttribute('width', parseFloat(width) * scale);
    if (height) svgClone.setAttribute('height', parseFloat(height) * scale);

    // Apply theme-aware color via CSS FIRST
    const defaultColor = getDefaultColorForTheme();
    svgClone.style.color = defaultColor;

    // Apply currentColor transformation (converts all fills/strokes to currentColor)
    applyCurrentColorToSVG(svgClone);

    // Apply CSS constraints to preview SVG for proper display sizing
    svgClone.style.maxWidth = '400px';
    svgClone.style.maxHeight = '400px';
    svgClone.style.width = 'auto';
    svgClone.style.height = 'auto';
    svgClone.style.objectFit = 'contain';

    previewArea.innerHTML = '';
    previewArea.appendChild(svgClone);

  } catch (error) {
    previewArea.innerHTML = `<p style="color: var(--error);">Erro: ${error.message}</p>`;
  }
}

/**
 * Set up Data URI copy buttons
 */
function setupDataURICopyButtons() {
  const copyButtons = document.querySelectorAll('.data-uri-copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const copyType = button.dataset.copy;
      let content = '';

      if (copyType === 'minified') {
        content = document.getElementById('minifiedDataURI')?.textContent || '';
      } else if (copyType === 'base64') {
        content = document.getElementById('base64DataURI')?.textContent || '';
      } else if (copyType === 'encoded') {
        content = document.getElementById('encodedDataURI')?.textContent || '';
      }

      if (content) {
        navigator.clipboard.writeText(content)
          .then(() => showToast('✓ Código copiado!', 'success'))
          .catch(() => showToast('✗ Erro ao copiar', 'error'));
      }
    });
  });
}

/**
 * Set up PNG export functionality
 */
function setupPNGExport() {
  const exportBtn = document.getElementById('exportPNGButton');
  const scaleSelector = document.getElementById('pngSizeSelector');

  // Update preview when scale changes
  if (scaleSelector) {
    scaleSelector.addEventListener('change', () => {
      const svgCode = getEditorContent();
      if (svgCode.trim()) {
        generatePNGPreview(svgCode);
      }
    });
  }

  // Export PNG
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const svgCode = getEditorContent();

      if (!svgCode.trim()) {
        showToast('✗ Nenhum SVG para exportar', 'error');
        return;
      }

      try {
        const scale = scaleSelector ? parseFloat(scaleSelector.value) : 1;
        await exportToPNG(svgCode, scale);
      } catch (error) {
        showToast('✗ Erro ao exportar PNG', 'error');
        console.error('PNG export error:', error);
      }
    });
  }
}

/**
 * Set up PNG checkered background toggle
 */
function setupPNGCheckeredToggle() {
  const checkeredBtn = document.getElementById('pngCheckered');
  const previewArea = document.getElementById('pngPreviewArea');

  if (checkeredBtn && previewArea) {
    checkeredBtn.addEventListener('click', () => {
      const isActive = previewArea.classList.toggle('show-checkered');

      if (isActive) {
        // Apply theme attribute for CSS selectors
        previewArea.setAttribute('data-theme',
          document.documentElement.getAttribute('data-theme') ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        );
      }
    });
  }
}

/**
 * Export SVG to PNG with scale
 */
async function exportToPNG(svgCode, scale = 1) {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      reject(new Error('Invalid SVG'));
      return;
    }

    const img = new Image();
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const baseWidth = img.width || parseFloat(svgElement.getAttribute('width')) || 500;
      const baseHeight = img.height || parseFloat(svgElement.getAttribute('height')) || 500;

      const canvas = document.createElement('canvas');
      canvas.width = baseWidth * scale;
      canvas.height = baseHeight * scale;

      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const link = document.createElement('a');
          link.download = `svg-export-${scale}x.png`;
          link.href = URL.createObjectURL(pngBlob);
          link.click();

          URL.revokeObjectURL(url);
          URL.revokeObjectURL(link.href);

          showToast('✓ PNG exportado!', 'success');
          resolve();
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}

/**
 * Set up settings dropdowns for React/React Native
 */
function setupSettingsDropdowns() {
  // React settings
  const reactSettingsBtn = document.getElementById('reactSettings');
  const reactDropdown = document.getElementById('reactSettingsDropdown');
  const reactTypescript = document.getElementById('reactTypescript');
  const reactSingleQuotes = document.getElementById('reactSingleQuotes');
  const reactStripSemicolons = document.getElementById('reactStripSemicolons');

  // React Native settings
  const reactNativeSettingsBtn = document.getElementById('reactNativeSettings');
  const reactNativeDropdown = document.getElementById('reactNativeSettingsDropdown');
  const reactNativeTypescript = document.getElementById('reactNativeTypescript');
  const reactNativeSingleQuotes = document.getElementById('reactNativeSingleQuotes');
  const reactNativeStripSemicolons = document.getElementById('reactNativeStripSemicolons');

  // Toggle React dropdown
  if (reactSettingsBtn && reactDropdown) {
    reactSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      reactDropdown.classList.toggle('active');
      if (reactNativeDropdown) reactNativeDropdown.classList.remove('active');
    });
  }

  // Toggle React Native dropdown
  if (reactNativeSettingsBtn && reactNativeDropdown) {
    reactNativeSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      reactNativeDropdown.classList.toggle('active');
      if (reactDropdown) reactDropdown.classList.remove('active');
    });
  }

  // React settings change handlers
  if (reactTypescript) {
    reactTypescript.addEventListener('change', () => {
      reactSettings.typescript = reactTypescript.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactCode(svgCode);
    });
  }

  if (reactSingleQuotes) {
    reactSingleQuotes.addEventListener('change', () => {
      reactSettings.singleQuotes = reactSingleQuotes.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactCode(svgCode);
    });
  }

  if (reactStripSemicolons) {
    reactStripSemicolons.addEventListener('change', () => {
      reactSettings.stripSemicolons = reactStripSemicolons.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactCode(svgCode);
    });
  }

  // React Native settings change handlers
  if (reactNativeTypescript) {
    reactNativeTypescript.addEventListener('change', () => {
      reactNativeSettings.typescript = reactNativeTypescript.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactNativeCode(svgCode);
    });
  }

  if (reactNativeSingleQuotes) {
    reactNativeSingleQuotes.addEventListener('change', () => {
      reactNativeSettings.singleQuotes = reactNativeSingleQuotes.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactNativeCode(svgCode);
    });
  }

  if (reactNativeStripSemicolons) {
    reactNativeStripSemicolons.addEventListener('change', () => {
      reactNativeSettings.stripSemicolons = reactNativeStripSemicolons.checked;
      const svgCode = getEditorContent();
      if (svgCode.trim()) generateReactNativeCode(svgCode);
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    if (reactDropdown) reactDropdown.classList.remove('active');
    if (reactNativeDropdown) reactNativeDropdown.classList.remove('active');
  });

  // Prevent dropdown from closing when clicking inside
  if (reactDropdown) {
    reactDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (reactNativeDropdown) {
    reactNativeDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

/**
 * Set up copy and download buttons for React/React Native code
 */
function setupCodeCopyButtons() {
  const reactCopyBtn = document.getElementById('copyReactCode');
  const reactNativeCopyBtn = document.getElementById('copyReactNativeCode');
  const reactDownloadBtn = document.getElementById('downloadReactJSX');
  const reactNativeDownloadBtn = document.getElementById('downloadReactNativeJSX');

  if (reactCopyBtn) {
    reactCopyBtn.addEventListener('click', () => {
      const code = document.querySelector('#reactCodeOutput code')?.textContent;
      if (code) {
        navigator.clipboard.writeText(code)
          .then(() => showToast('✓ Código React copiado!', 'success'))
          .catch(() => showToast('✗ Erro ao copiar', 'error'));
      }
    });
  }

  if (reactNativeCopyBtn) {
    reactNativeCopyBtn.addEventListener('click', () => {
      const code = document.querySelector('#reactNativeCodeOutput code')?.textContent;
      if (code) {
        navigator.clipboard.writeText(code)
          .then(() => showToast('✓ Código React Native copiado!', 'success'))
          .catch(() => showToast('✗ Erro ao copiar', 'error'));
      }
    });
  }

  if (reactDownloadBtn) {
    reactDownloadBtn.addEventListener('click', () => {
      const code = document.querySelector('#reactCodeOutput code')?.textContent;
      if (code) {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SVGComponent.jsx';
        a.click();
        URL.revokeObjectURL(url);
        showToast('✓ JSX baixado!', 'success');
      }
    });
  }

  if (reactNativeDownloadBtn) {
    reactNativeDownloadBtn.addEventListener('click', () => {
      const code = document.querySelector('#reactNativeCodeOutput code')?.textContent;
      if (code) {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SVGComponent.jsx';
        a.click();
        URL.revokeObjectURL(url);
        showToast('✓ JSX baixado!', 'success');
      }
    });
  }
}

/**
 * Get current active tab
 */
export function getCurrentTab() {
  return currentTab;
}

/**
 * Refresh current tab content
 */
export function refreshCurrentTab() {
  if (currentTab !== 'preview') {
    generateTabContent(currentTab);
  }
}
