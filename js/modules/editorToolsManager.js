import { getEditorContent, setEditorContent } from "./editorCodeManager.js";
import { parse } from "./editorSvgCore.js";
import { formatSvg } from "./editorSvgoManager.js";
import { showToast } from "./toast.js";
import { text } from "./editorText.js";
import { placeEditorPopover } from "./editorPopover.js";
import { groupEditorAction } from "./editorLayout.js";
let preferences = { indent: "2", shortTags: true };
export function initToolsManager() {
  try {
    const saved = JSON.parse(localStorage.getItem("svgaze-format") || "null");
    if (saved)
      preferences = {
        indent: ["2", "4", "tab"].includes(saved.indent) ? saved.indent : "2",
        shortTags: saved.shortTags !== false,
      };
  } catch {}
  document
    .getElementById("editorPrettify")
    ?.addEventListener("click", () => format(true));
  document
    .getElementById("editorMinify")
    ?.addEventListener("click", () => format(false));
  document.getElementById("editorValidate")?.addEventListener("click", () => {
    try {
      parse(getEditorContent());
      showToast(text("SVG válido", "Valid SVG"), "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  const button = document.createElement("button");
  button.id = "prettifyOptions";
  button.className = "icon-btn-minimal";
  button.textContent = "⌄";
  button.title = text("Opções de formatação", "Formatting options");
  button.onclick = showFormatting;
  document.getElementById("editorPrettify")?.after(button);
  groupEditorAction(
    document.getElementById("editorPrettify"),
    button,
    text("Formatação", "Formatting"),
  );
}
async function format(pretty) {
  const source = getEditorContent();
  try {
    parse(source);
    const result = await formatSvg(source, { pretty, ...preferences });
    if (source === getEditorContent()) setEditorContent(result);
  } catch (error) {
    showToast(error.message, "error");
  }
}
function showFormatting() {
  document.getElementById("formattingModal")?.remove();
  const modal = document.createElement("div");
  modal.id = "formattingModal";
  modal.className = "modal-backdrop svgaze-settings-backdrop";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "false");
  modal.innerHTML = `<div class="modal svgaze-small-modal"><div class="modal-header"><h2>${text("Formatação", "Formatting")}</h2><button class="modal-close">×</button></div><div class="modal-body"><label>${text("Indentação", "Indentation")} <select>${["2", "4", "tab"].map((value) => `<option value="${value}" ${preferences.indent === value ? "selected" : ""}>${value === "tab" ? "Tab" : value + text(" espaços", " spaces")}</option>`).join("")}</select></label><label class="svgo-plugin-item"><input type="checkbox" ${preferences.shortTags ? "checked" : ""}>${text("Tags curtas", "Short tags")}</label><button class="btn secondary" data-reset>${text("Restaurar padrões", "Reset defaults")}</button></div></div>`;
  document.body.append(modal);
  placeEditorPopover(
    modal.querySelector(".modal"),
    document.getElementById("prettifyOptions"),
    320,
  );
  const utilities = document.createElement("div");
  utilities.className = "svgaze-format-utilities";
  for (const [id, label] of [
    ["editorValidate", text("Validar SVG", "Validate SVG")],
    ["editorMinify", text("Minificar", "Minify")],
  ]) {
    const action = document.createElement("button");
    action.className = "btn secondary";
    action.textContent = label;
    action.onclick = () => {
      document.getElementById(id).click();
      modal.remove();
    };
    utilities.append(action);
  }
  modal.querySelector(".modal-body").append(utilities);
  const close = () => modal.remove();
  modal.querySelector(".modal-close").onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
  modal.onkeydown = (e) => {
    if (e.key === "Escape") close();
  };
  modal.onchange = () => {
    preferences = {
      indent: modal.querySelector("select").value,
      shortTags: modal.querySelector("input").checked,
    };
    try {
      localStorage.setItem("svgaze-format", JSON.stringify(preferences));
    } catch {}
  };
  modal.querySelector("[data-reset]").onclick = () => {
    preferences = { indent: "2", shortTags: true };
    try {
      localStorage.removeItem("svgaze-format");
    } catch {}
    close();
    showFormatting();
  };
}
