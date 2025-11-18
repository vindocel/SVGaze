/**
 * SVGaze - i18n System
 *
 * Centralized internationalization system for the entire application.
 * Import this file to use translations throughout the app.
 */

import { t as translate, tPlural as translatePlural, translations } from './pt-BR.js';

// Export translation functions
export const t = translate;
export const tPlural = translatePlural;

/**
 * Initialize i18n system - apply translations to DOM elements
 * Call this on page load to translate all elements with data-i18n attributes
 */
export function initI18n() {
  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });

  // Translate all elements with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.setAttribute('title', t(key));
  });

  // Translate all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.setAttribute('placeholder', t(key));
  });

  // Translate all elements with data-i18n-aria-label attribute
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria-label');
    element.setAttribute('aria-label', t(key));
  });

  console.log('✅ i18n system initialized');
}

export default { t, tPlural, initI18n, translations };
