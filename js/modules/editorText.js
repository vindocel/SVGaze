import { getCurrentLanguage } from '../../i18n/i18n.js';
export const text = (pt, en) => (getCurrentLanguage() === 'en-US' ? en : pt);
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
