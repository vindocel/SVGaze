import { appState } from "../state.js";
import { sourceElements, previewDocument } from "./editorSvgMapper.js";
import { dimensions, parse, download } from "./editorSvgCore.js";
import { getEditorContent } from "./editorCodeManager.js";
import { getDefaultColorForTheme } from "./colorManager.js";
import { text } from "./editorText.js";

let stage,
  content,
  frame,
  artboard,
  overlay,
  ranges = [],
  info = { w: 400, h: 400 },
  zoom = 100,
  pan = { x: 0, y: 0 },
  drag = null,
  hover = null,
  selected = null,
  renderTimer;
let initiallyFit = false;
const emit = (name, range) =>
  window.dispatchEvent(new CustomEvent(name, { detail: { range } }));
export function initPreviewManager() {
  stage = document.getElementById("previewContainer");
  content = document.getElementById("previewContent");
  if (!stage || !content) return;
  stage.addEventListener("pointerdown", start);
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointermove", updateCoordinates);
  stage.addEventListener("pointerup", stop);
  stage.addEventListener("pointercancel", cancel);
  stage.addEventListener("dblclick", center);
  stage.addEventListener("wheel", wheel, { passive: false });
  document
    .getElementById("previewZoomIn")
    ?.addEventListener("click", () => setZoom(zoom * 1.2));
  document
    .getElementById("previewZoomOut")
    ?.addEventListener("click", () => setZoom(zoom / 1.2));
  document.getElementById("previewFit")?.addEventListener("click", fit);
  const level = document.getElementById("previewZoomLevel");
  if (level) {
    level.tabIndex = 0;
    level.setAttribute("role", "button");
    level.title = text("Centralizar em 100%", "Center at 100%");
    level.onclick = () => {
      setZoom(100);
      center();
    };
    level.onkeydown = (e) => {
      if (e.key === "Enter") level.click();
    };
  }
  for (const [id, cls, property] of [
    ["previewGrid", "show-grid", "showGrid"],
    ["previewCheckered", "show-checkered", "showCheckered"],
  ])
    document.getElementById(id)?.addEventListener("click", (e) => {
      stage.classList.toggle(cls);
      appState.editor[property] = stage.classList.contains(cls);
      e.currentTarget.classList.toggle("active", appState.editor[property]);
    });
  document
    .getElementById("downloadPreviewSVG")
    ?.addEventListener("click", () => {
      try {
        const source = getEditorContent();
        parse(source);
        download(source, appState.editor.fileName);
      } catch {}
    });
  window.addEventListener("editor-code-changed", () => {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => render(getEditorContent()), 100);
  });
  window.addEventListener("editor-view-shown", () => {
    render(getEditorContent());
    if (!initiallyFit && stage.clientWidth > 0 && stage.clientHeight > 0) {
      initiallyFit = true;
      if (info.w > stage.clientWidth - 64 || info.h > stage.clientHeight - 64)
        fit();
    }
  });
  window.addEventListener("theme-changed", updateTheme);
  window.addEventListener("editor-element-focus", (e) => {
    selected = e.detail.range;
    highlight(hover || selected);
  });
  document.addEventListener("keydown", keys);
  new ResizeObserver(() => highlight(hover || selected)).observe(stage);
  addBackgroundControls();
  render(getEditorContent());
}
function render(source) {
  hover = null;
  selected = null;
  frame = null;
  content.replaceChildren();
  try {
    parse(source);
    info = dimensions(source);
    ranges = sourceElements(source);
    artboard = document.createElement("div");
    artboard.className = "svgaze-artboard";
    frame = document.createElement("iframe");
    frame.className = "svgaze-preview-frame";
    frame.title = text("Preview SVG interativo", "Interactive SVG preview");
    frame.setAttribute("sandbox", "allow-same-origin");
    frame.style.colorScheme = "light";
    frame.style.background = "transparent";
    frame.srcdoc = previewDocument(source, ranges);
    frame.addEventListener("load", connectFrame);
    overlay = document.createElement("div");
    overlay.className = "svgaze-shape-highlight";
    overlay.hidden = true;
    artboard.append(frame, overlay);
    content.append(artboard);
    layout();
    const label = document.getElementById("previewDimensions");
    if (label) label.textContent = `${info.w} × ${info.h}`;
  } catch (error) {
    const p = document.createElement("p");
    p.className = "preview-placeholder";
    p.textContent = source.trim()
      ? error.message
      : text(
          "Abra ou cole um SVG para começar.",
          "Open or paste an SVG to get started.",
        );
    content.append(p);
    ranges = [];
  }
}
function connectFrame() {
  const doc = frame?.contentDocument;
  if (!doc) return;
  updateTheme();
  doc.addEventListener("pointerdown", start);
  doc.addEventListener("pointermove", (e) => {
    updateCoordinates(e);
    if (!drag) {
      const next = rangeFor(e.target);
      if (next !== hover) {
        hover = next;
        highlight(hover || selected);
        emit("svg-element-hover", hover);
      }
    }
    move(e);
  });
  doc.addEventListener("pointerleave", () => {
    if (!drag) {
      hover = null;
      highlight(selected);
      emit("svg-element-hover", null);
    }
  });
  doc.addEventListener("pointerup", stop);
  doc.addEventListener("pointercancel", cancel);
  doc.addEventListener("dblclick", center);
  doc.addEventListener("wheel", wheel, { passive: false });
  doc.addEventListener("keydown", keys);
  doc.addEventListener("click", (e) => e.preventDefault());
  highlight(selected);
}
function rangeFor(node) {
  const target = node?.closest?.("[data-studio-key]");
  return target && target.localName !== "svg"
    ? ranges[Number(target.getAttribute("data-studio-key"))] || null
    : null;
}
function point(event) {
  const r =
    event.view === frame?.contentWindow
      ? frame.getBoundingClientRect()
      : { left: 0, top: 0 };
  return { x: event.clientX + r.left, y: event.clientY + r.top };
}
function start(event) {
  if (event.button !== 0 && event.button !== 1) return;
  event.preventDefault();
  drag = {
    point: point(event),
    pan: { ...pan },
    range: rangeFor(event.target),
    moved: false,
  };
  event.target.setPointerCapture?.(event.pointerId);
  stage.classList.add("svgaze-panning");
}
function move(event) {
  if (!drag) return;
  const p = point(event),
    dx = p.x - drag.point.x,
    dy = p.y - drag.point.y;
  if (Math.hypot(dx, dy) > 3) drag.moved = true;
  if (drag.moved) {
    pan = { x: drag.pan.x + dx, y: drag.pan.y + dy };
    layout();
    if (overlay) overlay.hidden = true;
  }
}
function stop(event) {
  const previous = drag;
  cancel();
  if (previous && !previous.moved) {
    selected = previous.range;
    highlight(selected);
    emit("svg-element-select", selected);
  }
  if (event.target.hasPointerCapture?.(event.pointerId))
    event.target.releasePointerCapture(event.pointerId);
}
function cancel() {
  drag = null;
  stage.classList.remove("svgaze-panning");
}
function layout() {
  if (!artboard) return;
  artboard.style.width = (info.w * zoom) / 100 + "px";
  artboard.style.height = (info.h * zoom) / 100 + "px";
  artboard.style.transform = `translate(calc(-50% + ${pan.x}px),calc(-50% + ${pan.y}px))`;
  const level = document.getElementById("previewZoomLevel");
  if (level) level.textContent = Math.round(zoom) + "%";
  appState.editor.zoom = zoom;
  highlight(hover || selected);
}
function setZoom(value) {
  zoom = Math.max(10, Math.min(5000, Math.round(value)));
  layout();
}
function center() {
  pan = { x: 0, y: 0 };
  layout();
}
function fit() {
  if (!stage) return;
  const toolbarHeight =
    document
      .querySelector(".workbench .preview-footer")
      ?.getBoundingClientRect().height || 0;
  pan = { x: 0, y: -toolbarHeight / 2 };
  setZoom(
    Math.min(
      (stage.clientWidth - 64) / info.w,
      (stage.clientHeight - toolbarHeight - 64) / info.h,
    ) * 100,
  );
}
function wheel(event) {
  event.preventDefault();
  const p = point(event),
    r = stage.getBoundingClientRect(),
    factor = Math.exp(-event.deltaY * 0.0015);
  const next = Math.max(10, Math.min(5000, zoom * factor)),
    ratio = next / zoom;
  const x = p.x - r.left - r.width / 2,
    y = p.y - r.top - r.height / 2;
  pan = { x: x - (x - pan.x) * ratio, y: y - (y - pan.y) * ratio };
  setZoom(next);
}
function keys(event) {
  if (
    appState.currentView !== "editor" ||
    event.target.closest?.(
      'input,textarea,select,[contenteditable="true"],.CodeMirror',
    )
  )
    return;
  if (event.key === "0") {
    setZoom(100);
    center();
  } else if (event.key.toLowerCase() === "f") fit();
  else if (["+", "="].includes(event.key)) setZoom(zoom * 1.2);
  else if (event.key === "-") setZoom(zoom / 1.2);
  else return;
  event.preventDefault();
}
function highlight(range) {
  if (!overlay || !frame?.contentDocument) return;
  const node =
    range &&
    frame.contentDocument.querySelector(`[data-studio-key="${range.index}"]`);
  if (!node) {
    overlay.hidden = true;
    return;
  }
  const rect = node.getBoundingClientRect();
  overlay.hidden = !(rect.width || rect.height);
  Object.assign(overlay.style, {
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  });
  overlay.textContent = "";
  const label = document.createElement("span");
  label.textContent = range.name;
  overlay.append(label);
}
function updateTheme() {
  stage?.setAttribute(
    "data-theme",
    document.documentElement.getAttribute("data-theme") || "light",
  );
  const svg = frame?.contentDocument?.querySelector("svg");
  if (!svg) return;
  try {
    const original = parse(getEditorContent()).documentElement;
    if (
      !original.hasAttribute("color") &&
      !/(?:^|;)\s*color\s*:/i.test(original.getAttribute("style") || "")
    )
      svg.style.color = getDefaultColorForTheme();
  } catch {}
}
function addBackgroundControls() {
  const footer = document.querySelector("#tabPreview .footer-left");
  if (!footer) return;
  const palette = document.createElement("div");
  palette.className = "svgaze-background-swatches";
  palette.setAttribute("role", "group");
  palette.setAttribute(
    "aria-label",
    text("Fundo do preview", "Preview background"),
  );
  for (const [value, label] of [
    ["", text("Tema", "Theme")],
    ["#ffffff", text("Branco", "White")],
    ["#d4d4d4", text("Cinza", "Grey")],
    ["#404040", text("Cinza escuro", "Dark grey")],
    ["#171717", text("Preto", "Black")],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "svgaze-background-swatch";
    button.title = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(value === ""));
    button.style.backgroundColor = value || "var(--card)";
    button.onclick = () => {
      stage.style.backgroundColor = value;
      for (const sibling of palette.children)
        sibling.setAttribute("aria-pressed", String(sibling === button));
    };
    palette.append(button);
  }
  const custom = document.createElement("input");
  custom.type = "color";
  custom.className = "svgaze-background-color";
  custom.title = text("Fundo personalizado", "Custom background");
  custom.setAttribute("aria-label", custom.title);
  custom.oninput = () => {
    stage.style.backgroundColor = custom.value;
    for (const button of palette.children)
      button.setAttribute("aria-pressed", "false");
  };
  custom.value = "#ffffff";
  custom.onchange = custom.oninput;
  footer.append(palette, custom);
}
export function getZoom() {
  return zoom;
}
export function resetPreview() {
  setZoom(100);
  center();
}

function updateCoordinates(event) {
  if (!artboard) return;
  const p = point(event),
    rect = artboard.getBoundingClientRect();
  const label = document.querySelector(".svgaze-preview-coordinates");
  if (label)
    label.textContent = `X: ${(((p.x - rect.left) * 100) / zoom).toFixed(1)}  Y: ${(((p.y - rect.top) * 100) / zoom).toFixed(1)}`;
}
