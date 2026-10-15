import test from "node:test";
import assert from "node:assert/strict";
import { installDOM, delay, eventually } from "./dom.mjs";
const dom = installDOM({ codeMirror: true, fullPage: true });
const { optimize } = await import("../js/vendor/optimizer.js");
const { runOptimization } =
  await import("../js/modules/editorOptimizerEngine.js");
// The actual SVGO engine is used. Only the browser Worker transport is simulated.
let replyDelay = 5;
globalThis.Worker = class {
  postMessage({ id, source, config, format }) {
    setTimeout(() => {
      try {
        this.onmessage?.({
          data: {
            id,
            result: runOptimization(optimize, source, config, format),
          },
        });
      } catch (error) {
        this.onmessage?.({ data: { id, error: error.message } });
      }
    }, replyDelay);
  }
  terminate() {}
};
const { appState } = await import("../js/state.js");
const { openInEditor, switchToView } =
  await import("../js/modules/viewManager.js");
const { getEditorContent, getCodeEditor, setEditorContent } =
  await import("../js/modules/editorCodeManager.js");
const { getCurrentTab } = await import("../js/modules/editorTabManager.js");
const { showSvgoModal, getOptimizationConfig } =
  await import("../js/modules/editorSvgoManager.js");
const source =
  '<svg xmlns="http://www.w3.org/2000/svg" class="app-logo dark-theme-logo" width="400" height="200" viewBox="0 0 400 200"><!-- spare --><rect width="400" height="200" fill="#ff0000"/><circle cx="100" cy="100" r="40" fill="currentColor"/></svg>';
await import("../js/main.js");
test("fresh editor starts with the real SVGaze icon before any gallery file is selected", async () => {
  const { DEFAULT_SVG } =
    await import("../js/modules/editorDefaultDocument.js");
  assert.equal(getEditorContent(), DEFAULT_SVG);
  assert.equal(appState.editor.fileName, "svgaze.svg");
  switchToView("editor");
  await eventually(() => document.querySelector(".svgaze-preview-frame"));
  assert.match(
    document.querySelector(".svgaze-preview-frame").srcdoc,
    /#3b82f6/,
  );
});

test("SVGaze toolbar positions, code actions and background swatches are functional", () => {
  const optimize = document.getElementById("editorOptimize");
  assert.equal(optimize.nextElementSibling.id, "editorSettings");
  assert.equal(optimize.parentElement.className, "svgaze-split-button");
  assert.equal(optimize.parentElement.children.length, 2);
  const prettify = document.getElementById("editorPrettify");
  assert.equal(prettify.parentElement.className, "svgaze-split-button");
  assert.equal(prettify.nextElementSibling.id, "prettifyOptions");
  const initial = getEditorContent();
  document.getElementById("prettifyOptions").click();
  assert.ok(document.getElementById("formattingModal"));
  assert.equal(getEditorContent(), initial);
  document.querySelector("#formattingModal .modal-close").click();
  assert.equal(
    document.getElementById("editorColors").nextElementSibling.id,
    "dimensionsBtn",
  );
  assert.equal(
    document.querySelector(".preview-panel > .panel-header").hidden,
    true,
  );
  assert.ok(document.querySelector(".svgaze-code-actions #editorClear"));
  assert.ok(document.querySelector(".code-footer #editorShare"));
  const wrap = document.getElementById("editorWrap");
  wrap.checked = false;
  wrap.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  assert.equal(getCodeEditor().getOption("lineWrapping"), false);
  wrap.checked = true;
  wrap.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  const swatches = document.querySelectorAll(".svgaze-background-swatch");
  assert.equal(swatches.length, 5);
  swatches[1].click();
  assert.equal(
    document.getElementById("previewContainer").style.backgroundColor,
    "rgb(255, 255, 255)",
  );
  assert.equal(swatches[1].getAttribute("aria-pressed"), "true");
  swatches[0].click();
  assert.equal(
    document.getElementById("previewContainer").style.backgroundColor,
    "",
  );
  assert.equal(getEditorContent().includes("#3b82f6"), true);
});

test("gallery opens the actual editor and automatic savings never mutate its source", async () => {
  openInEditor(source, "sample.svg");
  await eventually(() =>
    /\d+%/.test(document.querySelector(".optimize-percent").textContent),
  );
  assert.equal(appState.currentView, "editor");
  assert.equal(getEditorContent(), source);
  assert.equal(appState.editor.fileName, "sample.svg");
  assert.notEqual(document.getElementById("optimizeNewSize").textContent, "—");
});
test("toolbar flip clicks cancel in the actual editor without stacking groups", () => {
  for (const id of ["transformFlipX", "transformFlipY"]) {
    setEditorContent(source);
    for (let click = 1; click <= 20; click++) {
      document.getElementById(id).click();
      const doc = new DOMParser().parseFromString(
        getEditorContent(),
        "image/svg+xml",
      );
      assert.equal(doc.querySelectorAll("svg > g").length, click % 2);
      assert.equal(doc.querySelectorAll("g g").length, 0);
    }
    assert.equal(
      getEditorContent(),
      new XMLSerializer().serializeToString(
        new DOMParser().parseFromString(source, "image/svg+xml"),
      ),
    );
  }
  setEditorContent(source);
});

test("dimensions apply while typing and keep the initial aspect ratio", () => {
  document.getElementById("dimensionsBtn").click();
  const width = document.getElementById("modalDimensionWidth"),
    height = document.getElementById("modalDimensionHeight");
  width.value = "500";
  width.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(height.value, "250");
  assert.match(getEditorContent(), /width="500" height="250"/);
  document.getElementById("dimensionsModalClose").click();
});
test("rewritten settings expose 41 functional options, independent precision and defaults", () => {
  showSvgoModal();
  const modal = document.getElementById("svgoModal");
  assert.equal(modal.querySelectorAll("[data-plugin]").length, 41);
  const dimension = modal.querySelector('[data-plugin="removeDimensions"]');
  dimension.checked = true;
  dimension.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  assert.equal(getOptimizationConfig().options.removeDimensions, true);
  const precision = modal.querySelector('[data-precision="number"]');
  precision.value = "1";
  precision.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(getOptimizationConfig().number, 1);
  assert.equal(getOptimizationConfig().transform, 5);
  modal.querySelector("[data-reset]").click();
  assert.equal(getOptimizationConfig().options.removeDimensions, false);
  assert.equal(getOptimizationConfig().number, 3);
  document.querySelector("#svgoModal .modal-close").click();
});
test("Optimize applies the exact estimated SVGO output and keeps the completed state until edited", async () => {
  setEditorContent(source);
  const expected = runOptimization(optimize, source, getOptimizationConfig());
  assert.notEqual(expected, source);
  assert.ok(
    new TextEncoder().encode(expected).length <
      new TextEncoder().encode(source).length,
  );
  await eventually(
    () =>
      document.getElementById("optimizeNewSize").textContent ===
      new TextEncoder().encode(expected).length + " B",
  );
  const button = document.getElementById("editorOptimize");
  button.click();
  await eventually(() => button.classList.contains("optimized"));
  assert.equal(getEditorContent(), expected);
  assert.equal(appState.editor.currentSVG, expected);
  assert.equal(getCodeEditor().getValue(), expected);
  assert.equal(
    button.querySelector(".optimize-label").textContent,
    "Optimized",
  );
  assert.equal(button.disabled, true);
  assert.equal(document.getElementById("optimizeSizes").style.display, "none");
  assert.equal(
    document.getElementById("optimizeOriginalSize").textContent,
    new TextEncoder().encode(source).length + " B",
  );
  await delay(250);
  switchToView("gallery");
  switchToView("editor");
  assert.ok(button.classList.contains("optimized"));
  assert.equal(
    button.querySelector(".optimize-label").textContent,
    "Optimized",
  );
  document.getElementById("editorSettings").click();
  assert.ok(document.getElementById("svgoModal"));
  document.querySelector("#svgoModal .modal-close").click();
  getCodeEditor().undo();
  assert.equal(getEditorContent(), source);
  assert.equal(button.classList.contains("optimized"), false);
  assert.equal(button.querySelector(".optimize-label").textContent, "Optimize");
  assert.equal(button.disabled, false);
  assert.equal(
    document.getElementById("optimizeSizes").style.display,
    "inline-flex",
  );
});

test("optimization pending while a document changes never overwrites the newer code", async () => {
  setEditorContent(source + "\n");
  replyDelay = 100;
  const button = document.getElementById("editorOptimize");
  button.click();
  const newer = source.replace("#ff0000", "#123456");
  setEditorContent(newer);
  await eventually(() => !button.disabled);
  assert.equal(getEditorContent(), newer);
  assert.equal(button.classList.contains("optimized"), false);
  replyDelay = 5;
});

test("editing refreshes the active React tab and TypeScript uses the correct extension setting", async () => {
  document.querySelector('[data-tab="react"]').click();
  assert.equal(getCurrentTab(), "react");
  assert.match(
    document.querySelector("#reactCodeOutput code").textContent,
    /SVGComponent/,
  );
  setEditorContent(source.replace("#ff0000", "#abcdef"));
  await eventually(() =>
    document
      .querySelector("#reactCodeOutput code")
      .textContent.includes("#abcdef"),
  );
  const checkbox = document.getElementById("reactTypescript");
  checkbox.checked = true;
  checkbox.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  assert.match(
    document.querySelector("#reactCodeOutput code").textContent,
    /SVGProps<SVGSVGElement>/,
  );
});
test("dark/light/dark changes preserve document, selected tab and zoom without replacing the preview", async () => {
  document.querySelector('[data-tab="preview"]').click();
  await delay(150);
  const frame = document.querySelector(".svgaze-preview-frame");
  assert.ok(frame);
  const hidingRule = document.createElement("style");
  hidingRule.textContent = ".dark-theme-logo{display:none}";
  document.head.append(hidingRule);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(frame.srcdoc);
  doc.close();
  frame.dispatchEvent(new dom.window.Event("load"));
  document.getElementById("previewZoomIn").click();
  const zoom = document.getElementById("previewZoomLevel").textContent,
    code = getEditorContent();
  document.querySelector('[data-tab="react"]').click();
  for (const theme of ["dark", "light", "dark"]) {
    const toggle = document.getElementById("themeToggle");
    toggle.checked = theme === "dark";
    toggle.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    await delay(25);
    assert.equal(document.documentElement.getAttribute("data-theme"), theme);
    assert.equal(getEditorContent(), code);
    assert.equal(getCurrentTab(), "react");
    assert.equal(document.getElementById("previewZoomLevel").textContent, zoom);
    assert.equal(document.querySelector(".svgaze-preview-frame"), frame);
    assert.equal(document.getElementById("editor").style.display, "block");
    assert.ok(document.getElementById("tabReact").classList.contains("active"));
    assert.equal(
      frame.contentDocument.querySelector("svg").style.color,
      theme === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
    );
    assert.equal(
      frame.contentDocument.defaultView.getComputedStyle(
        frame.contentDocument.querySelector("svg"),
      ).display,
      "block",
    );
  }
});
test("preview identifies a shape and selects its exact code; downloads use source without annotations", async () => {
  document.querySelector('[data-tab="preview"]').click();
  const frame = document.querySelector(".svgaze-preview-frame"),
    doc = frame.contentDocument;
  const circle = doc.querySelector("circle");
  assert.ok(circle);
  circle.getBoundingClientRect = () => ({
    left: 10,
    top: 10,
    width: 30,
    height: 30,
  });
  circle.dispatchEvent(
    new doc.defaultView.MouseEvent("pointermove", {
      bubbles: true,
      view: doc.defaultView,
      clientX: 20,
      clientY: 20,
    }),
  );
  assert.ok(document.querySelector(".svgaze-source-highlight"));
  circle.dispatchEvent(
    new doc.defaultView.MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      view: doc.defaultView,
      clientX: 20,
      clientY: 20,
    }),
  );
  circle.dispatchEvent(
    new doc.defaultView.MouseEvent("pointerup", {
      bubbles: true,
      button: 0,
      view: doc.defaultView,
      clientX: 20,
      clientY: 20,
    }),
  );
  assert.match(getCodeEditor().getSelection(), /^<circle /);
  assert.doesNotMatch(getEditorContent(), /data-studio-key/);
});
test("late optimizer responses cannot replace the estimate of a newer document", async () => {
  replyDelay = 500;
  setEditorContent(source.replace("spare", "older document"));
  await delay(180);
  replyDelay = 5;
  const newest = source.replace(
    "spare",
    "newest document with a different byte count",
  );
  setEditorContent(newest);
  await eventually(
    () =>
      document.getElementById("optimizeOriginalSize").textContent ===
        new TextEncoder().encode(newest).length + " B" &&
      /\d+%/.test(document.querySelector(".optimize-percent").textContent),
  );
  const estimate = document.getElementById("optimizeSizes").textContent;
  await delay(400);
  assert.equal(document.getElementById("optimizeSizes").textContent, estimate);
  assert.equal(getEditorContent(), newest);
});
test("panel swapping, inspector and export navigation preserve the document", () => {
  const before = getEditorContent();
  const swap = document.getElementById("workbenchSwapPanels");
  const preview = document.querySelector(".preview-panel");
  const code = document.querySelector(".code-panel");
  const frame = document.querySelector(".svgaze-preview-frame");
  const doc = frame?.contentDocument;
  for (const order of ["preview-first", "code-first", "preview-first"]) {
    swap.click();
    assert.equal(
      document.querySelector(".workbench").dataset.panelOrder,
      order,
    );
    assert.equal(localStorage.getItem("svgaze-panel-order"), order);
    assert.equal(
      swap.getAttribute("aria-pressed"),
      String(order === "preview-first"),
    );
    assert.equal(code.style.order, order === "preview-first" ? "2" : "0");
    assert.equal(preview.style.order, order === "preview-first" ? "0" : "2");
    assert.equal(document.querySelector(".svgaze-preview-frame"), frame);
    assert.equal(frame?.contentDocument, doc);
    assert.equal(getEditorContent(), before);
  }
  document.getElementById("workbenchInspectorToggle").click();
  assert.equal(document.querySelector(".workbench-inspector").hidden, true);
  document.getElementById("workbenchInspectorToggle").click();
  document.getElementById("workbenchExport").click();
  assert.equal(document.getElementById("workbenchExportMenu").hidden, false);
  [...document.querySelectorAll("#workbenchExportMenu button")]
    .find((button) => button.textContent === "React")
    .click();
  assert.equal(getCurrentTab(), "react");
  assert.equal(document.getElementById("workbenchExportMenu").hidden, true);
  assert.equal(
    document.querySelector(".workbench").dataset.panelOrder,
    "preview-first",
  );
  swap.click();
  document.querySelector('[data-tab="preview"]').click();
});

test("inspector edits only the selected shape and supports undo without rewriting siblings", async () => {
  const sample =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><!-- keep -->\n<rect id="one" width="30" height="40" fill="red"/><circle id="two" cx="70" cy="70" r="10" fill="blue"/></svg>';
  setEditorContent(sample);
  const { sourceElements } = await import("../js/modules/editorSvgMapper.js");
  const range = sourceElements(sample)[1];
  window.dispatchEvent(
    new CustomEvent("svg-element-select", { detail: { range } }),
  );
  const field = document.querySelector('[data-property="width"]');
  assert.ok(field);
  field.value = "50";
  field.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  const current = getEditorContent();
  assert.match(current, /width="50"/);
  assert.ok(current.includes("<!-- keep -->\n"));
  assert.ok(
    current.includes('<circle id="two" cx="70" cy="70" r="10" fill="blue"/>'),
  );
  assert.equal((current.match(/xmlns=/g) || []).length, 1);
  document.getElementById("workbenchUndo").click();
  assert.equal(getEditorContent(), sample);
});

test("settings search filters the functional controls inside the new side panel", () => {
  showSvgoModal();
  const panel = document.getElementById("svgoModal");
  const search = panel.querySelector('input[type="search"]');
  search.value = "viewbox";
  search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(
    [...panel.querySelectorAll("[data-plugin]")].filter(
      (input) => !input.closest("label").hidden,
    ).length,
    2,
  );
  assert.equal(panel.querySelectorAll("[data-plugin]").length, 41);
  panel.querySelector(".modal-close").click();
});

test("comparison uses real SVGO, switches image/code and only applies its current snapshot", async () => {
  const { showOptimizationComparison } =
    await import("../js/modules/editorComparison.js");
  setEditorContent(source);
  await showOptimizationComparison();
  let panel = document.getElementById("optimizationComparison");
  assert.equal(panel.querySelectorAll("iframe").length, 2);
  assert.equal(panel.querySelectorAll("pre")[0].textContent, source);
  assert.equal(getEditorContent(), source);
  panel.querySelector('[data-mode="code"]').click();
  assert.equal(panel.dataset.mode, "code");
  const expected = panel.querySelectorAll("pre")[1].textContent;
  panel.querySelector("[data-apply]").click();
  await eventually(() => !document.getElementById("optimizationComparison"));
  assert.equal(getEditorContent(), expected);
  assert.ok(
    document.getElementById("editorOptimize").classList.contains("optimized"),
  );
  document.getElementById("workbenchUndo").click();
  assert.equal(getEditorContent(), source);
  await showOptimizationComparison();
  panel = document.getElementById("optimizationComparison");
  const newer = source.replace("spare", "newer");
  setEditorContent(newer);
  assert.equal(panel.querySelector("[data-apply]").disabled, true);
  panel.querySelector("[data-apply]").click();
  assert.equal(getEditorContent(), newer);
  panel.querySelector("[data-close]").click();
});

test("returning to gallery preserves loaded items and the editor document", () => {
  const items = [{ name: "sentinel.svg" }];
  appState.allItems = items;
  const code = getEditorContent();
  switchToView("gallery");
  assert.equal(document.getElementById("gallery").style.display, "block");
  assert.equal(appState.allItems, items);
  assert.equal(getEditorContent(), code);
});
test.after(async () => {
  await delay(350);
  dom.window.close();
});
