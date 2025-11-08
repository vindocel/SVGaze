/**
 * SVGaze - Size Manager
 * Control SVG display sizes
 */

import { appState } from '../state.js';
import { clamp } from './utils.js';

export function applySize(size = null) {
  const selectedSize = size !== null ? clamp(size, 24, 180) : appState.ui.selectedSize;
  appState.ui.selectedSize = selectedSize;

  // Update all SVG wrappers
  document.querySelectorAll('.svg-wrap').forEach(wrapper => {
    wrapper.style.maxWidth = `${selectedSize}px`;
    wrapper.style.maxHeight = `${selectedSize}px`;
  });

  // Update SVGs inside wrappers
  document.querySelectorAll('.svg-wrap svg').forEach(svg => {
    svg.style.width = `${selectedSize}px`;
    svg.style.height = `${selectedSize}px`;
  });
}

export function setSize(size) {
  appState.ui.selectedSize = clamp(size, 24, 180);
}

export function getSize() {
  return appState.ui.selectedSize;
}

export default { applySize, setSize, getSize };
