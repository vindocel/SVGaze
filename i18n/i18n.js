/**
 * SVGaze - i18n System
 *
 * Centralized internationalization system for the entire application.
 * Import this file to use translations throughout the app.
 */

// Store current language and translations
let currentLanguage = 'pt-BR';
let currentTranslations = null;
let currentT = null;
let currentTPlural = null;

// Detect system language
export function detectSystemLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const supportedLanguages = ['pt-BR', 'en-US'];

  // Check if browser language matches supported languages exactly
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  // Check for language without region (e.g., 'en' matches 'en-US', 'pt' matches 'pt-BR')
  const langBase = browserLang.split('-')[0].toLowerCase();
  const match = supportedLanguages.find(lang => lang.toLowerCase().startsWith(langBase));

  return match || 'pt-BR'; // Default to pt-BR
}

// Initialize with default language (pt-BR) or detected language
async function initializeLanguage() {
  // Check localStorage first, then detect system language
  const savedLanguage = localStorage.getItem('language');
  const detectedLanguage = detectSystemLanguage();
  const initialLanguage = savedLanguage || detectedLanguage;

  await loadLanguage(initialLanguage);
}

// Load language dynamically
async function loadLanguage(language) {
  try {
    let module;

    if (language === 'en-US') {
      module = await import('./en-US.js');
    } else {
      module = await import('./pt-BR.js');
    }

    currentLanguage = language;
    currentTranslations = module.translations;
    currentT = module.t;
    currentTPlural = module.tPlural;

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', language);

    console.log(`✅ Language loaded: ${language}`);
    return true;
  } catch (error) {
    console.error(`❌ Error loading language ${language}:`, error);
    return false;
  }
}

// Export translation functions that use current language
export function t(key, vars = {}) {
  if (!currentT) {
    console.warn('i18n not initialized yet, using key as fallback');
    return key;
  }
  return currentT(key, vars);
}

export function tPlural(count, singular, plural) {
  if (!currentTPlural) {
    console.warn('i18n not initialized yet');
    return singular;
  }
  return currentTPlural(count, singular, plural);
}

// Get current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Set language and reload translations
export async function setLanguage(language) {
  if (language === currentLanguage) {
    return; // Already using this language
  }

  const success = await loadLanguage(language);

  if (success) {
    // Save to localStorage
    localStorage.setItem('language', language);

    // Re-apply translations to DOM
    initI18n();

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: { language }
    }));

    console.log(`✅ Language changed to: ${language}`);
  }
}

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

  console.log('✅ i18n DOM translations applied');
}

// Initialize language on module load
await initializeLanguage();

export default {
  t,
  tPlural,
  initI18n,
  getCurrentLanguage,
  setLanguage,
  detectSystemLanguage,
  get translations() { return currentTranslations; }
};
