/**
 * SVGaze - Gallery Renderer
 * Render the SVG gallery grid with categories and badges
 */

import { t } from '../../i18n/i18n.js';
import { appState } from '../state.js';
import { escapeHtml } from './utils.js';
import { getFilteredItems, getUniqueCategories } from './filterManager.js';
import { toggleFavorite, isFavorite } from './favoriteManager.js';
import { parseAndSanitizeSVG, ensureViewBox, applyCurrentColorToSVG, prepareSVGForDisplay } from './svgProcessor.js';
import { openModal } from './modalManager.js';
import { copySVGCode, downloadSVG } from './clipboardManager.js';
import { getSVGText } from './svgProcessor.js';
import { getCategoryIconElement, getCategoryIcon } from './categoryIconManager.js';
import { openInEditor } from './viewManager.js';

let gridElement, countSpan, catNameSpan, welcomeCard;

export function initGallery() {
  gridElement = document.getElementById('grid');
  countSpan = document.getElementById('count');
  catNameSpan = document.getElementById('catName');
  welcomeCard = document.getElementById('welcome');

  if (!gridElement) {
    console.error('Grid element not found');
  }
}

export function renderGallery() {
  if (!gridElement) return;

  // Remove welcome card if items exist
  if (welcomeCard && appState.allItems.length > 0) {
    welcomeCard.remove();
    welcomeCard = null;
  }

  gridElement.innerHTML = '';

  const visible = getFilteredItems();

  // Get all favorites (regardless of filters, except search and style)
  const { search, style } = appState.filters;
  let allFavorites = appState.allItems.filter(item => isFavorite(item.originalPath));

  // Apply only search and style filters to favorites
  if (search) {
    const query = search.toLowerCase();
    allFavorites = allFavorites.filter(i => {
      const searchText = `${i.fileName} ${i.originalPath} ${i.subcategory} ${i.style}`.toLowerCase();
      return searchText.includes(query);
    });
  }
  if (style) {
    allFavorites = allFavorites.filter(i => i.style === style);
  }

  // Update count
  if (countSpan) {
    countSpan.textContent = visible.length;
  }

  // Update category name
  if (catNameSpan) {
    catNameSpan.textContent = appState.filters.category || 'Todas';
  }

  // No results
  if (visible.length === 0 && appState.allItems.length > 0 && allFavorites.length === 0) {
    gridElement.innerHTML = '<div class="card" style="grid-column:1/-1;padding:18px">Nenhum resultado encontrado.</div>';
    return;
  }

  // Render Favorites section first (always visible, even with category filters)
  if (allFavorites.length > 0) {
    renderFavoritesSection(allFavorites);
  }

  // Render items grouped by category (excluding favorites)
  const itemsWithoutFavorites = visible.filter(item => !isFavorite(item.originalPath));
  let lastCategory = null;

  for (const item of itemsWithoutFavorites) {
    // Add category header when category changes
    if (item.category !== lastCategory && !appState.filters.category) {
      lastCategory = item.category;
      const categoryHeader = createCategoryHeader(item.category, itemsWithoutFavorites);
      gridElement.appendChild(categoryHeader);
    }

    // Create and append card
    const card = createCard(item);
    gridElement.appendChild(card);
  }
}

function createCategoryHeader(category, allVisibleItems) {
  const header = document.createElement('div');
  header.className = 'category-header';

  // Add category icon
  const iconSvg = getCategoryIconElement(category, 24);
  if (iconSvg) {
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'category-icon';
    iconWrapper.appendChild(iconSvg);
    header.appendChild(iconWrapper);
  }

  const title = document.createElement('span');
  title.textContent = category;

  const count = document.createElement('span');
  count.className = 'category-count';
  const itemsInCategory = allVisibleItems.filter(v => v.category === category).length;
  count.textContent = `${itemsInCategory} ícone${itemsInCategory !== 1 ? 's' : ''}`;

  header.appendChild(title);
  header.appendChild(count);

  return header;
}

function renderFavoritesSection(favorites) {
  // Create favorites header
  const header = document.createElement('div');
  header.className = 'category-header favorites-header';

  const title = document.createElement('span');
  title.textContent = '⭐ Favoritos';

  const count = document.createElement('span');
  count.className = 'category-count';
  count.textContent = `${favorites.length} ícone${favorites.length !== 1 ? 's' : ''}`;

  header.appendChild(title);
  header.appendChild(count);
  gridElement.appendChild(header);

  // Render favorite cards
  for (const item of favorites) {
    const card = createCard(item);
    card.classList.add('favorite-card');
    gridElement.appendChild(card);
  }
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  // Preview section
  const preview = createPreview(item);
  card.appendChild(preview);

  // Info section
  const info = createInfo(item);
  card.appendChild(info);

  return card;
}

function createPreview(item) {
  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.setAttribute('data-path', item.originalPath);

  const svgElement = item.svgElement || parseAndSanitizeSVG(item.svgText);

  if (!svgElement) {
    preview.textContent = 'SVG inválido';
    console.error('Failed to render SVG:', item.fileName);
    return preview;
  }

  // Prepare SVG for display (clone to avoid modifying original)
  const displayElement = svgElement.cloneNode(true);
  ensureViewBox(displayElement);
  displayElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  displayElement.style.overflow = 'visible';
  displayElement.removeAttribute('width');
  displayElement.removeAttribute('height');
  applyCurrentColorToSVG(displayElement);

  // Create wrapper
  const wrap = document.createElement('div');
  wrap.className = 'svg-wrap';
  const size = appState.ui.selectedSize;
  wrap.style.maxWidth = `${size}px`;
  wrap.style.maxHeight = `${size}px`;

  const displaySvg = prepareSVGForDisplay(
    displayElement,
    size,
    appState.ui.selectedColor
  );

  if (displaySvg) {
    wrap.appendChild(displaySvg);
  }

  preview.appendChild(wrap);
  return preview;
}

function createInfo(item) {
  const info = document.createElement('div');
  info.className = 'info';

  // Title row with badges
  const titleRow = document.createElement('div');
  titleRow.className = 'card-title-row';

  // Filename
  const filename = document.createElement('div');
  filename.className = 'filename';
  filename.textContent = item.fileName;
  filename.title = item.fullPath || item.originalPath;
  filename.style.flex = '1';
  filename.style.minWidth = '0';
  titleRow.appendChild(filename);

  // Style badge (NEW - Outline, Solid, etc)
  if (item.style) {
    const styleBadge = document.createElement('span');
    styleBadge.className = 'style-badge';
    styleBadge.textContent = item.style;
    styleBadge.title = `Estilo: ${item.style}`;
    titleRow.appendChild(styleBadge);
  }

  // Subcategory badge
  if (item.subcategory) {
    const subBadge = document.createElement('span');
    subBadge.className = 'subcategory-badge';
    subBadge.textContent = item.subcategory;
    subBadge.title = item.fullPath;
    titleRow.appendChild(subBadge);
  }

  info.appendChild(titleRow);

  // Actions
  const actions = createActions(item);
  info.appendChild(actions);

  return info;
}

function createActions(item) {
  const actions = document.createElement('div');
  actions.className = 'actions';

  // Favorite button
  const btnFav = document.createElement('button');
  btnFav.className = 'small-btn';
  btnFav.title = 'Favoritar';
  btnFav.innerHTML = isFavorite(item.originalPath) ? '★' : '☆';
  if (isFavorite(item.originalPath)) {
    btnFav.classList.add('favorited');
  }
  btnFav.addEventListener('click', (evt) => {
    evt.stopPropagation();
    toggleFavorite(item.originalPath);
    btnFav.innerHTML = isFavorite(item.originalPath) ? '★' : '☆';
    btnFav.classList.toggle('favorited');
    // Re-render gallery to move favorited items to top
    renderGallery();
  });

  // Open modal button
  const btnOpen = document.createElement('button');
  btnOpen.className = 'small-btn primary';
  btnOpen.textContent = t('card.open');
  btnOpen.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openModal(item);
  });

  // Edit button
  const btnEdit = document.createElement('button');
  btnEdit.className = 'small-btn edit';
  btnEdit.textContent = t('card.edit');
  btnEdit.addEventListener('click', (ev) => {
    ev.stopPropagation();
    try {
      // Get SVG text content
      const svgText = getSVGText(item);
      if (svgText) {
        // Open editor with this SVG
        openInEditor(svgText, item.name);
      }
    } catch (error) {
      console.error('Error loading SVG for editing:', error);
    }
  });

  // Copy button
  const btnCopy = document.createElement('button');
  btnCopy.className = 'small-btn';
  btnCopy.textContent = t('card.copy');
  btnCopy.addEventListener('click', (ev) => {
    ev.stopPropagation();
    copySVGCode(item, btnCopy);
  });

  actions.appendChild(btnFav);
  actions.appendChild(btnOpen);
  actions.appendChild(btnEdit);
  actions.appendChild(btnCopy);

  return actions;
}

export function populateCategoryFilter(dropdownElement) {
  if (!dropdownElement) return;

  const menu = dropdownElement.querySelector('.dropdown-menu');
  if (!menu) return;

  const categories = getUniqueCategories();

  // Clear existing options
  menu.innerHTML = '';

  // Add "All Categories" option
  const allOption = document.createElement('li');
  allOption.setAttribute('role', 'option');
  allOption.setAttribute('data-value', '');
  allOption.setAttribute('aria-selected', 'true');
  allOption.setAttribute('tabindex', '0');
  allOption.className = 'is-selected';
  allOption.textContent = 'Todas as categorias';
  menu.appendChild(allOption);

  // Add category options with icons
  categories.forEach(cat => {
    const option = document.createElement('li');
    option.setAttribute('role', 'option');
    option.setAttribute('data-value', escapeHtml(cat));
    option.setAttribute('aria-selected', 'false');
    option.setAttribute('tabindex', '0');

    // Add icon
    const iconSvg = getCategoryIconElement(cat, 18);
    if (iconSvg) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'dropdown-item-icon';
      iconWrapper.appendChild(iconSvg);
      option.appendChild(iconWrapper);
    }

    // Add text
    const textNode = document.createTextNode(escapeHtml(cat));
    option.appendChild(textNode);

    menu.appendChild(option);
  });
}

export default {
  initGallery,
  renderGallery,
  populateCategoryFilter
};
