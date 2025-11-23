# Translation Guide

Learn how to add new languages to SVGaze's internationalization system.

---

## Overview

SVGaze currently supports PT-BR and EN-US. This guide will show you how to add additional languages to the application.

---

## Prerequisites

- Basic knowledge of JavaScript
- Familiarity with JSON/object structures
- Understanding of the target language
- Access to the SVGaze codebase

---

## Quick Start

Adding a new language involves 4 main steps:

1. Create translation file
2. Update i18n module
3. Update language selector UI
4. Test translations

---

## Step 1: Create Translation File

### 1.1 Copy Existing File

Start by copying an existing translation file:

```bash
# Copy PT-BR as template
cp i18n/pt-BR.js i18n/fr-FR.js
```

Replace `fr-FR` with your target language code (e.g., `es-ES`, `de-DE`, etc.)

### 1.2 Translate Content

Open the new file and translate all strings:

**Before (PT-BR):**
```javascript
export const translations = {
  app: {
    name: 'SVGaze',
    tagline: 'Visualizador moderno de ícones SVG'
  },
  // ...
};
```

**After (FR-FR):**
```javascript
export const translations = {
  app: {
    name: 'SVGaze',
    tagline: 'Visualiseur moderne d\'icônes SVG'
  },
  // ...
};
```

### 1.3 Translation Keys

**Keep these unchanged:**
- `app.name` → Always "SVGaze"
- Technical terms → React, PNG, SVG, etc.
- File extensions → .svg, .png, etc.

**Translate everything else:**
- UI labels and buttons
- Messages and notifications
- Descriptions and tooltips
- Error messages

---

## Step 2: Update i18n Module

### 2.1 Add Language Detection

Open `i18n/i18n.js` and update the `detectSystemLanguage` function:

```javascript
export function detectSystemLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const supportedLanguages = [
    'pt-BR',
    'en-US',
    'fr-FR'  // Add your language
  ];

  // ... rest of function
}
```

### 2.2 Add Dynamic Import

In the same file, update `loadLanguage` function:

```javascript
async function loadLanguage(language) {
  try {
    let module;
    if (language === 'en-US') {
      module = await import('./en-US.js');
    } else if (language === 'fr-FR') {  // Add import
      module = await import('./fr-FR.js');
    } else {
      module = await import('./pt-BR.js');
    }

    // ... rest of function
  }
}
```

---

## Step 3: Update Language Selector UI

### 3.1 Add Menu Option

Open `index.html` and add language option:

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
  <!-- Add new language -->
  <li role="menuitem" data-lang="fr-FR" class="language-option">
    <span class="language-flag">🇫🇷</span>
    <span class="language-name">Français (France)</span>
  </li>
</ul>
```

### 3.2 Update Button Display

Open `js/main.js` and update `updateLanguageUI` function:

```javascript
function updateLanguageUI() {
  const currentLang = getCurrentLanguage();

  if (languageText) {
    const langMap = {
      'pt-BR': 'PT',
      'en-US': 'EN',
      'fr-FR': 'FR'  // Add language code
    };
    languageText.textContent = langMap[currentLang] || 'PT';
  }

  // ... rest of function
}
```

---

## Step 4: Test Translations

### 4.1 Test Language Detection

1. Clear browser localStorage
2. Change browser language to your new language
3. Reload application
4. Verify correct language loads

### 4.2 Test Manual Switching

1. Open language selector
2. Click your new language
3. Verify page reloads
4. Check all UI elements are translated

### 4.3 Test Coverage

Check these areas are fully translated:

**Header:**
- [ ] Logo tooltip
- [ ] View toggle buttons (Gallery/Editor)
- [ ] Language selector
- [ ] Theme toggle tooltip
- [ ] Mobile menu button

**Secondary Toolbar:**
- [ ] Select folder button
- [ ] Search placeholder
- [ ] Category dropdown
- [ ] Size label
- [ ] Color picker label
- [ ] Clear favorites button

**Gallery:**
- [ ] Welcome card
- [ ] Category badges
- [ ] Card buttons (Open, Edit, Copy)
- [ ] Favorites title
- [ ] No results message

**Editor:**
- [ ] Tab names
- [ ] Button labels
- [ ] Transformation tooltips
- [ ] SVGO modal options
- [ ] Export format labels

**Modal:**
- [ ] Button labels
- [ ] Error messages
- [ ] Success notifications

**Footer:**
- [ ] App name and tagline
- [ ] Description text

---

## Translation Best Practices

### DO:

✅ **Keep consistent terminology**
- Use the same translation for repeated terms
- Example: "ícone" always for "icon", never "símbolo"

✅ **Respect context**
- "Open" (verb) vs "Open" (adjective) may need different translations
- Consider UI space limitations

✅ **Test with real content**
- Use actual SVG files
- Test with long filenames
- Verify with different folder structures

✅ **Follow language conventions**
- Capitalization rules
- Punctuation standards
- Date/time formats (future feature)

### DON'T:

❌ **Don't translate technical terms**
- React, SVG, PNG, JSON remain unchanged
- File extensions stay in English
- Code snippets stay in original language

❌ **Don't use machine translation blindly**
- Review and adapt automated translations
- Ensure natural-sounding text
- Consider cultural context

❌ **Don't change variable names**
- `{count}` must remain `{count}`
- Placeholder names are part of code
- Only translate surrounding text

---

## Language Codes Reference

Use standard ISO 639-1 + ISO 3166-1 format:

| Language | Code | Flag |
|----------|------|------|
| Portuguese (Brazil) | pt-BR | 🇧🇷 |
| English (US) | en-US | 🇺🇸 |
| Spanish (Spain) | es-ES | 🇪🇸 |
| French (France) | fr-FR | 🇫🇷 |
| German (Germany) | de-DE | 🇩🇪 |
| Italian (Italy) | it-IT | 🇮🇹 |
| Japanese (Japan) | ja-JP | 🇯🇵 |
| Chinese (Simplified) | zh-CN | 🇨🇳 |
| Russian (Russia) | ru-RU | 🇷🇺 |

---

## Example: Adding Spanish

Here's a complete example for adding Spanish (es-ES):

### 1. Create `i18n/es-ES.js`

```javascript
export const translations = {
  app: {
    name: 'SVGaze',
    tagline: 'Visor moderno de iconos SVG',
    description: 'Buscar, filtrar, categorizar, editar y exportar'
  },
  header: {
    title: 'SVGaze',
    selectFolder: 'Seleccionar carpeta',
    searchPlaceholder: 'Buscar iconos...',
    // ... continue translating all keys
  }
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

### 2. Update `i18n/i18n.js`

```javascript
const supportedLanguages = ['pt-BR', 'en-US', 'es-ES'];

// In loadLanguage function:
if (language === 'en-US') {
  module = await import('./en-US.js');
} else if (language === 'es-ES') {
  module = await import('./es-ES.js');
} else {
  module = await import('./pt-BR.js');
}
```

### 3. Update `index.html`

```html
<li role="menuitem" data-lang="es-ES" class="language-option">
  <span class="language-flag">🇪🇸</span>
  <span class="language-name">Español (España)</span>
</li>
```

### 4. Update `js/main.js`

```javascript
const langMap = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  'es-ES': 'ES'
};
```

---

## Contributing Translations

Want to contribute a translation to SVGaze?

### Submit via Pull Request

1. Fork the repository
2. Create language branch: `git checkout -b add-spanish-translation`
3. Add translation files
4. Update necessary code files
5. Test thoroughly
6. Commit: `git commit -m "feat: add Spanish (es-ES) translation"`
7. Push and create Pull Request

### Translation Checklist

Before submitting:

- [ ] All 375+ keys are translated
- [ ] No placeholder text remains (`TODO`, `TRANSLATE`, etc.)
- [ ] Variables (`{count}`, etc.) are preserved
- [ ] Tested in both light and dark themes
- [ ] Tested on desktop and mobile
- [ ] All UI areas checked (header, gallery, editor, modal, footer)
- [ ] Language selector updated
- [ ] i18n module updated
- [ ] No console errors
- [ ] README updated (if needed)

---

## Troubleshooting

### Translations not appearing

**Problem:** UI still shows English/Portuguese

**Solutions:**
1. Check browser console for import errors
2. Verify language code matches exactly
3. Clear localStorage: `localStorage.removeItem('language')`
4. Hard refresh: `Ctrl+Shift+R`

### Partial translations

**Problem:** Some text translated, some not

**Solutions:**
1. Check for missing keys in translation file
2. Verify `data-i18n` attributes in HTML
3. Check for hardcoded strings in JavaScript
4. Look for `t()` function calls

### Wrong language loads

**Problem:** App loads different language than expected

**Solutions:**
1. Check browser language setting
2. Clear localStorage
3. Manually select language from selector
4. Check detection logic in `detectSystemLanguage()`

---

## Resources

- [i18n Module](https://github.com/vindocel/SVGaze/blob/main/i18n/i18n.js)
- [PT-BR Translation](https://github.com/vindocel/SVGaze/blob/main/i18n/pt-BR.js)
- [EN-US Translation](https://github.com/vindocel/SVGaze/blob/main/i18n/en-US.js)
- [Internationalization Docs](https://github.com/vindocel/SVGaze/blob/main/docs/INTERNATIONALIZATION.md)

---

## Need Help?

- 📖 [Full i18n Documentation](Internationalization)
- 💬 [Ask in Discussions](https://github.com/vindocel/SVGaze/discussions)
- 🐛 [Report Translation Issues](https://github.com/vindocel/SVGaze/issues)

---

**Thank you for helping make SVGaze accessible to more people! 🌍**
