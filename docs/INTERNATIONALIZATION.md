# Internationalization (i18n)

Complete guide to SVGaze's internationalization system.

## Overview

SVGaze supports multiple languages with automatic detection and manual switching. The system is built on ES6 dynamic imports for optimal performance.

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| Portuguese (Brazil) | `pt-BR` | ✅ Complete |
| English (United States) | `en-US` | ✅ Complete |

## Features

### Automatic Language Detection
- Detects system/browser language via `navigator.language`
- Falls back to PT-BR if language not supported
- Runs before page load for seamless UX

### Manual Language Switching
- Globe icon in header for quick access
- Dropdown menu with flag emojis
- Full page reload on language change
- Selected language highlighted in menu

### Language Persistence
- Saves preference to `localStorage`
- Priority: `localStorage` → browser language → fallback (PT-BR)

## Architecture

### File Structure

```
i18n/
├── i18n.js       # Core i18n module with dynamic loading
├── pt-BR.js      # Portuguese translations (375+ keys)
└── en-US.js      # English translations (375+ keys)
```

### Core Module (`i18n/i18n.js`)

**Exports:**
- `t(key, variables)` - Translate key with optional variable interpolation
- `tPlural(key, count, variables)` - Translate with plural forms
- `initI18n()` - Initialize/update all i18n elements
- `getCurrentLanguage()` - Get current language code
- `setLanguage(language)` - Change language and reload page
- `detectSystemLanguage()` - Detect browser language

**Features:**
- ES6 dynamic imports (`import()`)
- Top-level await for initialization
- Custom event `language-changed` on language switch
- Nested key support with dot notation

### Translation Files

**Structure:**
```javascript
export const translations = {
  app: {
    name: 'SVGaze',
    tagline: 'Modern SVG icon viewer'
  },
  header: {
    title: 'SVGaze',
    selectFolder: 'Select folder'
  },
  // ... 375+ keys
};

export function t(key, variables = {}) {
  // Translation logic
}

export function tPlural(key, count, variables = {}) {
  // Plural logic
}
```

## Usage

### HTML - Static Elements

Use `data-i18n` attributes:

```html
<!-- Simple text content -->
<span data-i18n="app.name">SVGaze</span>

<!-- Placeholder -->
<input data-i18n-placeholder="header.searchPlaceholder"
       placeholder="Search icons...">

<!-- Title/Tooltip -->
<button data-i18n-title="header.clearFavorites"
        title="Clear favorites">
  Clear
</button>

<!-- ARIA label -->
<button data-i18n-aria-label="header.themeToggle"
        aria-label="Toggle theme">
  Toggle
</button>
```

### JavaScript - Dynamic Content

Import and use `t()` function:

```javascript
import { t } from '../i18n/i18n.js';

// Simple translation
element.textContent = t('notifications.success');

// With variables
const message = t('notifications.itemsFound', { count: 42 });
// → "42 items found"

// Plural forms
const text = t('toolbar.icons', { count: 1 });  // → "icon"
const text = t('toolbar.icons', { count: 5 });  // → "icons"
```

### Initializing i18n

Called automatically on page load and language change:

```javascript
import { initI18n } from '../i18n/i18n.js';

// Updates all elements with data-i18n attributes
initI18n();
```

### Changing Language

```javascript
import { setLanguage } from '../i18n/i18n.js';

// Change to English and reload page
await setLanguage('en-US');
// Page reloads automatically
```

## Translation Keys

### Key Naming Convention

```
section.subsection.element
```

**Examples:**
- `header.title` - Header title
- `modal.copySvg` - Modal copy button
- `notifications.success` - Success notification
- `editor.export.react` - Editor React export tab

### Variable Interpolation

Use `{variable}` in translation strings:

```javascript
// Translation file
export const translations = {
  notifications: {
    itemsFound: '{count} items found'
  }
};

// Usage
t('notifications.itemsFound', { count: 42 });
// → "42 items found"
```

### Plural Forms

Define singular and plural forms:

```javascript
// Translation file
export const translations = {
  toolbar: {
    icon: 'icon',
    icons: 'icons'
  }
};

// Usage
tPlural('toolbar.icon', 'toolbar.icons', 1);  // → "icon"
tPlural('toolbar.icon', 'toolbar.icons', 5);  // → "icons"
```

## Adding a New Language

### 1. Create Translation File

Create `i18n/[language-code].js`:

```javascript
export const translations = {
  app: {
    name: 'SVGaze',
    tagline: 'Your translated tagline'
  },
  // ... copy all keys from en-US.js
};

export function t(key, variables = {}) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    value = value?.[k];
  }

  if (typeof value !== 'string') return key;

  return value.replace(/\{(\w+)\}/g, (_, varName) =>
    variables[varName] ?? `{${varName}}`
  );
}

export function tPlural(singular, plural, count, variables = {}) {
  const key = count === 1 ? singular : plural;
  return t(key, { ...variables, count });
}
```

### 2. Update Core Module

Add language to `i18n/i18n.js`:

```javascript
export function detectSystemLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const supportedLanguages = ['pt-BR', 'en-US', 'fr-FR']; // Add new language

  // ... rest of logic
}

async function loadLanguage(language) {
  try {
    let module;
    if (language === 'en-US') {
      module = await import('./en-US.js');
    } else if (language === 'fr-FR') {  // Add new language
      module = await import('./fr-FR.js');
    } else {
      module = await import('./pt-BR.js');
    }
    // ... rest of logic
  }
}
```

### 3. Update Language Selector UI

Add option to `index.html`:

```html
<ul class="language-menu" id="languageMenu" role="menu">
  <li role="menuitem" data-lang="pt-BR" class="language-option">
    <span class="language-flag">🇧🇷</span>
    <span class="language-name">Português (Brasil)</span>
  </li>
  <li role="menuitem" data-lang="en-US" class="language-option">
    <span class="language-flag">🇺🇸</span>
    <span class="language-name">English (United States)</span>
  </li>
  <li role="menuitem" data-lang="fr-FR" class="language-option">
    <span class="language-flag">🇫🇷</span>
    <span class="language-name">Français (France)</span>
  </li>
</ul>
```

### 4. Update Language Text Display

Update `updateLanguageUI()` in `js/main.js`:

```javascript
function updateLanguageUI() {
  const currentLang = getCurrentLanguage();

  if (languageText) {
    const langMap = {
      'pt-BR': 'PT',
      'en-US': 'EN',
      'fr-FR': 'FR'  // Add new language
    };
    languageText.textContent = langMap[currentLang] || 'PT';
  }
  // ... rest of logic
}
```

## Best Practices

### 1. Always Use Translation Keys
❌ **Bad:**
```javascript
element.textContent = 'Copy SVG';
```

✅ **Good:**
```javascript
element.textContent = t('modal.copySvg');
```

### 2. Keep Keys Organized
Group related keys under the same section:

```javascript
export const translations = {
  modal: {
    copySvg: 'Copy SVG',
    copyName: 'Copy name',
    copyPath: 'Copy path',
    close: 'Close'
  }
};
```

### 3. Use Variables for Dynamic Content
❌ **Bad:**
```javascript
// Hardcoded in multiple languages
en: `${count} items found`
pt: `${count} itens encontrados`
```

✅ **Good:**
```javascript
// Translation files
en: '{count} items found'
pt: '{count} itens encontrados'

// Usage
t('notifications.itemsFound', { count })
```

### 4. Import t() Function in Every Module
```javascript
// At top of every JS module that uses translations
import { t } from '../i18n/i18n.js';
```

### 5. Test Both Languages
Always test your changes in both PT-BR and EN-US to ensure:
- All strings are translated
- Variables interpolate correctly
- Plural forms work as expected
- UI layout doesn't break with longer/shorter text

## Common Patterns

### Dropdowns with Translation

```html
<div class="custom-dropdown" id="categoryDropdown">
  <button class="dropdown-trigger">
    <span data-i18n="header.allCategories">All categories</span>
  </button>
</div>
```

```javascript
// Update dropdown after language change
const triggerSpan = dropdown.querySelector('.dropdown-trigger span');
if (triggerSpan) {
  triggerSpan.textContent = t('header.allCategories');
}
```

### Conditional Translation

```javascript
// Translate based on condition
const message = isFavorite
  ? t('card.unfavorite')
  : t('card.favorite');
```

### Toast Notifications

```javascript
import { showToast } from './toastManager.js';
import { t } from '../i18n/i18n.js';

showToast(t('notifications.success'), 'success');
```

## Troubleshooting

### Translation Not Appearing

1. **Check if key exists** in translation file
2. **Verify import** of `t()` function in JS module
3. **Ensure initI18n()** was called after DOM load
4. **Check console** for missing key warnings

### Wrong Language Loading

1. **Clear localStorage**: `localStorage.removeItem('language')`
2. **Check browser language** in DevTools
3. **Verify language code** matches exactly (case-sensitive)

### Language Not Persisting

1. **Check localStorage** is enabled in browser
2. **Verify setLanguage()** is called before reload
3. **Check for errors** in browser console

## Performance

- **Dynamic imports** only load needed language file (~12KB)
- **No runtime overhead** - translations loaded once on page load
- **localStorage caching** prevents re-detection on every visit
- **Page reload** ensures 100% translation coverage without complexity

## Related Files

- [i18n/i18n.js](../i18n/i18n.js) - Core module
- [i18n/pt-BR.js](../i18n/pt-BR.js) - Portuguese translations
- [i18n/en-US.js](../i18n/en-US.js) - English translations
- [js/main.js](../js/main.js) - Language selector UI
- [index.html](../index.html) - Language selector HTML

## Future Improvements

- [ ] Add more languages (Spanish, French, German, etc.)
- [ ] RTL (Right-to-Left) language support
- [ ] Date/time localization
- [ ] Number formatting per locale
- [ ] Language-specific fonts
- [ ] Automated translation validation tests
