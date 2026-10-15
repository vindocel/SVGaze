import { xmlParser } from '../vendor/xml-parser.js';

// Use the XML grammar, so quoted >, comments, CDATA and nested/repeated tags
// cannot shift the relationship between rendered elements and source ranges.
export function sourceElements(source) {
  const elements = [];
  xmlParser.parse(source).iterate({
    enter(node) {
      if (node.name !== 'Element') return;
      const tag = node.node.firstChild;
      const name = tag?.getChild('TagName');
      if (!name) return;
      elements.push({
        index: elements.length,
        name: source.slice(name.from, name.to),
        from: node.from,
        to: node.to,
        openTo: tag.to,
      });
    },
  });
  return elements;
}

export function elementAtPosition(elements, position) {
  let match = null;
  for (const element of elements)
    if (
      element.from <= position &&
      position < element.to &&
      (!match || element.to - element.from < match.to - match.from)
    )
      match = element;
  return match;
}

export function proportionalSize(width, height, axis, value) {
  const amount = Number(value);
  if (
    value === '' ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isFinite(width / height) ||
    width <= 0 ||
    height <= 0
  )
    return null;
  const round = (n) => Number(n.toFixed(4));
  return axis === 'width'
    ? { w: amount, h: round((amount * height) / width) }
    : { w: round((amount * width) / height), h: amount };
}

export function previewDocument(source, elements) {
  const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = doc.documentElement;
  if (root.localName !== 'svg' || doc.querySelector('parsererror')) return '';
  const nodes = [root, ...root.querySelectorAll('*')];
  nodes.forEach((node, index) => {
    const range = elements[index];
    if (range) node.setAttribute('data-studio-key', range.index);
    for (const attr of [...node.attributes]) {
      if (/^on/i.test(attr.name) || attr.name === 'tabindex') node.removeAttribute(attr.name);
      if (
        /^(href|xlink:href)$/i.test(attr.name) &&
        !attr.value.startsWith('#') &&
        !/^data:image\//i.test(attr.value)
      )
        node.removeAttribute(attr.name);
    }
  });
  for (const node of root.querySelectorAll('script,iframe,object,embed,base,meta,link'))
    node.remove();
  root.setAttribute(
    'style',
    (root.getAttribute('style') || '') + ';width:100%!important;height:100%!important;',
  );
  const markup = new XMLSerializer().serializeToString(root);
  return `<!doctype html><html><head><meta name="color-scheme" content="light"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent!important;color-scheme:light}body{cursor:grab;user-select:none}body>svg{display:block}svg *{cursor:inherit!important}</style></head><body>${markup}</body></html>`;
}
