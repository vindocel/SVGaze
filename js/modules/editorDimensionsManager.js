import { getEditorContent, setEditorContent } from './editorCodeManager.js';
import { dimensions, resize } from './editorSvgCore.js';
import { proportionalSize } from './editorSvgMapper.js';
let modal,
  width,
  height,
  lock,
  label,
  ratio = 1,
  base = { w: 400, h: 400 };
export function initDimensionsManager() {
  modal = document.getElementById('dimensionsModal');
  width = document.getElementById('modalDimensionWidth');
  height = document.getElementById('modalDimensionHeight');
  lock = document.getElementById('proportionalToggle');
  label = document.getElementById('dimensionsLabel');
  if (!modal) return;
  width.step = height.step = 'any';
  width.min = height.min = '0.0001';
  document.getElementById('dimensionsBtn').onclick = () => {
    sync(true);
    const r = document.getElementById('dimensionsBtn').getBoundingClientRect();
    modal.style.left = Math.min(r.left, window.innerWidth - 280) + 'px';
    modal.style.top = r.bottom + 4 + 'px';
    modal.classList.add('active');
    width.focus();
    width.select();
  };
  document.getElementById('dimensionsModalClose').onclick = () => modal.classList.remove('active');
  document.getElementById('dimensionsApply').onclick = () => modal.classList.remove('active');
  width.oninput = () => change('width', width.value);
  height.oninput = () => change('height', height.value);
  lock.onchange = () => {
    const w = Number(width.value),
      h = Number(height.value);
    if (w > 0 && h > 0) {
      base = { w, h };
      ratio = w / h;
    }
  };
  window.addEventListener('editor-code-changed', () => sync(false));
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !document.getElementById('dimensionsBtn').contains(e.target))
      modal.classList.remove('active');
  });
  modal.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') modal.classList.remove('active');
  };
  sync(true);
}
function sync(inputs) {
  try {
    const d = dimensions(getEditorContent());
    label.textContent = `${d.w}px × ${d.h}px`;
    if (inputs || !modal.classList.contains('active')) {
      base = { w: d.w, h: d.h };
      ratio = d.w / d.h;
      width.value = d.w;
      height.value = d.h;
    }
  } catch {
    label.textContent = '—';
  }
}
function change(axis, value) {
  const amount = Number(value);
  if (value === '' || !Number.isFinite(amount) || amount <= 0) return;
  const next = lock.checked
    ? proportionalSize(base.w, base.h, axis, value)
    : { w: Number(width.value), h: Number(height.value) };
  if (!next || next.w <= 0 || next.h <= 0) return;
  if (lock.checked) {
    if (axis === 'width') height.value = next.h;
    else width.value = next.w;
  }
  try {
    setEditorContent(resize(getEditorContent(), next.w, next.h));
  } catch {}
}
export function getCurrentDimensions() {
  return {
    width: Number(width?.value) || base.w,
    height: Number(height?.value) || base.h,
    aspectRatio: ratio,
  };
}
export function setDimensions(w, h) {
  base = { w, h };
  ratio = w / h;
  if (width) width.value = w;
  if (height) height.value = h;
  if (label) label.textContent = `${w}px × ${h}px`;
}
