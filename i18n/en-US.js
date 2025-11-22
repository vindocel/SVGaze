/**
 * SVGaze - English (United States) Translations
 *
 * All text strings used throughout the application.
 * Do not hardcode strings in HTML or JavaScript - use this file instead.
 */

export const translations = {
  // === Application Info ===
  app: {
    name: 'SVGaze',
    tagline: 'Modern SVG icon viewer',
    description: 'Features: search, category filter, modal, favorites, color and size customization'
  },

  // === Header ===
  header: {
    title: 'SVGaze',
    selectFolder: 'Select folder',
    searchPlaceholder: 'Search by name...',
    searchLabel: 'Search icons',
    categoryFilterLabel: 'Filter category',
    allCategories: 'All categories',
    sizeLabel: 'Size',
    colorLabel: 'Global icon color',
    clearFavorites: 'Clear favorites',
    themeToggle: 'Toggle theme',
    languageToggle: 'Change language',
    backToHome: 'Back to home'
  },

  // === Toolbar ===
  toolbar: {
    iconsLoaded: 'icons loaded',
    icon: 'icon',
    icons: 'icons',
    activeColorLabel: 'Active color',
    currentCategory: 'Category'
  },

  // === Welcome Screen ===
  welcome: {
    title: '👋 Welcome to the viewer',
    message: 'Use "Select folder" to choose the folder containing your .svg files — the viewer groups them by folder.'
  },

  // === Cards ===
  card: {
    favorite: 'Favorite',
    unfavorite: 'Remove from favorites',
    open: 'Open',
    edit: 'Edit',
    copy: 'Copy',
    download: 'Download',
    invalidSvg: 'Invalid SVG'
  },

  // === Modal ===
  modal: {
    copySvg: 'Copy SVG',
    copyName: 'Copy name',
    copyPath: 'Copy path',
    close: 'Close',
    invalidSvg: 'Invalid SVG'
  },

  // === Notifications ===
  notifications: {
    copied: 'Copied!',
    copyError: 'Could not copy',
    noSvgFound: 'No .svg files found.',
    noResults: 'No results found.',
    loadError: 'Error loading SVG files. See console for details.',
    favoritesCleared: 'Favorites cleared successfully'
  },

  // === Category Headers ===
  category: {
    root: 'Root',
    count: '{count} icon',
    countPlural: '{count} icons'
  },

  // === Accessibility ===
  a11y: {
    headerLabel: 'Viewer header',
    mainControlsLabel: 'Main controls',
    fileInputHidden: 'Hidden file selector',
    modalDialog: 'Preview window',
    gridLive: 'Icon grid updated'
  },

  // === Views ===
  views: {
    gallery: 'Gallery',
    editor: 'Editor'
  },

  // === Upload File ===
  uploadFile: 'Upload SVG',

  // === Editor Tools ===
  editor: {
    // Buttons
    upload: 'Upload',
    uploadTitle: 'Upload SVG',
    copy: 'Copy',
    copyTitle: 'Copy SVG code',
    download: 'Download',
    downloadTitle: 'Download SVG',
    optimize: 'Optimize',
    optimizeTitle: 'Optimize SVG',
    prettify: 'Format',
    prettifyTitle: 'Format code',

    // Tools
    rotate: 'Rotate 90°',
    flipHorizontal: 'Flip Horizontal',
    flipVertical: 'Flip Vertical',
    dimensions: 'Change dimensions',
    dimensionsModal: 'DIMENSIONS',
    widthLabel: 'W',
    heightLabel: 'H',
    lockProportions: 'Lock proportions',
    apply: 'Apply',

    // Messages
    placeholder: 'Paste or type SVG code in the editor',
    noContent: 'No SVG to preview',
    invalidSvg: 'Invalid SVG',
    optimized: 'Optimized',

    // Theme toggle
    themeToggle: 'Toggle light/dark theme'
  },

  // === Export Tabs ===
  exportTabs: {
    preview: 'Preview',
    react: 'React',
    reactNative: 'React Native',
    png: 'PNG',
    dataUri: 'Data URI',
    reactComponent: 'React Component',
    reactNativeComponent: 'React Native Component'
  },

  // === Export Settings ===
  exportSettings: {
    typescript: 'TypeScript',
    singleQuotes: 'Single Quotes',
    stripSemicolons: 'Remove Semicolons',
    minifiedDataUri: 'Minified Data URI',
    base64: 'base64',
    encodeUriComponent: 'encodeURIComponent',
    downloadJsx: 'Download JSX',
    downloadPng: 'Download PNG',
    copyCode: 'Copy code'
  },

  // === Preview Controls ===
  preview: {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitToView: 'Fit to View',
    toggleGrid: 'Toggle Grid',
    toggleCheckered: 'Toggle Checkered Background',
    downloadSvg: 'Download SVG',
    dimensionsPlaceholder: '—'
  },

  // === Toast Messages ===
  toasts: {
    // Success
    svgCopied: '✓ SVG code copied!',
    svgDownloaded: '✓ SVG downloaded!',
    codeCopied: '✓ Code copied!',
    reactCopied: '✓ React code copied!',
    reactNativeCopied: '✓ React Native code copied!',
    jsxDownloaded: '✓ JSX downloaded!',
    pngExported: '✓ PNG exported!',
    dataUriCopied: '✓ Data URI copied!',
    svgFormatted: '✓ SVG formatted!',
    svgMinified: '✓ SVG minified!',
    svgValid: '✓ Valid SVG!',
    svgRotated: '✅ Rotated {degrees}°',
    svgFlipped: '✅ Flipped {axis}ly',
    dimensionsApplied: '✅ Dimensions: {width}×{height}',
    transformsReset: '✅ Transforms reset',
    settingsRestored: '✅ Settings restored',
    codeManualCopy: 'Code copied! (or press Ctrl+C to copy manually)',

    // Errors
    errorCopy: '✗ Error copying',
    errorExportPng: '✗ Error exporting PNG',
    errorNoContent: '✗ No SVG to export',
    errorFormat: 'Error formatting SVG.',
    errorMinify: 'Error minifying SVG.',
    errorValidate: 'Error validating SVG.',
    errorRotate: '❌ Error rotating SVG',
    errorFlip: '❌ Error flipping SVG',
    errorDimensions: '❌ Error applying dimensions',
    errorTransforms: '❌ Error resetting transforms',
    errorOptimize: '❌ Error optimizing SVG',
    errorExport: 'Error exporting to {format}.',
    errorReactConvert: 'Error converting to React JSX.',
    errorReactNativeConvert: 'Error converting to React Native.',
    errorDataUriCreate: 'Error creating Data URI.',
    errorReadFile: 'Error reading file. Please try again.',

    // Warnings
    warningNoSvgElement: '⚠️ No SVG element found',
    warningNoSvgToOptimize: '⚠️ No SVG code to optimize',
    warningNoContentToCopy: 'No content to copy.',
    warningNoContentToDownload: 'No content to download.',
    warningNoContentToFormat: 'No content to format.',
    warningNoContentToMinify: 'No content to minify.',
    warningNoContentToValidate: 'No content to validate.',
    warningNoContentToExport: 'No content to export.',
    warningInvalidFile: 'Please select a valid SVG file.',
    warningInvalidDimensions: 'Please enter valid dimensions.',
    warningSyntaxError: '❌ SVG syntax error:\n\n{error}',
    warningNoSvgTag: '❌ No <svg> element found.'
  },

  // === Favorites ===
  favorites: {
    title: '⭐ Favorites'
  },

  // === Validation Messages ===
  validation: {
    noSvgFiles: 'No .svg files found in the selected folder.'
  },

  // === Keyboard Shortcuts ===
  shortcuts: {
    escape: 'Close modal',
    ctrlF: 'Focus search',
    arrowKeys: 'Navigate between icons',
    enter: 'Open modal',
    f: 'Add/remove favorite'
  },

  // === Themes ===
  themes: {
    light: 'Light Theme',
    dark: 'Dark Theme',
    system: 'Use system preference'
  },

  // === Languages ===
  languages: {
    'pt-BR': 'Português (Brasil)',
    'en-US': 'English (United States)'
  },

  // === File Processing ===
  files: {
    loading: 'Loading files...',
    processing: 'Processing {count} files',
    loaded: 'Successfully loaded {count} SVG files',
    parsingError: 'Error processing SVG'
  },

  // === Settings (Future) ===
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
    performance: 'Performance',
    about: 'About'
  },

  // === Stats (Future) ===
  stats: {
    title: 'Statistics',
    totalIcons: 'Total Icons',
    totalCategories: 'Total Categories',
    totalFavorites: 'Total Favorites',
    totalSize: 'Total Size',
    avgSize: 'Average Size'
  },

  // === Error Messages ===
  errors: {
    generic: 'An unexpected error occurred',
    fileRead: 'Error reading file',
    parseError: 'Error processing SVG',
    networkError: 'Connection error',
    permissionDenied: 'Permission denied',
    unsupportedBrowser: 'Unsupported browser. Use Chrome, Edge, Firefox or Safari.'
  },

  // === Success Messages ===
  success: {
    saved: 'Saved successfully',
    exported: 'Exported successfully',
    imported: 'Imported successfully',
    deleted: 'Deleted successfully'
  },

  // === Confirmation Messages ===
  confirmations: {
    clearFavorites: 'Are you sure you want to clear all favorites?',
    deleteItem: 'Are you sure you want to delete this item?',
    resetSettings: 'Are you sure you want to reset settings?'
  },

  // === Time & Dates ===
  time: {
    now: 'Now',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: '{days} days ago',
    weeksAgo: '{weeks} weeks ago',
    monthsAgo: '{months} months ago'
  },

  // === Units ===
  units: {
    px: 'px',
    kb: 'KB',
    mb: 'MB',
    bytes: 'bytes'
  }
};

/**
 * Get translation by key
 * Supports nested keys with dot notation: 'header.title'
 * Supports variable interpolation: '{count} items'
 *
 * @param {string} key - Translation key
 * @param {Object} vars - Variables for interpolation
 * @returns {string} Translated text
 */
export function t(key, vars = {}) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  // Variable interpolation
  return value.replace(/\{(\w+)\}/g, (match, varName) => {
    return vars[varName] !== undefined ? vars[varName] : match;
  });
}

/**
 * Get plural form based on count
 * @param {number} count - Number for plural check
 * @param {string} singular - Singular key
 * @param {string} plural - Plural key
 * @returns {string} Translated text
 */
export function tPlural(count, singular, plural) {
  const key = count === 1 ? singular : plural;
  return t(key, { count });
}

export default translations;
