import { png, download } from './editorSvgCore.js';

export function validateRasterSize(w, h, format = 'PNG') {
  if (
    !Number.isInteger(w) ||
    !Number.isInteger(h) ||
    w < 1 ||
    h < 1 ||
    w > 16384 ||
    h > 16384 ||
    w * h > 64000000
  )
    throw new Error('Image dimensions: 1–16384 px, maximum 64 megapixels.');
  if (format === 'ICO' && (w > 256 || h > 256)) throw new Error('ICO: maximum 256 × 256 px.');
}
export async function asIco(blob, w, h) {
  validateRasterSize(w, h, 'ICO');
  const bytes = await blob.arrayBuffer(),
    header = new Uint8Array(22),
    view = new DataView(header.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  header[6] = w === 256 ? 0 : w;
  header[7] = h === 256 ? 0 : h;
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, bytes.byteLength, true);
  view.setUint32(18, 22, true);
  return new Blob([header, bytes], { type: 'image/x-icon' });
}
export async function rasterize(
  source,
  { width, height, format = 'PNG', background = 'transparent', quality = 0.92 },
) {
  validateRasterSize(width, height, format);
  const blob = await png(
    source,
    width,
    height,
    format === 'JPEG' && background === 'transparent' ? '#ffffff' : background,
  );
  if (format === 'PNG') return blob;
  if (format === 'ICO') return asIco(blob, width, height);
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    const mime = format === 'JPEG' ? 'image/jpeg' : 'image/webp';
    const result = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
    if (!result || result.type !== mime) throw new Error('This browser cannot export ' + format);
    return result;
  } finally {
    bitmap.close();
  }
}
export async function faviconSet(source) {
  const { zipSync, strToU8 } = await import('../vendor/zip.js');
  const files = {};
  for (const [name, size] of [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
  ])
    files[name] = new Uint8Array(await (await png(source, size, size)).arrayBuffer());
  files['favicon.ico'] = new Uint8Array(
    await (await asIco(await png(source, 32, 32), 32, 32)).arrayBuffer(),
  );
  files['favicon.svg'] = strToU8(source);
  files['site.webmanifest'] = strToU8(
    JSON.stringify(
      {
        name: 'SVGaze icon',
        icons: [
          { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        display: 'standalone',
      },
      null,
      2,
    ),
  );
  files['README.txt'] = strToU8(
    'Put these files in your public directory and link favicon.ico, apple-touch-icon.png and site.webmanifest from your HTML head.',
  );
  download(zipSync(files), 'favicons.zip', 'application/zip');
}
