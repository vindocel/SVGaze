import { getEditorContent } from "./editorCodeManager.js";
import {
  prepareOptimizationComparison,
  applyOptimizationComparison,
} from "./editorSvgoManager.js";
import { previewDocument, sourceElements } from "./editorSvgMapper.js";
import { text } from "./editorText.js";
import { manageEditorDialog } from "./editorDialog.js";
import { showToast } from "./toast.js";
import { getDefaultColorForTheme } from "./colorManager.js";
let dismissCurrent;

export async function showOptimizationComparison() {
  dismissCurrent?.();
  const dialog = document.createElement("div");
  dialog.id = "optimizationComparison";
  dialog.className = "modal-backdrop workbench-comparison";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute(
    "aria-label",
    text("Comparar otimização", "Compare optimization"),
  );
  dialog.setAttribute("aria-hidden", "false");
  dialog.innerHTML = `<section class="modal"><header><h2>${text("Comparar otimização", "Compare optimization")}</h2><button data-close aria-label="${text("Fechar", "Close")}">×</button></header><div class="comparison-switch"><button data-mode="image" aria-pressed="true">${text("Imagem", "Image")}</button><button data-mode="code" aria-pressed="false">${text("Código", "Code")}</button></div><p data-status role="status">${text("Calculando localmente…", "Computing locally…")}</p><div class="comparison-columns"></div><footer><button data-close>${text("Cancelar", "Cancel")}</button><button class="primary" data-apply disabled>${text("Aplicar otimização", "Apply optimization")}</button></footer></section>`;
  document.body.append(dialog);
  let snapshot,
    disposed = false,
    cleanup;
  const stale = () => {
    dialog.querySelector("[data-apply]").disabled = true;
    dialog.querySelector("[data-status]").textContent = text(
      "O documento ou as opções mudaram. Abra uma nova comparação.",
      "Document or settings changed. Open a new comparison.",
    );
  };
  const close = () => {
    disposed = true;
    window.removeEventListener("editor-code-changed", stale);
    window.removeEventListener("editor-optimizer-config-changed", stale);
    cleanup();
    dismissCurrent = null;
  };
  cleanup = manageEditorDialog(dialog, close);
  dismissCurrent = close;
  dialog
    .querySelectorAll("[data-close]")
    .forEach((button) => (button.onclick = close));
  dialog.onclick = (event) => {
    if (event.target === dialog) close();
  };
  window.addEventListener("editor-code-changed", stale);
  window.addEventListener("editor-optimizer-config-changed", stale);
  dialog.querySelectorAll("[data-mode]").forEach(
    (button) =>
      (button.onclick = () => {
        dialog.dataset.mode = button.dataset.mode;
        dialog
          .querySelectorAll("[data-mode]")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button)),
          );
      }),
  );
  dialog.dataset.mode = "image";
  dialog.querySelector("[data-apply]").onclick = async () => {
    try {
      await applyOptimizationComparison(snapshot);
      close();
    } catch (error) {
      showToast(error.message, "error");
      stale();
    }
  };
  try {
    snapshot = await prepareOptimizationComparison();
    if (disposed) return;
    const bytes = (value) => new TextEncoder().encode(value).length;
    const before = bytes(snapshot.source),
      after = bytes(snapshot.result);
    const percent = Math.abs((1 - after / before) * 100)
      .toFixed(1)
      .replace(/\.0$/, "");
    dialog.querySelector("[data-status]").textContent =
      `${before} B → ${after} B · ${percent}% ${after > before ? text("de aumento", "increase") : text("de redução", "reduction")}`;
    for (const [label, source] of [
      [text("Original", "Original"), snapshot.source],
      [text("Otimizado", "Optimized"), snapshot.result],
    ]) {
      const column = document.createElement("section");
      const title = document.createElement("h3");
      title.textContent = `${label} · ${bytes(source)} B`;
      const frame = document.createElement("iframe");
      frame.title = label;
      frame.setAttribute("sandbox", "allow-same-origin");
      frame.srcdoc = previewDocument(source, sourceElements(source));
      frame.onload = () => {
        const root = frame.contentDocument?.querySelector("svg");
        if (
          root &&
          !root.hasAttribute("color") &&
          !/(?:^|;)\s*color\s*:/i.test(root.getAttribute("style") || "")
        )
          root.style.color = getDefaultColorForTheme();
      };
      const code = document.createElement("pre");
      code.textContent = source;
      column.append(title, frame, code);
      dialog.querySelector(".comparison-columns").append(column);
    }
    dialog.querySelector("[data-apply]").disabled = false;
    if (getEditorContent() !== snapshot.source) stale();
  } catch (error) {
    if (!disposed)
      dialog.querySelector("[data-status]").textContent = error.message;
  }
}
