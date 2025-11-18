/**
 * SVGaze - Editor Transform Manager
 *
 * Handles SVG transformations: rotate, flip, and dimension adjustments
 * Manipulates SVG viewBox and transform attributes
 */

import { getEditorContent, setEditorContent } from './editorCodeManager.js';
import { showToast } from './toast.js';

/**
 * Initialize transform manager
 */
export function initTransformManager() {
  setupEventListeners();
  console.log('✅ Transform manager initialized');
}

/**
 * Setup event listeners for transform buttons
 */
function setupEventListeners() {
  // Rotate button (single - 90° clockwise)
  const rotateBtn = document.getElementById('transformRotate');

  // Flip buttons
  const flipX = document.getElementById('transformFlipX');
  const flipY = document.getElementById('transformFlipY');

  // Crop button and dimension inputs
  const cropBtn = document.getElementById('transformCrop');
  const widthInput = document.getElementById('dimensionWidth');
  const heightInput = document.getElementById('dimensionHeight');

  // Rotate handler
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => rotateSVG90());
  }

  // Flip handlers
  if (flipX) {
    flipX.addEventListener('click', () => flipSVG('horizontal'));
  }
  if (flipY) {
    flipY.addEventListener('click', () => flipSVG('vertical'));
  }

  // Crop/resize handler
  if (cropBtn) {
    cropBtn.addEventListener('click', () => applyDimensions());
  }

  // Dimension input handlers
  if (widthInput) {
    widthInput.addEventListener('change', () => applyDimensions());
    widthInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyDimensions();
    });
  }

  if (heightInput) {
    heightInput.addEventListener('change', () => applyDimensions());
    heightInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyDimensions();
    });
  }

  // Update inputs when SVG code changes
  window.addEventListener('editor-code-changed', updateDimensionInputs);

  // Initial update
  updateDimensionInputs();
}

/**
 * Rotate SVG 90° clockwise using transform matrix (like svgviewer.dev)
 */
function rotateSVG90() {
  try {
    const svgCode = getEditorContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
      showToast('⚠️ Nenhum elemento SVG encontrado', 'warning');
      return;
    }

    // Get current transform matrix if exists
    const currentTransform = svg.getAttribute('transform') || '';

    // Rotation matrices for each step (90° increments)
    const rotationMatrices = [
      'matrix(1,0,0,1,0,0)',                              // 0°
      'matrix(6.123233995736766e-17,1,-1,6.123233995736766e-17,0,0)',  // 90°
      'matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,0,0)', // 180°
      'matrix(-1.8369701987210297e-16,-1,1,-1.8369701987210297e-16,0,0)'  // 270°
    ];

    // Detect current rotation from transform
    let currentRotationIndex = 0;
    for (let i = 0; i < rotationMatrices.length; i++) {
      if (currentTransform.includes(rotationMatrices[i])) {
        currentRotationIndex = i;
        break;
      }
    }

    // Calculate next rotation (90° clockwise)
    const nextRotationIndex = (currentRotationIndex + 1) % 4;

    // If rotation returns to 0° (identity), remove transform attribute
    if (nextRotationIndex === 0) {
      svg.removeAttribute('transform');
    } else {
      // Update transform attribute
      svg.setAttribute('transform', rotationMatrices[nextRotationIndex]);
    }

    // Update editor content
    const serializer = new XMLSerializer();
    const newSvgCode = serializer.serializeToString(svg);
    setEditorContent(newSvgCode);

    const degrees = (nextRotationIndex * 90);
    showToast(`✅ Rotacionado ${degrees}°`, 'success');
  } catch (error) {
    console.error('❌ Error rotating SVG:', error);
    showToast('❌ Erro ao rotacionar SVG', 'error');
  }
}

/**
 * Flip SVG horizontally or vertically
 * @param {string} axis - 'horizontal' or 'vertical'
 */
function flipSVG(axis) {
  try {
    const svgCode = getEditorContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
      showToast('⚠️ Nenhum elemento SVG encontrado', 'warning');
      return;
    }

    // Get viewBox for center calculation
    let viewBox = svg.getAttribute('viewBox');
    if (!viewBox) {
      const width = parseFloat(svg.getAttribute('width')) || 100;
      const height = parseFloat(svg.getAttribute('height')) || 100;
      viewBox = `0 0 ${width} ${height}`;
      svg.setAttribute('viewBox', viewBox);
    }

    const [x, y, width, height] = viewBox.split(' ').map(parseFloat);

    // Check if there's already a flip transform for this axis
    const existingFlipH = `scale(-1, 1) translate(-${width}, 0)`;
    const existingFlipV = `scale(1, -1) translate(0, -${height})`;
    const targetTransform = axis === 'horizontal' ? existingFlipH : existingFlipV;

    // Look for existing flip wrapper
    const existingGroup = Array.from(svg.children).find(child => {
      if (child.tagName === 'g') {
        const transform = child.getAttribute('transform');
        return transform === targetTransform;
      }
      return false;
    });

    if (existingGroup) {
      // Double flip detected - unwrap the group (return to identity)
      while (existingGroup.firstChild) {
        svg.insertBefore(existingGroup.firstChild, existingGroup);
      }
      svg.removeChild(existingGroup);
    } else {
      // Create wrapper group with flip transform
      const g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');

      if (axis === 'horizontal') {
        g.setAttribute('transform', `scale(-1, 1) translate(-${width}, 0)`);
      } else {
        g.setAttribute('transform', `scale(1, -1) translate(0, -${height})`);
      }

      // Move all children to the group
      while (svg.firstChild) {
        g.appendChild(svg.firstChild);
      }

      svg.appendChild(g);
    }

    // Update editor content
    const serializer = new XMLSerializer();
    const newSvgCode = serializer.serializeToString(svg);
    setEditorContent(newSvgCode);

    const axisName = axis === 'horizontal' ? 'horizontal' : 'vertical';
    showToast(`✅ Espelhado ${axisName}mente`, 'success');
  } catch (error) {
    console.error('❌ Error flipping SVG:', error);
    showToast('❌ Erro ao espelhar SVG', 'error');
  }
}

/**
 * Apply dimensions from input fields to SVG
 */
function applyDimensions() {
  try {
    const widthInput = document.getElementById('dimensionWidth');
    const heightInput = document.getElementById('dimensionHeight');

    if (!widthInput || !heightInput) return;

    const newWidth = parseInt(widthInput.value) || 400;
    const newHeight = parseInt(heightInput.value) || 400;

    const svgCode = getEditorContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
      showToast('⚠️ Nenhum elemento SVG encontrado', 'warning');
      return;
    }

    // Update width and height attributes
    svg.setAttribute('width', newWidth.toString());
    svg.setAttribute('height', newHeight.toString());

    // Update editor content
    const serializer = new XMLSerializer();
    const newSvgCode = serializer.serializeToString(svg);
    setEditorContent(newSvgCode);

    showToast(`✅ Dimensões: ${newWidth}×${newHeight}`, 'success');
  } catch (error) {
    console.error('❌ Error applying dimensions:', error);
    showToast('❌ Erro ao aplicar dimensões', 'error');
  }
}

/**
 * Update dimension inputs from current SVG
 */
function updateDimensionInputs() {
  try {
    const widthInput = document.getElementById('dimensionWidth');
    const heightInput = document.getElementById('dimensionHeight');

    if (!widthInput || !heightInput) return;

    const svgCode = getEditorContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) return;

    let width = svg.getAttribute('width');
    let height = svg.getAttribute('height');

    // If no width/height, try to get from viewBox
    if (!width || !height) {
      const viewBox = svg.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length === 4) {
          width = width || parts[2];
          height = height || parts[3];
        }
      }
    }

    // Default to 400 if still no dimensions
    widthInput.value = parseInt(width) || 400;
    heightInput.value = parseInt(height) || 400;
  } catch (error) {
    // Silent fail - not critical
  }
}

/**
 * Reset all transformations
 */
export function resetTransformations() {
  try {
    const svgCode = getEditorContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
      showToast('⚠️ Nenhum elemento SVG encontrado', 'warning');
      return;
    }

    // Remove transform attribute
    svg.removeAttribute('transform');

    // Remove wrapper groups created by flip
    const groups = svg.querySelectorAll('g[transform]');
    groups.forEach(g => {
      const parent = g.parentNode;
      while (g.firstChild) {
        parent.insertBefore(g.firstChild, g);
      }
      parent.removeChild(g);
    });

    // Update editor content
    const serializer = new XMLSerializer();
    const newSvgCode = serializer.serializeToString(svg);
    setEditorContent(newSvgCode);

    showToast('✅ Transformações resetadas', 'success');
  } catch (error) {
    console.error('❌ Error resetting transformations:', error);
    showToast('❌ Erro ao resetar transformações', 'error');
  }
}

export default {
  initTransformManager,
  rotateSVG90,
  flipSVG,
  applyDimensions,
  updateDimensionInputs,
  resetTransformations
};
