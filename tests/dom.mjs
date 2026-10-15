import fs from 'node:fs';
import { JSDOM } from 'jsdom';
export function installDOM({ codeMirror = false, fullPage = false } = {}) {
  const html = fullPage
    ? fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
    : '<!doctype html><div id="root"></div>';
  const dom = new JSDOM(html, {
    url: 'https://example.test/SVGaze/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  for (const key of [
    'window',
    'document',
    'DOMParser',
    'XMLSerializer',
    'MutationObserver',
    'CustomEvent',
    'NodeFilter',
    'HTMLElement',
    'localStorage',
    'sessionStorage',
    'Image',
    'Event',
  ])
    Object.defineProperty(globalThis, key, {
      value: key === 'window' ? window : window[key],
      configurable: true,
      writable: true,
    });
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
  window.focus = () => {};
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  globalThis.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
  globalThis.CSS = {
    supports: (_, value) => /^(#[\da-f]{3,8}|red|white|black|blue|rgba?\([^)]+\))$/i.test(value),
  };
  window.HTMLCanvasElement.prototype.getContext = () => ({
    set fillStyle(value) {
      this.color =
        { white: '#ffffff', black: '#000000', red: '#ff0000', blue: '#0000ff' }[value] || value;
    },
    get fillStyle() {
      return this.color || '#000000';
    },
  });
  window.Range.prototype.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    right: 10,
    bottom: 18,
    width: 10,
    height: 18,
  });
  window.Range.prototype.getClientRects = () => [];
  if (codeMirror)
    window.eval(fs.readFileSync(new URL('../js/vendor/codemirror.js', import.meta.url), 'utf8'));
  return dom;
}
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export async function eventually(predicate, timeout = 3000) {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout)
      throw new Error('Timed out waiting for expected application state.');
    await delay(20);
  }
}
