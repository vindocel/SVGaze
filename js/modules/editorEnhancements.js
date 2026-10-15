import {
  getEditorContent,
  setEditorContent,
  clearEditor,
} from "./editorCodeManager.js";
import { parse, colors, replaceColor, colorHex } from "./editorSvgCore.js";
import { showToast } from "./toast.js";
import { appState } from "../state.js";
import { openInEditor } from "./viewManager.js";
import { placeEditorPopover } from "./editorPopover.js";
import { text } from "./editorText.js";

export function initEditorEnhancements() {
  const colorButton = document.createElement("button");
  colorButton.id = "editorColors";
  colorButton.className = "btn-minimal";
  colorButton.textContent = text("Cores", "Colors");
  colorButton.onclick = showColors;
  document.getElementById("dimensionsBtn")?.before(colorButton);
  const swatches = document.createElement("span");
  swatches.className = "svgaze-document-colors";
  colorButton.prepend(swatches);
  const updateColors = () => {
    swatches.replaceChildren();
    try {
      for (const color of colors(getEditorContent()).slice(0, 5)) {
        const dot = document.createElement("i");
        dot.style.backgroundColor = colorHex(color.value);
        swatches.append(dot);
      }
    } catch {}
  };
  window.addEventListener("editor-code-changed", updateColors);
  updateColors();
  const footer = document.querySelector(".code-footer .footer-right");
  const clear = document.createElement("button");
  clear.id = "editorClear";
  clear.className = "btn-minimal";
  clear.title = text("Limpar código", "Clear code");
  clear.setAttribute("aria-label", clear.title);
  clear.textContent = text("Limpar", "Clear");
  clear.onclick = clearEditor;
  document.querySelector(".svgaze-code-actions")?.append(clear);
  const share = document.createElement("button");
  share.id = "editorShare";
  share.className = "btn-footer";
  share.textContent = text("Compartilhar", "Share");
  share.onclick = async () => {
    try {
      const source = getEditorContent();
      parse(source);
      const url = new URL(location.href);
      url.hash = "svg=" + encodeURIComponent(source);
      await navigator.clipboard.writeText(url.href);
      showToast(
        text(
          "Link copiado. O SVG está no próprio link.",
          "Link copied. The SVG is encoded in the link.",
        ),
        "success",
      );
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  footer?.append(share);
  const editor = document.getElementById("editor");
  editor.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });
  editor.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await loadEditorFile(file);
  });
  document.addEventListener("paste", async (e) => {
    if (appState.currentView !== "editor") return;
    const file = [...(e.clipboardData?.files || [])].find(
      (file) => file.type === "image/svg+xml",
    );
    if (file) {
      e.preventDefault();
      await loadEditorFile(file);
    }
  });
  try {
    if (location.hash.startsWith("#svg=")) {
      const source = decodeURIComponent(location.hash.slice(5));
      parse(source);
      openInEditor(source, "shared.svg");
    }
  } catch {}
}
export async function loadEditorFile(file) {
  try {
    if (!/\.svg$/i.test(file.name) && file.type !== "image/svg+xml")
      throw new Error(text("Selecione um arquivo SVG.", "Choose an SVG file."));
    if (file.size > 5 * 1024 * 1024)
      throw new Error(
        text("Limite de 5 MB por arquivo.", "File limit is 5 MB."),
      );
    const source = await file.text();
    parse(source);
    appState.editor.fileName = file.name;
    setEditorContent(source, { modified: false });
  } catch (error) {
    showToast(error.message, "error");
  }
}
function showColors() {
  document.getElementById("svgazeColorModal")?.remove();
  const modal = document.createElement("div");
  modal.id = "svgazeColorModal";
  modal.className = "modal-backdrop svgaze-settings-backdrop";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "false");
  const shell = document.createElement("div");
  shell.className = "modal svgaze-small-modal";
  shell.innerHTML = `<div class="modal-header"><h2>${text("Cores do SVG", "SVG colors")}</h2><button class="modal-close">×</button></div><div class="modal-body"><div class="svgaze-color-list"></div><button class="btn secondary" data-all>${text("Converter tudo para currentColor", "Convert all to currentColor")}</button><p class="svgaze-hint">currentColor ${text("herda a propriedade color do CSS.", "inherits the CSS color property.")}</p></div>`;
  modal.append(shell);
  document.body.append(modal);
  placeEditorPopover(shell, document.getElementById("editorColors"), 360);
  const close = () => modal.remove();
  modal.querySelector(".modal-close").onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
  modal.onkeydown = (e) => {
    if (e.key === "Escape") close();
  };
  const apply = (old, value) => {
    try {
      setEditorContent(replaceColor(getEditorContent(), old, value));
      renderList();
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  function renderList() {
    const list = modal.querySelector(".svgaze-color-list");
    list.replaceChildren();
    try {
      for (const color of colors(getEditorContent())) {
        const row = document.createElement("div");
        row.className = "svgaze-color-row";
        const picker = document.createElement("input");
        picker.type = "color";
        picker.value = colorHex(color.value);
        picker.setAttribute("aria-label", color.value);
        picker.onchange = () => apply(color.value, picker.value);
        const field = document.createElement("input");
        field.type = "text";
        field.value = color.value;
        field.setAttribute("aria-label", text("Valor da cor", "Color value"));
        field.onchange = () => apply(color.value, field.value);
        const count = document.createElement("span");
        count.textContent = "×" + color.count;
        const current = document.createElement("button");
        current.className = "btn ghost";
        current.textContent = "currentColor";
        current.onclick = () => apply(color.value, "currentColor");
        row.append(picker, field, count, current);
        list.append(row);
      }
    } catch {}
  }
  modal.querySelector("[data-all]").onclick = () => apply(null, "currentColor");
  renderList();
}
