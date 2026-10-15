import { getEditorContent, setEditorContent } from "./editorCodeManager.js";
import { parse } from "./editorSvgCore.js";
import { appState } from "../state.js";
import { options } from "./editorOptimizerConfig.js";
import {
  normalizeConfig,
  OptimizationClient,
} from "./editorOptimizerEngine.js";
import { showToast } from "./toast.js";
import { text, escapeHTML } from "./editorText.js";
import { manageEditorDialog } from "./editorDialog.js";

let config = normalizeConfig(),
  client = null,
  timer,
  revision = 0,
  estimate = null,
  applied = null,
  busy = false;
const byteLength = (source) => new TextEncoder().encode(source).length;
const size = (bytes) =>
  bytes < 1024 ? bytes + " B" : (bytes / 1024).toFixed(2) + " KB";
const getClient = () =>
  client ||
  (client = new OptimizationClient(
    new Worker(new URL("./editorOptimizerWorker.js", import.meta.url), {
      type: "module",
    }),
  ));
const key = () => JSON.stringify(config);
export const getOptimizationConfig = () => structuredClone(config);
export const formatSvg = (source, format) =>
  getClient().run(source, config, format);

export function initSvgoManager() {
  try {
    config = normalizeConfig(
      JSON.parse(localStorage.getItem("svgoConfig") || "null"),
    );
  } catch {}
  document
    .getElementById("editorOptimize")
    ?.addEventListener("click", optimizeSVG);
  window.addEventListener("editor-code-changed", updateOptimizePreview);
  window.addEventListener("editor-view-shown", updateOptimizePreview);
  updateOptimizePreview();
}
function save() {
  try {
    localStorage.setItem("svgoConfig", JSON.stringify(config));
  } catch {}
  updateOptimizePreview();
  window.dispatchEvent(new CustomEvent("editor-optimizer-config-changed"));
}
export async function prepareOptimizationComparison() {
  const source = getEditorContent(),
    configKey = key();
  parse(source);
  const result = await getClient().run(source, structuredClone(config));
  if (source !== getEditorContent() || configKey !== key())
    throw new Error(
      text(
        "O documento ou as opções mudaram. Compare novamente.",
        "Document or settings changed. Compare again.",
      ),
    );
  return { source, result, configKey };
}
export async function applyOptimizationComparison(snapshot) {
  if (
    !snapshot ||
    snapshot.source !== getEditorContent() ||
    snapshot.configKey !== key() ||
    busy
  )
    throw new Error(
      text(
        "A comparação está desatualizada. Compare novamente.",
        "Comparison is outdated. Compare again.",
      ),
    );
  estimate = snapshot;
  await optimizeSVG();
}
export function resetOptimizeButton() {
  updateOptimizePreview();
}
export function updateOptimizePreview() {
  clearTimeout(timer);
  const current = ++revision;
  estimate = null;
  const source = getEditorContent(),
    button = document.getElementById("editorOptimize"),
    badge = document.querySelector(".optimize-percent");
  if (!button) return;
  const label = button.querySelector(".optimize-label");
  if (applied?.result === source && applied.configKey === key()) {
    button.classList.add("optimized");
    button.disabled = true;
    document.getElementById("optimizeSizes").style.display = "none";
    label.textContent = text("Otimizado", "Optimized");
    label.setAttribute("data-i18n", "editor.optimized");
    document.getElementById("optimizeIcon").style.display = "";
    document.getElementById("optimizeOriginalSize").textContent = size(
      applied.before,
    );
    document.getElementById("optimizeNewSize").textContent = size(
      applied.after,
    );
    const percent = Math.round((1 - applied.after / applied.before) * 100);
    badge.textContent =
      (percent > 0 ? "-" : percent < 0 ? "+" : "") + Math.abs(percent) + "%";
    button.title = `${size(applied.before)} → ${size(applied.after)}`;
    return;
  }
  applied = null;
  label.textContent = text("Otimizar", "Optimize");
  label.setAttribute("data-i18n", "editor.optimize");
  button.classList.remove("optimized");
  button.style.pointerEvents = "";
  const icon = document.getElementById("optimizeIcon");
  if (icon) icon.style.display = "none";
  document.getElementById("optimizeSizes").style.display = "inline-flex";
  const original = document.getElementById("optimizeOriginalSize"),
    next = document.getElementById("optimizeNewSize");
  original.textContent = size(byteLength(source));
  next.textContent = "—";
  badge.textContent = "—";
  badge.setAttribute("role", "status");
  try {
    parse(source);
    button.disabled = busy;
  } catch {
    button.disabled = true;
    return;
  }
  if (appState.currentView !== "editor") return;
  badge.textContent = "…";
  timer = setTimeout(async () => {
    const configKey = key();
    try {
      const result = await getClient().run(source, config);
      if (
        current !== revision ||
        source !== getEditorContent() ||
        configKey !== key()
      )
        return;
      const before = byteLength(source),
        after = byteLength(result),
        percent = Math.round((1 - after / before) * 100);
      estimate = { source, configKey, result, before, after };
      appState.editor.optimizedSize = after;
      next.textContent = size(after);
      badge.textContent =
        (percent > 0 ? "-" : percent < 0 ? "+" : "") + Math.abs(percent) + "%";
      button.title = `${size(before)} → ${size(after)}`;
    } catch (error) {
      if (current === revision) {
        badge.textContent = "—";
        button.title = error.message;
      }
    }
  }, 150);
}
async function optimizeSVG() {
  if (busy) return;
  const source = getEditorContent(),
    configKey = key();
  try {
    parse(source);
    busy = true;
    document.getElementById("editorOptimize").disabled = true;
    const result =
      estimate?.source === source && estimate.configKey === configKey
        ? estimate.result
        : await getClient().run(source, config);
    if (source !== getEditorContent() || key() !== configKey) {
      showToast(
        text(
          "O SVG foi alterado. Tente novamente.",
          "The SVG changed. Please apply again.",
        ),
        "info",
      );
      return;
    }
    setEditorContent(result);
    if (getEditorContent() !== result || appState.editor.currentSVG !== result)
      throw new Error(
        text(
          "Não foi possível aplicar o SVG otimizado.",
          "Could not apply the optimized SVG.",
        ),
      );
    applied = {
      result,
      configKey,
      before: byteLength(source),
      after: byteLength(result),
    };
    showToast(
      source === result
        ? text(
            "O SVG já está otimizado com estas opções.",
            "The SVG is already optimized with these options.",
          )
        : `${text("Otimizado", "Optimized")}: ${size(byteLength(source))} → ${size(byteLength(result))}`,
      "success",
    );
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    busy = false;
    updateOptimizePreview();
  }
}

const pt = {
  cleanupAttrs: "Limpar atributos",
  cleanupEnableBackground: "Limpar enable-background",
  cleanupIds: "Simplificar IDs",
  cleanupListOfValues: "Arredondar listas numéricas",
  cleanupNumericValues: "Arredondar valores numéricos",
  collapseGroups: "Colapsar grupos",
  moveElemsAttrsToGroup: "Mover atributos para grupos",
  moveGroupAttrsToElems: "Mover atributos para elementos",
  mergePaths: "Unir caminhos",
  reusePaths: "Reutilizar caminhos",
  sortAttrs: "Ordenar atributos",
  sortDefsChildren: "Ordenar filhos de defs",
  prefixIds: "Prefixar IDs",
  convertColors: "Simplificar cores",
  convertPathData: "Otimizar dados dos caminhos",
  convertShapeToPath: "Converter formas em caminhos",
  convertStyleToAttrs: "Converter estilos em atributos",
  convertTransform: "Otimizar transformações",
  inlineStyles: "Aplicar estilos inline",
  mergeStyles: "Unir estilos",
  minifyStyles: "Minificar estilos",
  removeComments: "Remover comentários",
  removeDesc: "Remover descrição",
  removeDimensions: "Remover dimensões",
  removeDoctype: "Remover doctype",
  removeEditorsNSData: "Remover namespaces de editores",
  removeEmptyAttrs: "Remover atributos vazios",
  removeEmptyText: "Remover texto vazio",
  removeHiddenElems: "Remover elementos ocultos",
  removeNonInheritableGroupAttrs: "Remover atributos não herdáveis",
  removeOffCanvasPaths: "Remover elementos fora do viewBox",
  removeRasterImages: "Remover imagens raster",
  removeScripts: "Remover scripts",
  removeStyleElement: "Remover elemento style",
  removeTitle: "Remover título",
  removeUnknownsAndDefaults: "Remover conteúdo desconhecido e padrões",
  removeUnusedNS: "Remover namespaces sem uso",
  removeUselessDefs: "Remover definições sem uso",
  removeUselessStrokeAndFill: "Remover fill/stroke sem efeito",
  removeViewBox: "Remover viewBox",
  removeXMLProcInst: "Remover instruções XML",
  removeMetadata: "Remover metadados",
  convertEllipseToCircle: "Converter elipses em círculos",
  removeEmptyContainers: "Remover contêineres vazios",
};
export function showSvgoModal() {
  let modal = document.getElementById("svgoModal");
  if (modal) modal.remove();
  modal = document.createElement("div");
  modal.id = "svgoModal";
  modal.className =
    "modal-backdrop svgaze-settings-backdrop workbench-settings";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "false");
  const rows = options;
  modal.innerHTML = `<div class="modal svgo-modal-content"><div class="modal-header"><h2>${text("Otimização SVGO", "SVGO optimization")}</h2><button class="modal-close" aria-label="${text("Fechar", "Close")}">×</button></div><div class="modal-body svgo-modal-body"><div class="svgaze-precision">${[
    ["number", text("Precisão numérica", "Number precision")],
    ["transform", text("Precisão de transformação", "Transform precision")],
  ]
    .map(
      ([name, label]) =>
        `<label>${label} <output>${config[name]}</output><input type="range" min="0" max="8" value="${config[name]}" data-precision="${name}" aria-label="${label}"></label>`,
    )
    .join(
      "",
    )}</div><div class="svgo-plugins-grid">${rows.map((o) => `<label class="svgo-plugin-item"><input type="checkbox" data-plugin="${o.key}" ${config.options[o.key] ? "checked" : ""}><span>${escapeHTML(text(pt[o.key] || o.label, o.label))}</span></label>`).join("")}</div></div><div class="modal-footer"><button class="btn secondary" data-reset>${text("Restaurar padrões", "Reset defaults")}</button><button class="btn primary" data-apply>${text("Otimizar", "Optimize")}</button></div></div>`;
  document.body.append(modal);
  const body = modal.querySelector(".svgo-modal-body");
  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = text("Buscar configuração…", "Search settings…");
  search.setAttribute("aria-label", search.placeholder);
  body.prepend(search);
  const categories = [
    ["cleanup", text("Limpeza", "Cleanup")],
    ["geometry", text("Geometria e cores", "Geometry and colors")],
    ["structure", text("Estrutura", "Structure")],
  ];
  const list = modal.querySelector(".svgo-plugins-grid");
  for (const [category, label] of categories) {
    const section = document.createElement("section");
    section.dataset.category = category;
    const heading = document.createElement("h3");
    heading.textContent = label;
    section.append(heading);
    list.append(section);
  }
  for (const row of [...list.querySelectorAll(":scope > label")]) {
    const name = row.querySelector("input").dataset.plugin;
    const category = /^(convert|mergePaths|reusePaths)/.test(name)
      ? "geometry"
      : /^(remove|cleanup)/.test(name)
        ? "cleanup"
        : "structure";
    list.querySelector(`[data-category="${category}"]`).append(row);
  }
  search.oninput = () => {
    const query = search.value.toLocaleLowerCase().trim();
    for (const row of list.querySelectorAll("label"))
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
    for (const section of list.children)
      section.hidden = ![...section.querySelectorAll("label")].some(
        (row) => !row.hidden,
      );
  };
  let cleanup;
  const close = () => cleanup();
  cleanup = manageEditorDialog(modal, close);
  modal.querySelector(".modal-close").onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };
  modal.addEventListener("change", (e) => {
    if (e.target.dataset.plugin) {
      config.options[e.target.dataset.plugin] = e.target.checked;
      save();
    }
  });
  modal.addEventListener("input", (e) => {
    if (e.target.dataset.precision) {
      config[e.target.dataset.precision] = Number(e.target.value);
      e.target.previousElementSibling.textContent = e.target.value;
      save();
    }
  });
  modal.querySelector("[data-reset]").onclick = () => {
    config = normalizeConfig();
    save();
    showSvgoModal();
  };
  modal.querySelector("[data-apply]").onclick = () => {
    close();
    optimizeSVG();
  };
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  modal.querySelector(".modal-close").focus();
}
