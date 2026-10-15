import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';
const root = path.resolve(import.meta.dirname, '..');
const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
let count = 0;
async function exists(file) {
  await fs.access(file);
}
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (url.startsWith('#') || url.startsWith('data:')) continue;
  if (/^https?:\/\//.test(url)) throw new Error('External startup dependency: ' + url);
  if (url.startsWith('/'))
    throw new Error('Absolute path is not compatible with project GitHub Pages: ' + url);
  await exists(path.join(root, url.split('?')[0]));
}
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (file.endsWith('.js')) {
      const source = await fs.readFile(file, 'utf8');
      const tree = parse(source, {
        sourceType:
          file.includes(path.sep + 'vendor' + path.sep) && /codemirror|prism/.test(entry.name)
            ? 'script'
            : 'module',
      });
      count++;
      const imports = [];
      function visit(node) {
        if (!node || typeof node !== 'object') return;
        if (
          ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(
            node.type,
          ) &&
          node.source
        )
          imports.push(node.source.value);
        if (
          node.type === 'NewExpression' &&
          node.callee.name === 'URL' &&
          node.arguments[0]?.type === 'StringLiteral'
        )
          imports.push(node.arguments[0].value);
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'Import' &&
          node.arguments[0]?.type === 'StringLiteral'
        )
          imports.push(node.arguments[0].value);
        for (const value of Object.values(node)) {
          if (Array.isArray(value)) value.forEach(visit);
          else if (value && typeof value === 'object') visit(value);
        }
      }
      visit(tree);
      for (const specifier of imports) {
        if (!specifier.startsWith('.'))
          throw new Error('Non-static dependency ' + specifier + ' in ' + file);
        await exists(path.resolve(path.dirname(file), specifier));
      }
    }
  }
}
await walk(path.join(root, 'js'));
await walk(path.join(root, 'i18n'));
console.log(
  `${count} JavaScript files checked; all browser imports and startup assets are local and relative.`,
);
