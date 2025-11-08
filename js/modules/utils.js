/**
 * SVGaze - Utility Functions
 *
 * General-purpose utility functions used throughout the application.
 */

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(str).replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * Read file as text
 * @param {File} file - File object from input
 * @returns {Promise<string>} File content as text
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format file size to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get SVG dimensions from element
 * @param {SVGElement} svgElement - SVG element
 * @returns {Object} Object with width and height
 */
export function getSVGDimensions(svgElement) {
  if (!svgElement) return { width: 0, height: 0 };

  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox.split(/\s+/);
    if (parts.length === 4) {
      return {
        width: parseFloat(parts[2]),
        height: parseFloat(parts[3])
      };
    }
  }

  const width = svgElement.getAttribute('width');
  const height = svgElement.getAttribute('height');

  return {
    width: width ? parseFloat(width) : 24,
    height: height ? parseFloat(height) : 24
  };
}

/**
 * Create a blob URL from text
 * @param {string} text - Text content
 * @param {string} mimeType - MIME type
 * @returns {string} Blob URL
 */
export function createBlobURL(text, mimeType = 'text/plain') {
  const blob = new Blob([text], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Revoke a blob URL
 * @param {string} url - Blob URL to revoke
 */
export function revokeBlobURL(url) {
  URL.revokeObjectURL(url);
}

/**
 * Wait for a specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after wait time
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if browser supports required features
 * @returns {Object} Object with feature support flags
 */
export function checkBrowserSupport() {
  return {
    fileSystemAccess: 'webkitdirectory' in document.createElement('input'),
    clipboardAPI: 'clipboard' in navigator,
    es6Modules: 'noModule' in document.createElement('script'),
    localStorage: (() => {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    })()
  };
}

/**
 * Log error to console with context
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 * @param {Object} data - Additional data
 */
export function logError(context, error, data = {}) {
  console.error(`[SVGaze Error - ${context}]`, {
    message: error.message,
    stack: error.stack,
    ...data
  });
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `svg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export default {
  escapeHtml,
  readFileAsText,
  debounce,
  throttle,
  formatFileSize,
  getSVGDimensions,
  createBlobURL,
  revokeBlobURL,
  wait,
  checkBrowserSupport,
  logError,
  generateId,
  clamp,
  isEmpty
};
