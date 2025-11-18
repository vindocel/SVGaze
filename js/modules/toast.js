/**
 * SVGaze - Toast Notifications
 *
 * Simple toast notification system for user feedback
 */

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add to container
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      container.removeChild(toast);

      // Remove container if empty
      if (container.children.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, duration);
}

/**
 * Show success toast
 * @param {string} message - Message to display
 */
export function showSuccess(message) {
  showToast(message, 'success');
}

/**
 * Show error toast
 * @param {string} message - Message to display
 */
export function showError(message) {
  showToast(message, 'error');
}

/**
 * Show warning toast
 * @param {string} message - Message to display
 */
export function showWarning(message) {
  showToast(message, 'warning');
}

/**
 * Show info toast
 * @param {string} message - Message to display
 */
export function showInfo(message) {
  showToast(message, 'info');
}

export default {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo
};
