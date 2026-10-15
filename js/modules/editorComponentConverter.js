import { parse } from './editorSvgCore.js';

const nativeNames = {
  svg: 'Svg',
  g: 'G',
  path: 'Path',
  rect: 'Rect',
  circle: 'Circle',
  ellipse: 'Ellipse',
  line: 'Line',
  polyline: 'Polyline',
  polygon: 'Polygon',
  text: 'Text',
  tspan: 'TSpan',
  textPath: 'TextPath',
  defs: 'Defs',
  use: 'Use',
  symbol: 'Symbol',
  clipPath: 'ClipPath',
  mask: 'Mask',
  pattern: 'Pattern',
  linearGradient: 'LinearGradient',
  radialGradient: 'RadialGradient',
  stop: 'Stop',
  marker: 'Marker',
  image: 'Image',
  filter: 'Filter',
  feBlend: 'FeBlend',
  feColorMatrix: 'FeColorMatrix',
  feComponentTransfer: 'FeComponentTransfer',
  feComposite: 'FeComposite',
  feConvolveMatrix: 'FeConvolveMatrix',
  feDiffuseLighting: 'FeDiffuseLighting',
  feDisplacementMap: 'FeDisplacementMap',
  feDistantLight: 'FeDistantLight',
  feDropShadow: 'FeDropShadow',
  feFlood: 'FeFlood',
  feFuncA: 'FeFuncA',
  feFuncB: 'FeFuncB',
  feFuncG: 'FeFuncG',
  feFuncR: 'FeFuncR',
  feGaussianBlur: 'FeGaussianBlur',
  feImage: 'FeImage',
  feMerge: 'FeMerge',
  feMergeNode: 'FeMergeNode',
  feMorphology: 'FeMorphology',
  feOffset: 'FeOffset',
  fePointLight: 'FePointLight',
  feSpecularLighting: 'FeSpecularLighting',
  feSpotLight: 'FeSpotLight',
  feTile: 'FeTile',
  feTurbulence: 'FeTurbulence',
};
export function reactAttribute(name) {
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  const special = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    'xlink:href': 'xlinkHref',
    'xmlns:xlink': 'xmlnsXlink',
    'xml:space': 'xmlSpace',
    'xml:lang': 'xmlLang',
    'xml:base': 'xmlBase',
  };
  return special[name] || name.replace(/[-:]([a-z])/g, (_, letter) => letter.toUpperCase());
}
export function convertComponent(
  source,
  { native = false, typescript = false, singleQuotes = false, stripSemicolons = false } = {},
) {
  const doc = parse(source),
    used = new Set();
  const quote = singleQuotes ? "'" : '"';
  const literal = (value) =>
    quote +
    String(value)
      .replace(/\\/g, '\\\\')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(new RegExp(quote, 'g'), '\\' + quote)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029') +
    quote;
  const semi = stripSemicolons ? '' : ';';
  function element(node, level = 1) {
    const pad = '  '.repeat(level),
      root = node === doc.documentElement;
    if (native && ['title', 'desc', 'metadata'].includes(node.localName)) return '';
    if (native && !nativeNames[node.localName])
      throw new Error(`React Native: <${node.localName}> is not supported by this converter.`);
    const name = native ? nativeNames[node.localName] : node.tagName;
    if (native && !root) used.add(name);
    const attributes = [];
    for (const attribute of node.attributes) {
      if (native && /^(xmlns|xml:|class)/.test(attribute.name)) continue;
      const key = reactAttribute(attribute.name);
      if (attribute.name === 'style') {
        const holder = document.createElement('span');
        holder.setAttribute('style', attribute.value);
        const style = holder.style;
        const entries = [];
        for (let i = 0; i < style.length; i++) {
          const property = style[i],
            jsName = property.startsWith('--')
              ? property
              : property
                  .replace(/^-ms-/, 'ms-')
                  .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          entries.push(`${literal(jsName)}: ${literal(style.getPropertyValue(property))}`);
        }
        attributes.push(`style={{ ${entries.join(', ')} }}`);
      } else attributes.push(`${key}={${literal(attribute.value)}}`);
    }
    if (root) attributes.push('{...props}');
    const open = pad + '<' + name + (attributes.length ? ' ' + attributes.join(' ') : '');
    const children = [];
    for (const child of node.childNodes) {
      if (child.nodeType === 1) {
        const result = element(child, level + 1);
        if (result) children.push(result);
      } else if (
        [3, 4].includes(child.nodeType) &&
        (child.textContent.trim() ||
          ['text', 'tspan', 'textPath', 'style'].includes(node.localName))
      )
        children.push('  '.repeat(level + 1) + '{' + literal(child.textContent) + '}');
    }
    return children.length
      ? open + '>\n' + children.join('\n') + '\n' + pad + '</' + name + '>'
      : open + ' />';
  }
  const jsx = element(doc.documentElement);
  let imports = `import * as React from ${literal('react')}${semi}\n`;
  if (native) {
    imports += `import Svg${used.size ? ', { ' + [...used].sort().join(', ') + ' }' : ''} from ${literal('react-native-svg')}${semi}\n`;
    if (typescript)
      imports += `import type { SvgProps } from ${literal('react-native-svg')}${semi}\n`;
  } else if (typescript) imports += `import type { SVGProps } from ${literal('react')}${semi}\n`;
  const props = typescript
    ? `(props: ${native ? 'SvgProps' : 'SVGProps<SVGSVGElement>'})`
    : '(props)';
  return (
    imports +
    `\nconst SVGComponent = ${props} => (\n${jsx}\n)${semi}\n\nexport default SVGComponent${semi}\n`
  );
}
