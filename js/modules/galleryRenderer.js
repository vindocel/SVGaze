/**
 * SVGaze - Gallery Renderer
 * Render the SVG gallery grid with categories and badges
 */

import { appState } from '../state.js';
import { escapeHtml } from './utils.js';
import { getFilteredItems, getUniqueCategories } from './filterManager.js';
import { toggleFavorite, isFavorite } from './favoriteManager.js';
import { parseAndSanitizeSVG, ensureViewBox, applyCurrentColorToSVG, prepareSVGForDisplay } from './svgProcessor.js';
import { openModal } from './modalManager.js';
import { copySVGCode, downloadSVG } from './clipboardManager.js';
import { getSVGText } from './svgProcessor.js';

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

  // Update count
  if (countSpan) {
    countSpan.textContent = visible.length;
  }

  // Update category name
  if (catNameSpan) {
    catNameSpan.textContent = appState.filters.category || 'Todas';
  }

  // No results
  if (visible.length === 0 && appState.allItems.length > 0) {
    gridElement.innerHTML = '<div class="card" style="grid-column:1/-1;padding:18px">Nenhum resultado encontrado.</div>';
    return;
  }

  // Render items grouped by category
  let lastCategory = null;

  for (const item of visible) {
    // Add category header when category changes
    if (item.category !== lastCategory && !appState.filters.category) {
      lastCategory = item.category;
      const categoryHeader = createCategoryHeader(item.category, visible);
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

  // Prepare SVG for display
  const svgEl = svgElement.cloneNode(true);
  ensureViewBox(svgEl);
  svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svgEl.style.overflow = 'visible';
  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');
  applyCurrentColorToSVG(svgEl);

  // Store processed element
  item.svgElement = svgEl.cloneNode(true);

  // Create wrapper
  const wrap = document.createElement('div');
  wrap.className = 'svg-wrap';
  const size = appState.ui.selectedSize;
  wrap.style.maxWidth = `${size}px`;
  wrap.style.maxHeight = `${size}px`;

  const displaySvg = prepareSVGForDisplay(
    item.svgElement,
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
  });

  // Open modal button
  const btnOpen = document.createElement('button');
  btnOpen.className = 'small-btn primary';
  btnOpen.textContent = 'Abrir';
  btnOpen.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openModal(item);
  });

  // Copy button
  const btnCopy = document.createElement('button');
  btnCopy.className = 'small-btn';
  btnCopy.textContent = 'Copiar';
  btnCopy.addEventListener('click', (ev) => {
    ev.stopPropagation();
    copySVGCode(item, btnCopy);
  });

  actions.appendChild(btnFav);
  actions.appendChild(btnOpen);
  actions.appendChild(btnCopy);

  return actions;
}

export function populateCategoryFilter(selectElement) {
  if (!selectElement) return;

  const categories = getUniqueCategories();
  const options = ['<option value="">Todas as categorias</option>'];

  categories.forEach(cat => {
    options.push(`<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`);
  });

  selectElement.innerHTML = options.join('');
}

export default {
  initGallery,
  renderGallery,
  populateCategoryFilter
};
