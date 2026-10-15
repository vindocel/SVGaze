import { text } from "./editorText.js";

const icon = (paths) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
export function groupEditorAction(action, menu, label) {
  if (!action || !menu) return;
  const group = document.createElement("div");
  group.className = "svgaze-split-button";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", label);
  action.before(group);
  group.append(action, menu);
  menu.innerHTML = icon('<path d="m8 10 4 4 4-4"/>');
  menu.setAttribute("aria-haspopup", "dialog");
}
export function initEditorLayout() {
  const panel = document.querySelector("#editor .code-panel");
  if (!panel || panel.querySelector(".svgaze-code-status")) return;
  const status = document.createElement("div");
  status.className = "svgaze-code-status";
  const position = document.createElement("span");
  position.id = "editorCursorPosition";
  position.textContent = "Line 1:0";
  const actions = document.createElement("div");
  actions.className = "svgaze-code-actions";
  const wrap = document.createElement("label");
  wrap.className = "svgaze-wrap-toggle";
  wrap.innerHTML = `<input type="checkbox" id="editorWrap">${icon('<path d="M3 6h18M3 12h14a3 3 0 0 1 0 6h-4m2-2-2 2 2 2M3 18h4"/>')}<span>Wrap</span>`;
  actions.append(wrap);
  status.append(position, actions);
  document.getElementById("editorCode").before(status);

  const settings = document.getElementById("editorSettings");
  settings.innerHTML = icon('<path d="m8 10 4 4 4-4"/>');
  settings.title = text("Opções de otimização", "Optimization options");
  settings.setAttribute("aria-label", settings.title);
  document.getElementById("editorOptimize").after(settings);
  groupEditorAction(
    document.getElementById("editorOptimize"),
    settings,
    text("Otimização", "Optimization"),
  );
  document.querySelector("#editor .preview-panel > .panel-header").hidden =
    true;
  for (const [id, path] of [
    ["previewZoomOut", '<path d="M5 12h14"/>'],
    ["previewZoomIn", '<path d="M5 12h14M12 5v14"/>'],
  ])
    document.getElementById(id).innerHTML = icon(path);
  const coordinates = document.createElement("output");
  coordinates.className = "svgaze-preview-coordinates";
  coordinates.textContent = "X: 0  Y: 0";
  document.getElementById("previewContainer").append(coordinates);
  const flipX = document.getElementById("transformFlipX");
  const flipY = document.getElementById("transformFlipY");
  // Keep the flip controls in the SVGaze document toolbar order.
  flipX.before(flipY);
  for (const button of document.querySelectorAll("#editor button[title]")) {
    if (!button.hasAttribute("aria-label"))
      button.setAttribute("aria-label", button.title);
  }
}
