/**
 * SVGaze - Color Manager
 * Apply colors to SVG elements
 */

import { appState } from '../state.js';

/**
 * Get default color based on current theme
 * @returns {string} Hex color code
 */
export function getDefaultColorForTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                 (!document.documentElement.getAttribute('data-theme') &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches);

  return isDark ? '#ffffff' : '#000000';
}

export function applyColor(color = null) {
  const selectedColor = color || appState.ui.selectedColor;
  appState.ui.selectedColor = selectedColor;

  // Update all SVGs in gallery
  document.querySelectorAll('.svg-wrap svg').forEach(svg => {
    svg.style.color = selectedColor;
  });

  // Update modal SVG if open
  const modalSvg = document.querySelector('#modalContent svg');
  if (modalSvg) {
    modalSvg.style.color = selectedColor;
  }
}

export function setColor(color) {
  appState.ui.selectedColor = color;
}

export function getColor() {
  return appState.ui.selectedColor;
}

export default { applyColor, setColor, getColor, getDefaultColorForTheme };
