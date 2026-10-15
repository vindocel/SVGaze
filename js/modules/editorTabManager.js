import { getEditorContent } from './editorCodeManager.js';
import { convertComponent } from './editorComponentConverter.js';
import { dimensions, parse, dataUri, download } from './editorSvgCore.js';
import { formatSvg } from './editorSvgoManager.js';
import { rasterize, faviconSet } from './editorRasterExport.js';
import { showToast } from './toast.js';
import { text } from './editorText.js';
import { appState } from '../state.js';

let currentTab = 'preview',
  timer,
  revision = 0,
  raster = null,
  rasterUrl = null,
  intrinsic = null;
const settings = {
  react: { typescript: false, singleQuotes: false, stripSemicolons: false },
  'react-native': { typescript: false, singleQuotes: false, stripSemicolons: false },
};
const rasterOptions = {
  width: 400,
  height: 400,
  format: 'PNG',
  background: 'transparent',
  quality: 0.92,
};
const size = (n) => (n < 1024 ? n + ' B' : (n / 1024).toFixed(2) + ' KB');
const byteLength = (s) => new TextEncoder().encode(s).length;
export function initTabManager() {
  document
    .querySelectorAll('.export-tab')
    .forEach((button) => (button.onclick = () => switchTab(button.dataset.tab)));
  for (const [tab, prefix] of [
    ['react', 'react'],
    ['react-native', 'reactNative'],
  ]) {
    const button = document.getElementById(prefix + 'Settings'),
      menu = document.getElementById(prefix + 'SettingsDropdown');
    if (button && menu) {
      button.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      };
      menu.onclick = (e) => e.stopPropagation();
    }
    for (const [id, key] of [
      ['Typescript', 'typescript'],
      ['SingleQuotes', 'singleQuotes'],
      ['StripSemicolons', 'stripSemicolons'],
    ]) {
      const input = document.getElementById(prefix + id);
      if (input)
        input.onchange = () => {
          settings[tab][key] = input.checked;
          refreshCurrentTab();
        };
    }
  }
  document.addEventListener('click', () =>
    document
      .querySelectorAll('.settings-dropdown')
      .forEach((menu) => menu.classList.remove('active')),
  );
  for (const [id, tab] of [
    ['copyReactCode', 'react'],
    ['copyReactNativeCode', 'react-native'],
  ])
    document
      .getElementById(id)
      ?.addEventListener('click', () =>
        copy(
          document.querySelector(
            tab === 'react' ? '#reactCodeOutput code' : '#reactNativeCodeOutput code',
          )?.textContent || '',
        ),
      );
  for (const [id, tab] of [
    ['downloadReactJSX', 'react'],
    ['downloadReactNativeJSX', 'react-native'],
  ])
    document.getElementById(id)?.addEventListener('click', () => {
      const code =
        document.querySelector(
          tab === 'react' ? '#reactCodeOutput code' : '#reactNativeCodeOutput code',
        )?.textContent || '';
      if (code)
        download(code, 'SVGComponent.' + (settings[tab].typescript ? 'tsx' : 'jsx'), 'text/plain');
    });
  document.querySelectorAll('.data-uri-copy-btn').forEach(
    (button) =>
      (button.onclick = () => {
        const ids = {
          minified: 'minifiedDataURI',
          base64: 'base64DataURI',
          encoded: 'encodedDataURI',
        };
        copy(document.getElementById(ids[button.dataset.copy])?.textContent || '');
      }),
  );
  addRasterControls();
  window.addEventListener('editor-code-changed', () => {
    clearTimeout(timer);
    revision++;
    invalidateRaster();
    if (currentTab !== 'preview') timer = setTimeout(refreshCurrentTab, 150);
  });
}
function switchTab(name) {
  currentTab = name;
  revision++;
  document
    .querySelectorAll('.export-tab')
    .forEach((button) => button.classList.toggle('active', button.dataset.tab === name));
  document
    .querySelectorAll('.tab-content')
    .forEach((panel) =>
      panel.classList.toggle(
        'active',
        panel.id.slice(3).toLowerCase() === name.replace('-', '').toLowerCase(),
      ),
    );
  refreshCurrentTab();
}
export function getCurrentTab() {
  return currentTab;
}
export async function refreshCurrentTab() {
  if (currentTab === 'preview') return;
  const source = getEditorContent(),
    request = ++revision;
  try {
    parse(source);
    if (settings[currentTab]) {
      const code = convertComponent(source, {
          ...settings[currentTab],
          native: currentTab === 'react-native',
        }),
        output = document.querySelector(
          currentTab === 'react' ? '#reactCodeOutput code' : '#reactNativeCodeOutput code',
        );
      output.className = settings[currentTab].typescript ? 'language-tsx' : 'language-jsx';
      output.textContent = code;
      window.Prism?.highlightElement(output);
      return;
    }
    if (currentTab === 'data-uri') {
      const minified = await formatSvg(source, { pretty: false });
      if (request !== revision) return;
      const values = [
        ['minified', dataUri(minified)],
        ['base64', dataUri(source, true)],
        ['encoded', dataUri(source)],
      ];
      for (const [name, value] of values) {
        document.getElementById(
          name === 'minified'
            ? 'minifiedDataURI'
            : name === 'base64'
              ? 'base64DataURI'
              : 'encodedDataURI',
        ).textContent = value;
        document.getElementById(name + 'Size').textContent = size(byteLength(value));
      }
    }
    if (currentTab === 'png') await renderRaster(source, request);
  } catch (error) {
    if (request !== revision) return;
    if (settings[currentTab])
      document.querySelector(
        currentTab === 'react' ? '#reactCodeOutput code' : '#reactNativeCodeOutput code',
      ).textContent = '// ' + error.message;
    if (currentTab === 'data-uri')
      for (const id of [
        'minifiedDataURI',
        'base64DataURI',
        'encodedDataURI',
        'minifiedSize',
        'base64Size',
        'encodedSize',
      ])
        document.getElementById(id).textContent = '';
    if (currentTab === 'png') {
      raster = null;
      document.getElementById('exportPNGButton').disabled = true;
      const p = document.createElement('p');
      p.textContent = error.message;
      document.getElementById('pngPreviewArea').replaceChildren(p);
    }
  }
}
async function copy(value) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    showToast(text('Copiado', 'Copied'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}
function syncRasterDimensions(source) {
  const d = dimensions(source);
  if (!intrinsic || intrinsic.w !== d.w || intrinsic.h !== d.h) {
    intrinsic = d;
    const scale = Number(document.getElementById('pngSizeSelector').value) || 1;
    rasterOptions.width = Math.round(d.w * scale);
    rasterOptions.height = Math.round(d.h * scale);
    updateRasterFields();
  }
}
function updateRasterFields() {
  document.getElementById('rasterWidth').value = rasterOptions.width;
  document.getElementById('rasterHeight').value = rasterOptions.height;
}
function invalidateRaster() {
  raster = null;
  const button = document.getElementById('exportPNGButton'),
    copy = document.getElementById('rasterCopy');
  if (button) button.disabled = true;
  if (copy) copy.disabled = true;
}
async function renderRaster(source, request) {
  syncRasterDimensions(source);
  raster = null;
  document.getElementById('exportPNGButton').disabled = true;
  document.getElementById('rasterCopy').disabled = true;
  const result = await rasterize(source, { ...rasterOptions });
  if (request !== revision) return;
  raster = { source, options: { ...rasterOptions }, blob: result };
  if (rasterUrl) URL.revokeObjectURL(rasterUrl);
  rasterUrl = URL.createObjectURL(result);
  const image = new Image();
  image.alt = text('Prévia da imagem exportada', 'Exported image preview');
  // ICO is a valid download, while PNG is a portable preview across browsers.
  image.src = rasterOptions.format === 'ICO' ? dataUri(source) : rasterUrl;
  document.getElementById('pngPreviewArea').replaceChildren(image);
  document.getElementById('rasterSize').textContent = size(result.size);
  document.getElementById('exportPNGButton').disabled = false;
  document.getElementById('rasterCopy').disabled = false;
}
function addRasterControls() {
  const panel = document.getElementById('tabPNG'),
    controls = document.createElement('div');
  controls.className = 'svgaze-raster-controls';
  controls.innerHTML = `<label>${text('Formato', 'Format')}<select id="rasterFormat">${['PNG', 'JPEG', 'WebP', 'ICO'].map((format) => `<option>${format}</option>`).join('')}</select></label><label>W<input type="number" id="rasterWidth" min="1" max="16384" step="1" value="400" aria-label="${text('Largura de exportação', 'Export width')}"></label><label>H<input type="number" id="rasterHeight" min="1" max="16384" step="1" value="400" aria-label="${text('Altura de exportação', 'Export height')}"></label><label>${text('Fundo', 'Background')}<select id="rasterBackground"><option value="transparent">${text('Transparente', 'Transparent')}</option><option value="#ffffff">${text('Branco', 'White')}</option><option value="#000000">${text('Preto', 'Black')}</option></select></label><label class="svgaze-quality">${text('Qualidade', 'Quality')}<input type="range" id="rasterQuality" min=".1" max="1" step=".01" value=".92"></label>`;
  panel.prepend(controls);
  const select = document.getElementById('pngSizeSelector');
  select.replaceChildren();
  for (const value of [0.5, 1, 2, 4, 8, 16]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value + 'x';
    option.selected = value === 1;
    select.append(option);
  }
  select.onchange = () => {
    try {
      const d = dimensions(getEditorContent()),
        scale = Number(select.value);
      rasterOptions.width = Math.round(d.w * scale);
      rasterOptions.height = Math.round(d.h * scale);
      updateRasterFields();
      refreshCurrentTab();
    } catch {}
  };
  for (const [id, axis, other] of [
    ['rasterWidth', 'width', 'height'],
    ['rasterHeight', 'height', 'width'],
  ])
    document.getElementById(id).oninput = (e) => {
      const value = Number(e.target.value);
      if (!Number.isInteger(value) || value < 1) return;
      const ratio = intrinsic ? intrinsic.w / intrinsic.h : 1;
      rasterOptions[axis] = value;
      rasterOptions[other] = Math.max(
        1,
        Math.round(axis === 'width' ? value / ratio : value * ratio),
      );
      document.getElementById(other === 'width' ? 'rasterWidth' : 'rasterHeight').value =
        rasterOptions[other];
      clearTimeout(timer);
      revision++;
      invalidateRaster();
      timer = setTimeout(refreshCurrentTab, 180);
    };
  document.getElementById('rasterFormat').onchange = (e) => {
    rasterOptions.format = e.target.value;
    if (e.target.value === 'ICO') {
      rasterOptions.width = 256;
      rasterOptions.height = 256;
      updateRasterFields();
    }
    const label = document.querySelector('#exportPNGButton span');
    label.removeAttribute('data-i18n');
    label.textContent = text('Baixar ', 'Download ') + rasterOptions.format;
    refreshCurrentTab();
  };
  document.getElementById('rasterBackground').onchange = (e) => {
    rasterOptions.background = e.target.value;
    refreshCurrentTab();
  };
  document.getElementById('rasterQuality').oninput = (e) => {
    rasterOptions.quality = Number(e.target.value);
    clearTimeout(timer);
    revision++;
    invalidateRaster();
    timer = setTimeout(refreshCurrentTab, 180);
  };
  document.getElementById('pngCheckered').onclick = (e) => {
    document.getElementById('pngPreviewArea').classList.toggle('show-checkered');
    e.currentTarget.classList.toggle('active');
  };
  const right = panel.querySelector('.footer-right'),
    copyButton = document.createElement('button');
  copyButton.id = 'rasterCopy';
  copyButton.className = 'btn-footer';
  copyButton.textContent = text('Copiar', 'Copy');
  copyButton.disabled = true;
  copyButton.onclick = async () => {
    try {
      if (!raster) return;
      const blob = await rasterize(raster.source, { ...raster.options, format: 'PNG' });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast(text('Imagem copiada', 'Image copied'), 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
  const favicons = document.createElement('button');
  favicons.className = 'btn-footer';
  favicons.textContent = text('Favicons ZIP', 'Favicon set');
  favicons.onclick = async () => {
    try {
      await faviconSet(getEditorContent());
    } catch (error) {
      showToast(error.message, 'error');
    }
  };
  const status = document.createElement('span');
  status.id = 'rasterSize';
  status.className = 'svgaze-hint';
  right.prepend(status, copyButton, favicons);
  document.getElementById('exportPNGButton').onclick = () => {
    if (raster)
      download(
        raster.blob,
        (appState.editor.fileName.replace(/\.svg$/i, '') || 'image') +
          '.' +
          (raster.options.format === 'JPEG' ? 'jpg' : raster.options.format.toLowerCase()),
        raster.blob.type,
      );
  };
}
