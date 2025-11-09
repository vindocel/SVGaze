/**
 * SVGaze - Custom Dropdown Manager
 * Manages custom dropdown component with icon support
 */

let currentDropdown = null;
let selectedIndex = -1;

/**
 * Initialize a custom dropdown
 * @param {HTMLElement} dropdownElement - The .custom-dropdown element
 * @param {Function} onSelect - Callback when item is selected (value, text)
 */
export function initDropdown(dropdownElement, onSelect) {
  if (!dropdownElement) return;

  const trigger = dropdownElement.querySelector('.dropdown-trigger');
  const menu = dropdownElement.querySelector('.dropdown-menu');

  if (!trigger || !menu) return;

  // Toggle dropdown on trigger click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dropdownElement);
  });

  // Handle item clicks
  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[role="option"]');
    if (item) {
      const value = item.getAttribute('data-value');
      const text = item.textContent.trim();
      selectItem(dropdownElement, item, value, text, onSelect);
    }
  });

  // Keyboard navigation
  trigger.addEventListener('keydown', (e) => {
    handleTriggerKeydown(e, dropdownElement);
  });

  menu.addEventListener('keydown', (e) => {
    handleMenuKeydown(e, dropdownElement, onSelect);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (currentDropdown === dropdownElement && !dropdownElement.contains(e.target)) {
      closeDropdown(dropdownElement);
    }
  });
}

/**
 * Toggle dropdown open/close
 */
export function toggleDropdown(dropdownElement) {
  const isOpen = dropdownElement.classList.contains('is-open');

  // Close any other open dropdown
  if (currentDropdown && currentDropdown !== dropdownElement) {
    closeDropdown(currentDropdown);
  }

  if (isOpen) {
    closeDropdown(dropdownElement);
  } else {
    openDropdown(dropdownElement);
  }
}

/**
 * Open dropdown
 */
export function openDropdown(dropdownElement) {
  const trigger = dropdownElement.querySelector('.dropdown-trigger');
  const menu = dropdownElement.querySelector('.dropdown-menu');

  dropdownElement.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
  menu.style.display = 'block';

  currentDropdown = dropdownElement;
  selectedIndex = -1;

  // Focus first item
  requestAnimationFrame(() => {
    const firstItem = menu.querySelector('[role="option"]');
    if (firstItem) {
      firstItem.focus();
      selectedIndex = 0;
    }
  });
}

/**
 * Close dropdown
 */
export function closeDropdown(dropdownElement) {
  const trigger = dropdownElement.querySelector('.dropdown-trigger');
  const menu = dropdownElement.querySelector('.dropdown-menu');

  dropdownElement.classList.remove('is-open');
  trigger.setAttribute('aria-expanded', 'false');
  menu.style.display = 'none';

  if (currentDropdown === dropdownElement) {
    currentDropdown = null;
  }
  selectedIndex = -1;
}

/**
 * Select an item
 */
function selectItem(dropdownElement, item, value, text, onSelect) {
  const trigger = dropdownElement.querySelector('.dropdown-trigger');
  const menu = dropdownElement.querySelector('.dropdown-menu');

  // Update trigger text (extract only text, not icon)
  const textNode = Array.from(item.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
  const displayText = textNode ? textNode.textContent.trim() : text;
  trigger.textContent = displayText;

  // Update selected state
  menu.querySelectorAll('[role="option"]').forEach(opt => {
    opt.setAttribute('aria-selected', 'false');
    opt.classList.remove('is-selected');
  });
  item.setAttribute('aria-selected', 'true');
  item.classList.add('is-selected');

  // Close dropdown
  closeDropdown(dropdownElement);

  // Trigger callback
  if (onSelect) {
    onSelect(value, displayText);
  }

  // Return focus to trigger
  trigger.focus();
}

/**
 * Handle keyboard on trigger
 */
function handleTriggerKeydown(e, dropdownElement) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
    e.preventDefault();
    openDropdown(dropdownElement);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    openDropdown(dropdownElement);
  }
}

/**
 * Handle keyboard navigation in menu
 */
function handleMenuKeydown(e, dropdownElement, onSelect) {
  const menu = dropdownElement.querySelector('.dropdown-menu');
  const items = Array.from(menu.querySelectorAll('[role="option"]'));

  if (items.length === 0) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      items[selectedIndex].focus();
      break;

    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      items[selectedIndex].focus();
      break;

    case 'Enter':
    case ' ':
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        const item = items[selectedIndex];
        const value = item.getAttribute('data-value');
        const text = item.textContent.trim();
        selectItem(dropdownElement, item, value, text, onSelect);
      }
      break;

    case 'Escape':
      e.preventDefault();
      closeDropdown(dropdownElement);
      dropdownElement.querySelector('.dropdown-trigger').focus();
      break;

    case 'Tab':
      closeDropdown(dropdownElement);
      break;
  }
}

/**
 * Get selected value
 */
export function getSelectedValue(dropdownElement) {
  const selected = dropdownElement.querySelector('[aria-selected="true"]');
  return selected ? selected.getAttribute('data-value') : '';
}

/**
 * Set selected value programmatically
 */
export function setSelectedValue(dropdownElement, value) {
  const menu = dropdownElement.querySelector('.dropdown-menu');
  const item = menu.querySelector(`[data-value="${value}"]`);

  if (item) {
    const trigger = dropdownElement.querySelector('.dropdown-trigger');
    const textNode = Array.from(item.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    const displayText = textNode ? textNode.textContent.trim() : item.textContent.trim();

    trigger.textContent = displayText;

    // Update selected state
    menu.querySelectorAll('[role="option"]').forEach(opt => {
      opt.setAttribute('aria-selected', 'false');
      opt.classList.remove('is-selected');
    });
    item.setAttribute('aria-selected', 'true');
    item.classList.add('is-selected');
  }
}

export default {
  initDropdown,
  toggleDropdown,
  openDropdown,
  closeDropdown,
  getSelectedValue,
  setSelectedValue
};
