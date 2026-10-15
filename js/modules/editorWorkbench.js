import { appState } from "../state.js";
import { getCodeEditor, getEditorContent } from "./editorCodeManager.js";
import { parse } from "./editorSvgCore.js";
import { text } from "./editorText.js";
import { initEditorInspector } from "./editorInspector.js";
import { showOptimizationComparison } from "./editorComparison.js";

const icon = (paths) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
export function initEditorWorkbench() {
  const container = document.querySelector("#editor .editor-container");
  container.classList.add("workbench");
  const fitViewport = () => {
    const headerHeight =
      document.querySelector(".app-header")?.getBoundingClientRect().height ||
      60;
    container.style.height =
      container.style.maxHeight = `calc(100dvh - ${headerHeight}px)`;
  };
  new ResizeObserver(fitViewport).observe(
    document.querySelector(".app-header"),
  );
  fitViewport();
  const bar = document.createElement("div");
  bar.className = "workbench-bar";
  bar.innerHTML = `<div class="workbench-document"><span class="workbench-file-icon">&lt;/&gt;</span><strong id="workbenchFilename"></strong><span id="workbenchModified" title="${text("Alterações no documento", "Document changes")}">●</span></div><div class="workbench-history"><button id="workbenchUndo" title="${text("Desfazer (Ctrl+Z)", "Undo (Ctrl+Z)")}">${icon('<path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12"/>')}</button><button id="workbenchRedo" title="${text("Refazer (Ctrl+Shift+Z)", "Redo (Ctrl+Shift+Z)")}">${icon('<path d="m16 4 5 5-5 5M21 9H10a6 6 0 0 0 0 12"/>')}</button></div><button id="workbenchSwapPanels" aria-pressed="false" title="${text("Inverter código e prévia", "Swap code and preview")}">${icon('<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>')}<span>${text("Inverter painéis", "Swap panels")}</span></button><button id="workbenchInspectorToggle" aria-expanded="true">${icon('<path d="M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6"/>')}<span>${text("Propriedades", "Properties")}</span></button><button id="workbenchExport" class="primary" aria-expanded="false" aria-controls="workbenchExportMenu">${icon('<path d="M12 3v12m-4-4 4 4 4-4M4 15v6h16v-6"/>')}${text("Exportar", "Export")}</button>`;
  container.prepend(bar);
  const menu = document.createElement("div");
  menu.id = "workbenchExportMenu";
  menu.hidden = true;
  menu.className = "workbench-export-menu";
  for (const [label, target] of [
    ["SVG", "editorDownload"],
    ["React", "react"],
    ["React Native", "react-native"],
    ["PNG / JPEG / WebP / ICO", "png"],
    ["Data URI", "data-uri"],
  ]) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = () => {
      if (target === "editorDownload") document.getElementById(target).click();
      else {
        document.querySelector(`.export-tab[data-tab="${target}"]`).click();
      }
      closeExport();
    };
    menu.append(button);
  }
  bar.append(menu);
  const exportButton = document.getElementById("workbenchExport");
  const closeExport = () => {
    menu.hidden = true;
    exportButton.setAttribute("aria-expanded", "false");
  };
  exportButton.onclick = () => {
    menu.hidden = !menu.hidden;
    exportButton.setAttribute("aria-expanded", String(!menu.hidden));
    if (!menu.hidden) menu.querySelector("button").focus();
  };
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !exportButton.contains(event.target))
      closeExport();
  });
  menu.onkeydown = (event) => {
    if (event.key === "Escape") {
      closeExport();
      exportButton.focus();
    }
  };
  const inspector = document.createElement("aside");
  inspector.className = "workbench-inspector";
  inspector.setAttribute(
    "aria-label",
    text("Propriedades do SVG", "SVG properties"),
  );
  inspector.innerHTML = `<header><strong>${text("Propriedades", "Properties")}</strong><button aria-label="${text("Fechar propriedades", "Close properties")}">×</button></header><section class="workbench-global"><h3>${text("Documento inteiro", "Whole document")}</h3><p class="workbench-hint">${text("Transformações, cores e dimensões globais.", "Global transforms, colors and dimensions.")}</p></section><section class="workbench-selection"></section>`;
  document.querySelector(".editor-split-pane").append(inspector);
  const transforms = document.querySelector(".code-toolbar .toolbar-group");
  inspector.querySelector(".workbench-global").append(transforms);
  initEditorInspector(inspector.querySelector(".workbench-selection"));
  const toggle = document.getElementById("workbenchInspectorToggle");
  inspector.hidden = window.innerWidth <= 900;
  toggle.setAttribute("aria-expanded", String(!inspector.hidden));
  toggle.onclick = () => {
    inspector.hidden = !inspector.hidden;
    toggle.setAttribute("aria-expanded", String(!inspector.hidden));
    getCodeEditor()?.refresh();
  };
  inspector.querySelector("header button").onclick = () => {
    toggle.click();
    toggle.focus();
  };
  const swap = document.getElementById("workbenchSwapPanels");
  const pane = document.querySelector(".editor-split-pane");
  const codePanel = pane.querySelector(".code-panel");
  const previewPanel = pane.querySelector(".preview-panel");
  const divider = pane.querySelector(".editor-resizer");
  function setPanelOrder(reversed) {
    const first = reversed ? previewPanel : codePanel;
    const second = reversed ? codePanel : previewPanel;
    // CSS order preserves the iframe document, current selection and preview camera.
    first.style.order = "0";
    divider.style.order = "1";
    second.style.order = "2";
    inspector.style.order = "3";
    container.dataset.panelOrder = reversed ? "preview-first" : "code-first";
    swap.setAttribute("aria-pressed", String(reversed));
    swap.title = reversed
      ? text("Colocar código à esquerda", "Place code on the left")
      : text("Colocar prévia à esquerda", "Place preview on the left");
    swap.setAttribute("aria-label", swap.title);
    try {
      localStorage.setItem("svgaze-panel-order", container.dataset.panelOrder);
    } catch {}
    getCodeEditor()?.refresh();
  }
  let reversed = false;
  try {
    reversed = localStorage.getItem("svgaze-panel-order") === "preview-first";
  } catch {}
  setPanelOrder(reversed);
  swap.onclick = () =>
    setPanelOrder(container.dataset.panelOrder !== "preview-first");
  document.getElementById("workbenchUndo").onclick = () =>
    getCodeEditor()?.undo();
  document.getElementById("workbenchRedo").onclick = () =>
    getCodeEditor()?.redo();
  const codeToolbar = document.querySelector(".code-toolbar");
  const heading = document.createElement("strong");
  heading.className = "workbench-panel-title";
  heading.textContent = text("Código", "Code");
  codeToolbar.prepend(heading);
  const compare = document.createElement("button");
  compare.id = "workbenchCompare";
  compare.textContent = text("Comparar", "Compare");
  compare.title = text(
    "Comparar original e otimizado",
    "Compare original and optimized",
  );
  compare.onclick = showOptimizationComparison;
  codeToolbar.querySelector(".toolbar-group").append(compare);
  const search = document.createElement("button");
  search.title = text("Buscar no código (Ctrl+F)", "Search code (Ctrl+F)");
  search.innerHTML = icon(
    '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  );
  search.onclick = () => {
    getCodeEditor()?.focus();
    getCodeEditor()?.execCommand("find");
  };
  document.querySelector(".svgaze-code-actions").prepend(search);
  const status = document.createElement("div");
  status.className = "workbench-status";
  status.innerHTML = `<span id="workbenchValidation" role="status"></span><span>${text("Local no navegador", "Local in your browser")}</span><span id="workbenchSize"></span>`;
  container.append(status);
  function updateStatus() {
    document.getElementById("workbenchFilename").textContent =
      appState.editor.fileName || "untitled.svg";
    document.getElementById("workbenchModified").hidden =
      !appState.editor.isModified;
    const validation = document.getElementById("workbenchValidation");
    try {
      parse(getEditorContent());
      validation.textContent = "● " + text("SVG válido", "Valid SVG");
      validation.dataset.valid = "true";
    } catch {
      validation.textContent =
        "● " + text("Verifique o código", "Check the code");
      validation.dataset.valid = "false";
    }
    document.getElementById("workbenchSize").textContent =
      new TextEncoder().encode(getEditorContent()).length + " B";
    const history = getCodeEditor()?.historySize();
    document.getElementById("workbenchUndo").disabled = !history?.undo;
    document.getElementById("workbenchRedo").disabled = !history?.redo;
  }
  window.addEventListener("editor-code-changed", updateStatus);
  window.addEventListener("editor-document-state-changed", updateStatus);
  window.addEventListener("editor-view-shown", updateStatus);
  window.addEventListener("editor-load-svg", updateStatus);
  window.addEventListener("editor-view-resized", () =>
    getCodeEditor()?.refresh(),
  );
  getCodeEditor()?.on("changes", updateStatus);
  updateStatus();
  for (const button of container.querySelectorAll("button[title]"))
    if (!button.hasAttribute("aria-label"))
      button.setAttribute("aria-label", button.title);
}
