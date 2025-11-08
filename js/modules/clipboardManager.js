/**
 * SVGaze - Clipboard Manager
 * Copy to clipboard and download SVG files
 */

import { getSVGText } from './svgProcessor.js';
import { createBlobURL, revokeBlobURL, wait } from './utils.js';

export async function copyToClipboard(text, button = null) {
  try {
    await navigator.clipboard.writeText(text);

    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copiado!';
      button.disabled = true;

      await wait(1400);

      button.textContent = originalText;
      button.disabled = false;
    }

    return true;
  } catch (error) {
    alert('Não foi possível copiar: ' + (error.message || error));
    return false;
  }
}

export function downloadSVG(svgText, filename) {
  const url = createBlobURL(svgText, 'image/svg+xml');

  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/\s+/g, '_') || 'icon.svg';
  a.click();

  setTimeout(() => revokeBlobURL(url), 1000);
}

export async function copySVGCode(item, button) {
  const svgText = getSVGText(item);
  return await copyToClipboard(svgText, button);
}

export async function copyFileName(item, button) {
  return await copyToClipboard(item.fileName, button);
}

export async function copyFilePath(item, button) {
  // Include filename in the path (e.g., "Outline › Brands › Comment.svg")
  const pathWithFile = item.fullPath
    ? `${item.fullPath} › ${item.fileName}`
    : item.originalPath;
  return await copyToClipboard(pathWithFile, button);
}

export default {
  copyToClipboard,
  downloadSVG,
  copySVGCode,
  copyFileName,
  copyFilePath
};
