/**
 * SVGaze - Editor SVGO Manager
 *
 * Advanced SVG optimization using SVGO library with configurable plugins
 * Provides a modal UI for customizing optimization settings
 */

import { getEditorContent, setEditorContent } from './editorCodeManager.js';
import { showToast } from './toast.js';
import { appState } from '../state.js';
import { t } from '../../i18n/i18n.js';

// Flag to track if we just optimized (prevents reset during optimization)
let hasJustOptimized = false;

// SVGO configuration state
let svgoConfig = {
  plugins: [
    { name: 'removeDoctype', enabled: true },
    { name: 'removeXMLProcInst', enabled: true },
    { name: 'removeComments', enabled: true },
    { name: 'removeMetadata', enabled: true },
    { name: 'removeEditorsNSData', enabled: true },
    { name: 'cleanupAttrs', enabled: true },
    { name: 'mergeStyles', enabled: true },
    { name: 'inlineStyles', enabled: true },
    { name: 'minifyStyles', enabled: true },
    { name: 'cleanupIds', enabled: true },
    { name: 'removeUselessDefs', enabled: true },
    { name: 'cleanupNumericValues', enabled: true },
    { name: 'convertColors', enabled: true },
    { name: 'removeUnknownsAndDefaults', enabled: true },
    { name: 'removeNonInheritableGroupAttrs', enabled: true },
    { name: 'removeUselessStrokeAndFill', enabled: true },
    { name: 'removeViewBox', enabled: false }, // Keep viewBox
    { name: 'cleanupEnableBackground', enabled: true },
    { name: 'removeHiddenElems', enabled: true },
    { name: 'removeEmptyText', enabled: true },
    { name: 'convertShapeToPath', enabled: false }, // Preserve shapes
    { name: 'convertEllipseToCircle', enabled: true },
    { name: 'moveElemsAttrsToGroup', enabled: true },
    { name: 'moveGroupAttrsToElems', enabled: true },
    { name: 'collapseGroups', enabled: true },
    { name: 'convertPathData', enabled: true }, // Enabled - converts bezier circles to compact arcs
    { name: 'convertTransform', enabled: true },
    { name: 'removeEmptyAttrs', enabled: true },
    { name: 'removeEmptyContainers', enabled: true },
    { name: 'mergePaths', enabled: true },
    { name: 'removeUnusedNS', enabled: true },
    { name: 'sortAttrs', enabled: false },
    { name: 'sortDefsChildren', enabled: true },
    { name: 'removeTitle', enabled: false }, // Keep for accessibility
    { name: 'removeDesc', enabled: false } // Keep for accessibility
  ]
};

// Load config from localStorage
function loadConfig() {
  const saved = localStorage.getItem('svgoConfig');
  if (saved) {
    try {
      svgoConfig = JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load SVGO config from localStorage');
    }
  }
}

// Save config to localStorage
function saveConfig() {
  localStorage.setItem('svgoConfig', JSON.stringify(svgoConfig));
}

/**
 * Initialize SVGO manager
 */
export function initSvgoManager() {
  loadConfig();
  setupOptimizeButton();
  updateOptimizePreview(); // Initial calculation

  // Listen for code changes to update preview
  window.addEventListener('editor-code-changed', () => {
    resetOptimizeButton();
  });

  // Modal will be created on first use (lazy initialization)
  console.log('✅ SVGO manager initialized');
}

/**
 * Setup optimize button to optimize directly
 */
function setupOptimizeButton() {
  const optimizeBtn = document.getElementById('editorOptimize');
  if (optimizeBtn) {
    // Add event listener directly (don't clone to preserve HTML structure)
    optimizeBtn.addEventListener('click', async () => {
      // Only optimize if not already optimized
      if (!optimizeBtn.classList.contains('optimized')) {
        await optimizeSVG();
      }
    });
  }
}

/**
 * Create SVGO configuration modal
 */
function createSvgoModal() {
  // Check if modal already exists
  if (document.getElementById('svgoModal')) return;

  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'svgoModal';
  modalBackdrop.className = 'modal-backdrop';
  modalBackdrop.setAttribute('role', 'dialog');
  modalBackdrop.setAttribute('aria-modal', 'true');
  modalBackdrop.setAttribute('aria-hidden', 'true');

  modalBackdrop.innerHTML = `
    <div class="modal svgo-modal-content">
      <div class="modal-header">
        <h2>Configurações de Otimização SVGO</h2>
        <button class="modal-close" aria-label="Fechar">&times;</button>
      </div>
      <div class="modal-body svgo-modal-body">
        <p style="margin: 0 0 16px 0; color: var(--text-secondary); font-size: 14px;">
          Selecione quais otimizações deseja aplicar ao SVG:
        </p>
        <div class="svgo-plugins-grid">
          ${generatePluginsCheckboxes()}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn secondary" id="svgoResetDefaults">Restaurar Padrões</button>
        <div style="flex: 1"></div>
        <button class="btn ghost" id="svgoCancelBtn">Cancelar</button>
        <button class="btn primary" id="svgoOptimizeBtn">Otimizar SVG</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  // Setup event listeners
  setupModalEventListeners(modalBackdrop);
}

/**
 * Generate checkboxes for all plugins
 */
function generatePluginsCheckboxes() {
  return svgoConfig.plugins.map((plugin, index) => {
    const label = formatPluginName(plugin.name);
    const checked = plugin.enabled ? 'checked' : '';

    return `
      <label class="svgo-plugin-item">
        <input type="checkbox"
               data-plugin-index="${index}"
               ${checked}>
        <span>${label}</span>
      </label>
    `;
  }).join('');
}

/**
 * Format plugin name for display
 */
function formatPluginName(name) {
  // Convert camelCase to readable format
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Setup modal event listeners
 */
function setupModalEventListeners(modal) {
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('#svgoCancelBtn');
  const optimizeBtn = modal.querySelector('#svgoOptimizeBtn');
  const resetBtn = modal.querySelector('#svgoResetDefaults');

  // Close modal
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
  };

  // Close on backdrop click (click outside modal content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Handle checkbox changes
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.pluginIndex);
      svgoConfig.plugins[index].enabled = e.target.checked;
      saveConfig();
    });
  });

  // Reset to defaults
  resetBtn.addEventListener('click', () => {
    if (confirm('Restaurar configurações padrão de otimização?')) {
      resetToDefaults();
      // Refresh checkboxes
      const pluginsGrid = modal.querySelector('.svgo-plugins-grid');
      pluginsGrid.innerHTML = generatePluginsCheckboxes();
      // Re-attach checkbox listeners
      setupCheckboxListeners(modal);
      showToast('✅ Configurações restauradas', 'success');
    }
  });

  // Optimize SVG
  optimizeBtn.addEventListener('click', async () => {
    closeModal();
    await optimizeSVG();
  });
}

/**
 * Setup checkbox listeners (helper for dynamic content)
 */
function setupCheckboxListeners(modal) {
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.pluginIndex);
      svgoConfig.plugins[index].enabled = e.target.checked;
      saveConfig();
    });
  });
}

/**
 * Reset configuration to defaults
 */
function resetToDefaults() {
  svgoConfig.plugins.forEach(plugin => {
    // Default enabled plugins
    const defaultEnabled = [
      'removeDoctype', 'removeXMLProcInst', 'removeComments', 'removeMetadata',
      'removeEditorsNSData', 'cleanupAttrs', 'mergeStyles', 'inlineStyles',
      'minifyStyles', 'cleanupIds', 'removeUselessDefs', 'cleanupNumericValues',
      'convertColors', 'removeUnknownsAndDefaults', 'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill', 'cleanupEnableBackground', 'removeHiddenElems',
      'removeEmptyText', 'convertEllipseToCircle', 'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems', 'collapseGroups', 'convertPathData', 'convertTransform',
      'removeEmptyAttrs', 'removeEmptyContainers', 'mergePaths', 'removeUnusedNS',
      'sortDefsChildren'
    ];

    plugin.enabled = defaultEnabled.includes(plugin.name);
  });
  saveConfig();
}

/**
 * Show SVGO modal
 */
export function showSvgoModal() {
  let modal = document.getElementById('svgoModal');

  // Create modal if it doesn't exist yet (lazy initialization)
  if (!modal) {
    createSvgoModal();
    modal = document.getElementById('svgoModal');
  }

  if (modal) {
    // Refresh checkboxes to reflect current config
    const pluginsGrid = modal.querySelector('.svgo-plugins-grid');
    pluginsGrid.innerHTML = generatePluginsCheckboxes();
    setupCheckboxListeners(modal);

    modal.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Optimize SVG using configured plugins
 */
async function optimizeSVG() {
  try {
    const svgCode = getEditorContent();

    if (!svgCode || !svgCode.trim()) {
      showToast('⚠️ Nenhum código SVG para otimizar', 'warning');
      return;
    }

    const originalSize = new Blob([svgCode]).size;

    // Use advanced optimization with configured plugins
    const optimized = advancedOptimize(svgCode);
    const newSize = new Blob([optimized]).size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

    // Set flag to prevent reset during optimization
    hasJustOptimized = true;

    setEditorContent(optimized);

    // Update button to "Optimized" state
    updateOptimizeButtonToOptimized();

    // Clear flag after event processing is complete (500ms is safe buffer)
    setTimeout(() => {
      hasJustOptimized = false;
    }, 500);

    showToast(
      `✅ Otimizado: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (-${reduction}%)`,
      'success'
    );
  } catch (error) {
    hasJustOptimized = false; // Clear flag on error
    console.error('❌ Optimization error:', error);
    showToast('❌ Erro ao otimizar SVG', 'error');
  }
}

/**
 * Update optimize button to "Optimized" state
 */
function updateOptimizeButtonToOptimized() {
  const optimizeBtn = document.getElementById('editorOptimize');
  const optimizeIcon = document.getElementById('optimizeIcon');
  const optimizeLabel = optimizeBtn?.querySelector('.optimize-label');
  const optimizeSizes = document.getElementById('optimizeSizes');

  if (optimizeBtn && optimizeIcon && optimizeLabel) {
    // Add optimized class
    optimizeBtn.classList.add('optimized');
    optimizeBtn.title = 'SVG Otimizado';

    // Show checkmark icon
    optimizeIcon.style.display = 'block';

    // Change label
    optimizeLabel.textContent = 'Otimizado';

    // Hide sizes
    if (optimizeSizes) {
      optimizeSizes.style.display = 'none';
    }

    // Remove click listener
    optimizeBtn.style.pointerEvents = 'none';
  }
}

/**
 * Reset optimize button to initial state (call when content changes)
 */
export function resetOptimizeButton() {
  // Don't reset if we just optimized (prevents reset during optimization)
  if (hasJustOptimized) {
    return;
  }

  const optimizeBtn = document.getElementById('editorOptimize');
  const optimizeIcon = document.getElementById('optimizeIcon');
  const optimizeLabel = optimizeBtn?.querySelector('.optimize-label');
  const optimizeSizes = document.getElementById('optimizeSizes');

  if (optimizeBtn && optimizeIcon && optimizeLabel) {
    // Remove optimized class
    optimizeBtn.classList.remove('optimized');
    optimizeBtn.title = 'Otimizar SVG';

    // Hide checkmark icon
    optimizeIcon.style.display = 'none';

    // Reset label (use i18n system)
    optimizeLabel.textContent = t('editor.optimize');

    // Show sizes
    if (optimizeSizes) {
      optimizeSizes.style.display = 'inline-flex';
    }

    // Re-enable click
    optimizeBtn.style.pointerEvents = 'auto';

    // Update preview with new content
    updateOptimizePreview();
  }
}

/**
 * Update optimization preview (calculate current size vs optimized size)
 */
export function updateOptimizePreview() {
  const svgCode = getEditorContent();

  if (!svgCode || !svgCode.trim()) {
    return;
  }

  try {
    const originalSize = new Blob([svgCode]).size;
    const optimized = advancedOptimize(svgCode);
    const newSize = new Blob([optimized]).size;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(0);

    // Update UI
    const originalSizeEl = document.getElementById('optimizeOriginalSize');
    const newSizeEl = document.getElementById('optimizeNewSize');
    const percentEl = document.querySelector('.optimize-percent');

    if (originalSizeEl) {
      originalSizeEl.textContent = formatBytes(originalSize);
    }

    if (newSizeEl) {
      newSizeEl.textContent = formatBytes(newSize);
    }

    if (percentEl) {
      percentEl.textContent = `-${reduction}%`;
    }
  } catch (error) {
    console.error('Error calculating optimization preview:', error);
  }
}

/**
 * Advanced optimization using configured plugins
 * Now uses real SVGO library for professional-grade optimization
 */
function advancedOptimize(svgCode) {
  // Check if SVGO library is loaded
  if (typeof window.svgo !== 'undefined' && window.svgo.optimize) {
    try {
      // Use real SVGO library for professional optimization
      const result = window.svgo.optimize(svgCode, {
        plugins: [
          'preset-default', // Use SVGO's default preset
          {
            name: 'convertPathData',
            params: {
              floatPrecision: 3,
              transformPrecision: 5,
              makeArcs: {
                threshold: 2.5, // Lower = more aggressive arc conversion
                tolerance: 0.5
              }
            }
          },
          {
            name: 'cleanupNumericValues',
            params: {
              floatPrecision: 3
            }
          },
          {
            name: 'convertColors',
            params: {
              names2hex: true,
              rgb2hex: true,
              shorthex: true
            }
          },
          'removeDoctype',
          'removeComments',
          'removeMetadata',
          'removeEditorsNSData',
          'cleanupAttrs',
          'mergeStyles',
          'inlineStyles',
          'minifyStyles',
          'cleanupIds',
          'removeUselessDefs',
          'removeUnknownsAndDefaults',
          'removeNonInheritableGroupAttrs',
          'removeUselessStrokeAndFill',
          'cleanupEnableBackground',
          'removeHiddenElems',
          'removeEmptyText',
          'convertEllipseToCircle',
          'moveElemsAttrsToGroup',
          'moveGroupAttrsToElems',
          'collapseGroups',
          'convertTransform',
          'removeEmptyAttrs',
          'removeEmptyContainers',
          'mergePaths',
          'removeUnusedNS',
          'sortDefsChildren'
        ]
      });

      return result.data;
    } catch (error) {
      console.error('❌ SVGO optimization failed, falling back to basic:', error);
      // Fall back to basic optimization if SVGO fails
    }
  }

  // Fallback: basic optimization (original code)
  let optimized = svgCode;
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgCode, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) return svgCode;

  // Apply optimizations based on enabled plugins
  const plugins = svgoConfig.plugins;

  // removeDoctype
  if (isEnabled('removeDoctype')) {
    optimized = optimized.replace(/<!DOCTYPE[^>]*>/gi, '');
  }

  // removeXMLProcInst
  if (isEnabled('removeXMLProcInst')) {
    optimized = optimized.replace(/<\?xml[^?]*\?>/gi, '');
  }

  // removeComments
  if (isEnabled('removeComments')) {
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
  }

  // removeMetadata
  if (isEnabled('removeMetadata')) {
    svg.querySelectorAll('metadata').forEach(el => el.remove());
  }

  // removeTitle
  if (isEnabled('removeTitle')) {
    svg.querySelectorAll('title').forEach(el => el.remove());
  }

  // removeDesc
  if (isEnabled('removeDesc')) {
    svg.querySelectorAll('desc').forEach(el => el.remove());
  }

  // removeHiddenElems
  if (isEnabled('removeHiddenElems')) {
    svg.querySelectorAll('[display="none"], [visibility="hidden"]').forEach(el => el.remove());
  }

  // removeEmptyText
  if (isEnabled('removeEmptyText')) {
    svg.querySelectorAll('text').forEach(el => {
      if (!el.textContent.trim()) el.remove();
    });
  }

  // removeEmptyContainers
  if (isEnabled('removeEmptyContainers')) {
    svg.querySelectorAll('g, defs').forEach(el => {
      if (el.children.length === 0) el.remove();
    });
  }

  // cleanupAttrs - remove default values
  if (isEnabled('cleanupAttrs')) {
    svg.querySelectorAll('*').forEach(el => {
      // Remove fill only if it's truly redundant (checks inheritance)
      const childFill = el.getAttribute('fill');
      const parentFill = el.parentElement?.getAttribute('fill');

      if (childFill === 'black') {
        // Only remove if parent also has 'black' or no fill (making it redundant)
        // Don't remove if parent has 'none' or other values
        if (!parentFill || parentFill === 'black') {
          el.removeAttribute('fill');
        }
        // Otherwise keep it - child needs explicit fill to override parent
      }

      // Remove stroke only if it's truly redundant (checks inheritance)
      const childStroke = el.getAttribute('stroke');
      const parentStroke = el.parentElement?.getAttribute('stroke');

      if (childStroke === 'none') {
        // Only remove if parent also has 'none' or no stroke (making it redundant)
        if (!parentStroke || parentStroke === 'none') {
          el.removeAttribute('stroke');
        }
        // Otherwise keep it - child needs explicit stroke to override parent
      }

      // Clean up whitespace in attributes
      Array.from(el.attributes).forEach(attr => {
        el.setAttribute(attr.name, attr.value.trim());
      });
    });
  }

  // cleanupNumericValues
  if (isEnabled('cleanupNumericValues')) {
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(svg);
    // Smart rounding: use 3 decimals for better quality
    // Only round numbers with 4+ decimals to save space
    svgStr = svgStr.replace(/(\d+\.\d{4,})/g, (match) => {
      return parseFloat(match).toFixed(3);
    });
    optimized = svgStr;
  } else {
    const serializer = new XMLSerializer();
    optimized = serializer.serializeToString(svg);
  }

  // Remove excessive whitespace
  optimized = optimized.replace(/\s+/g, ' ');
  optimized = optimized.replace(/>\s+</g, '><');

  // convertColors - convert rgb() to hex and shorten color names
  if (isEnabled('convertColors')) {
    // Convert rgb() to hex
    optimized = optimized.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (match, r, g, b) => {
      return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    });

    // Convert named colors to shorter hex equivalents
    optimized = optimized.replace(/fill="black"/g, 'fill="#000"');
    optimized = optimized.replace(/stroke="black"/g, 'stroke="#000"');
    optimized = optimized.replace(/fill="white"/g, 'fill="#fff"');
    optimized = optimized.replace(/stroke="white"/g, 'stroke="#fff"');
  }

  // Advanced path optimization: Convert bezier curves to arcs when possible
  if (isEnabled('convertPathData')) {
    optimized = convertBezierToArc(optimized);
    optimized = convertToRelativeCommands(optimized);
    optimized = convertRoundedRectToArc(optimized);
  }

  return optimized.trim();
}

/**
 * Convert cubic bezier curves to arc commands when they form circles/ellipses
 * This is the key optimization that SVG Viewer uses to achieve smaller files
 * Example: M16 8C16 12.418... → M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0
 */
function convertBezierToArc(svgStr) {
  // Match path elements with bezier curves
  return svgStr.replace(/d="([^"]+)"/g, (match, pathData) => {
    // Detect 4-curve circle pattern: M x y C...C...C...C...Z
    // Example: M16 8C16 12.418 12.418 16 8 16C3.582 16 0 12.418 0 8C0 3.582 3.582 0 8 0C12.418 0 16 3.582 16 8Z
    const fourCurvePattern = /^M\s*([\d.]+)\s+([\d.]+)\s*C([^Z]+)Z?$/i;
    const match4 = pathData.match(fourCurvePattern);

    if (match4) {
      const startX = parseFloat(match4[1]);
      const startY = parseFloat(match4[2]);

      // Split into individual C commands
      const curves = match4[3].trim().split('C').filter(c => c.trim());

      if (curves.length >= 3) { // At least 3 more curves after the first
        // Parse all coordinates
        const allCoords = match4[3].trim().replace(/C/g, ' ').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

        if (allCoords.length === 24) { // 4 curves × 6 coordinates
          // Extract key points to determine if it's a circle
          // First curve ends at: allCoords[4], allCoords[5]
          // Third curve ends at: allCoords[16], allCoords[17]
          const x1 = allCoords[4], y1 = allCoords[5];
          const x2 = allCoords[10], y2 = allCoords[11];
          const x3 = allCoords[16], y3 = allCoords[17];
          const x4 = allCoords[22], y4 = allCoords[23];

          // Calculate center: should be average of diagonal points
          const centerX = (startX + x2) / 2;
          const centerY = (startY + y2) / 2;

          // Calculate radius from center to start point
          const radius = Math.sqrt(Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2));

          // Verify all 4 points are equidistant from center (tolerance: 0.5px)
          const r1 = Math.sqrt(Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2));
          const r2 = Math.sqrt(Math.pow(x1 - centerX, 2) + Math.pow(y1 - centerY, 2));
          const r3 = Math.sqrt(Math.pow(x2 - centerX, 2) + Math.pow(y2 - centerY, 2));
          const r4 = Math.sqrt(Math.pow(x3 - centerX, 2) + Math.pow(y3 - centerY, 2));

          if (Math.abs(r1 - r2) < 0.5 && Math.abs(r2 - r3) < 0.5 && Math.abs(r3 - r4) < 0.5) {
            // It's a circle! Convert to compact arc notation
            // Use 2 arc commands (semicircles) for best compatibility
            const r = Math.round(radius * 1000) / 1000; // Keep 3 decimals
            const arcPath = `M${startX} ${startY}A${r} ${r} 0 1 1 ${x2} ${y2}a${r} ${r} 0 0 1 ${startX - x2} ${startY - y2}`;
            return `d="${arcPath}"`;
          }
        }
      }
    }

    // No conversion possible, return original
    return match;
  });
}

/**
 * Convert absolute commands to relative when it saves space
 * Example: V10.441 → v5.441 (when current Y is 5)
 */
function convertToRelativeCommands(svgStr) {
  return svgStr.replace(/d="([^"]+)"/g, (match, pathData) => {
    let optimized = pathData;
    let currentX = 0, currentY = 0;

    // Convert absolute V (vertical line) to relative v when shorter
    optimized = optimized.replace(/([A-Z])?([\d.-]+)\s+([A-Z])?([\d.-]+)/g, (m, cmd1, n1, cmd2, n2) => {
      // Simple heuristic: if number > 10, relative might be shorter
      if (cmd2 === 'V' && parseFloat(n2) > 10) {
        const relY = parseFloat(n2) - currentY;
        if (Math.abs(relY) < parseFloat(n2) && relY.toString().length < n2.length) {
          return `${cmd1 || ''}${n1} v${relY}`;
        }
      }
      if (cmd2 === 'H' && parseFloat(n2) > 10) {
        const relX = parseFloat(n2) - currentX;
        if (Math.abs(relX) < parseFloat(n2) && relX.toString().length < n2.length) {
          return `${cmd1 || ''}${n1} h${relX}`;
        }
      }
      return m;
    });

    return `d="${optimized}"`;
  });
}

/**
 * Convert rounded rectangle bezier curves to arc notation
 * Example: C0.895 0 0 0.895 0 2 → a2 2 0 0 0-2 2
 */
function convertRoundedRectToArc(svgStr) {
  return svgStr.replace(/d="([^"]+)"/g, (match, pathData) => {
    // Detect rounded rectangle pattern for corners
    // C0.895 0 0 0.895 0 2 is a quarter circle arc that can be: a2 2 0 0 0-2 2
    let optimized = pathData;

    // Pattern for rounded corners: C x1 y1 x2 y2 x y where it forms a 90-degree arc
    optimized = optimized.replace(/C([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)/g,
      (m, cx1, cy1, cx2, cy2, x, y) => {
        const x1 = parseFloat(cx1), y1 = parseFloat(cy1);
        const x2 = parseFloat(cx2), y2 = parseFloat(cy2);
        const endX = parseFloat(x), endY = parseFloat(y);

        // Check if this is a rounded corner (quarter circle)
        // Typical pattern: one control point on axis, other at 45°
        if ((x1 === 0 || y1 === 0) && Math.abs(endX) === Math.abs(endY)) {
          const radius = Math.abs(endX);
          // Convert to arc: a r r 0 0 direction dx dy
          return `a${radius} ${radius} 0 0 0 ${endX} ${endY}`;
        }

        return m;
      });

    return `d="${optimized}"`;
  });
}

/**
 * Check if plugin is enabled
 */
function isEnabled(pluginName) {
  const plugin = svgoConfig.plugins.find(p => p.name === pluginName);
  return plugin ? plugin.enabled : false;
}

/**
 * Basic optimization fallback
 */
function basicOptimize(svgCode) {
  let optimized = svgCode;

  // Remove XML declaration
  optimized = optimized.replace(/<\?xml[^?]*\?>/g, '');

  // Remove DOCTYPE
  optimized = optimized.replace(/<!DOCTYPE[^>]*>/g, '');

  // Remove comments
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

  // Remove excessive whitespace
  optimized = optimized.replace(/\s+/g, ' ');
  optimized = optimized.replace(/>\s+</g, '><');

  // Round numbers to 2 decimals
  optimized = optimized.replace(/(\d+\.\d{3,})/g, (match) => {
    return parseFloat(match).toFixed(2);
  });

  return optimized.trim();
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
}

export default {
  initSvgoManager,
  optimizeSVG,
  showSvgoModal
};
