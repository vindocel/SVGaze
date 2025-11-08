/**
 * SVGaze - File Handler
 *
 * Handles file selection, reading, and processing.
 * Uses intelligent categorization system.
 */

import { appState } from '../state.js';
import { readFileAsText, logError } from './utils.js';
import { parseFilePath, detectStyleFromSVG } from './categoryManager.js';
import { parseAndSanitizeSVG } from './svgProcessor.js';

/**
 * Handle files selected from directory input
 *
 * @param {Event} event - Change event from file input
 * @returns {Promise<Array>} Promise resolving to array of processed items
 */
export async function handleFilesSelection(event) {
  const files = Array.from(event.target.files || []);

  if (files.length === 0) {
    return [];
  }

  // Filter only SVG files
  const svgFiles = files.filter(file =>
    file.type === 'image/svg+xml' ||
    file.name.toLowerCase().endsWith('.svg')
  );

  if (svgFiles.length === 0) {
    throw new Error('Nenhum arquivo .svg encontrado na pasta selecionada.');
  }

  console.log(`Processing ${svgFiles.length} SVG files...`);

  // Process all files in parallel
  const readPromises = svgFiles.map(file => processFile(file));

  try {
    const items = await Promise.all(readPromises);

    // Filter out null items (failed to process)
    const validItems = items.filter(item => item !== null);

    // Sort items by category, style, subcategory, then filename
    validItems.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      if (a.style !== b.style) return a.style.localeCompare(b.style);
      if (a.subcategory !== b.subcategory) return a.subcategory.localeCompare(b.subcategory);
      return a.fileName.localeCompare(b.fileName);
    });

    console.log(`Successfully processed ${validItems.length} SVG files`);

    // Log categorization stats for debugging
    const stats = getCategoryStats(validItems);
    console.log('Categorization Stats:', stats);

    return validItems;
  } catch (error) {
    logError('File Processing', error);
    throw new Error('Erro ao processar arquivos SVG. Veja o console para detalhes.');
  }
}

/**
 * Process a single file
 *
 * @param {File} file - File object
 * @returns {Promise<Object|null>} Processed item object or null if failed
 */
async function processFile(file) {
  try {
    // Read file content
    const text = await readFileAsText(file);

    // Get path information
    const path = file.webkitRelativePath || file.name;
    const pathParts = path.split('/');
    const fileName = pathParts[pathParts.length - 1];

    // Parse path using intelligent categorization
    const pathInfo = parseFilePath(path, fileName);

    // Parse and sanitize SVG
    const svgParsed = parseAndSanitizeSVG(text);

    if (!svgParsed) {
      console.warn(`Failed to parse SVG: ${fileName}`);
      return null;
    }

    // Detect style from SVG content if not determined from path
    const detectedStyle = detectStyleFromSVG(svgParsed);
    const finalStyle = pathInfo.style || detectedStyle;

    // Create item object
    return {
      category: pathInfo.category,
      style: finalStyle,
      subcategory: pathInfo.subcategory,
      fullPath: pathInfo.fullPath,
      fileName,
      svgText: text,
      svgElement: svgParsed,
      originalPath: path,
      fileSize: file.size,
      _debug: pathInfo._debug
    };
  } catch (error) {
    logError('Single File Processing', error, { fileName: file.name });
    return null;
  }
}

/**
 * Get category statistics
 *
 * @param {Array} items - Array of items
 * @returns {Object} Statistics object
 */
function getCategoryStats(items) {
  const stats = {
    totalItems: items.length,
    totalCategories: 0,
    totalStyles: 0,
    categories: {},
    styles: new Set()
  };

  items.forEach(item => {
    const { category, style } = item;

    // Count categories
    if (!stats.categories[category]) {
      stats.categories[category] = {
        count: 0,
        styles: new Set()
      };
      stats.totalCategories++;
    }

    stats.categories[category].count++;

    // Count styles
    if (style) {
      stats.styles.add(style);
      stats.categories[category].styles.add(style);
    }
  });

  stats.totalStyles = stats.styles.size;

  // Convert Sets to Arrays
  Object.keys(stats.categories).forEach(cat => {
    stats.categories[cat].styles = Array.from(stats.categories[cat].styles);
  });

  return stats;
}

/**
 * Initialize file handler (attach event listeners)
 *
 * @param {HTMLInputElement} fileInput - File input element
 * @param {Function} onSuccess - Callback when files are loaded
 * @param {Function} onError - Callback when error occurs
 */
export function initFileHandler(fileInput, onSuccess, onError) {
  if (!fileInput) {
    logError('File Handler Init', new Error('File input element not found'));
    return;
  }

  fileInput.addEventListener('change', async (event) => {
    try {
      const items = await handleFilesSelection(event);

      // Update state
      appState.allItems = items;

      // Call success callback
      if (onSuccess) {
        onSuccess(items);
      }
    } catch (error) {
      logError('File Handler', error);

      // Call error callback
      if (onError) {
        onError(error);
      }
    }
  });
}

export default {
  handleFilesSelection,
  initFileHandler
};
