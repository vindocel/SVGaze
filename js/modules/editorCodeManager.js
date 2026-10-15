import { DEFAULT_SVG } from "./editorDefaultDocument.js";
import { appState } from "../state.js";
import { sourceElements, elementAtPosition } from "./editorSvgMapper.js";
import { colorHex } from "./editorSvgCore.js";

let editor = null,
  container = null,
  marker = null,
  colorMarks = [],
  colorTimer,
  nextModified;
let ranges = [];

export function initCodeEditor() {
  container = document.getElementById("editorCode");
  if (!container) return;
  window.addEventListener("editor-load-svg", (e) => {
    appState.editor.fileName = e.detail.fileName;
    setEditorContent(e.detail.svgCode, { modified: false });
  });
  window.addEventListener("editor-view-shown", () => {
    editor?.refresh();
  });
  window.addEventListener("theme-changed", () => {
    requestAnimationFrame(() => editor?.refresh());
  });
  window.addEventListener("svg-element-hover", (e) =>
    highlightSource(e.detail.range),
  );
  window.addEventListener("svg-element-select", (e) => {
    const r = e.detail.range;
    if (!r || !editor) return;
    editor.setSelection(editor.posFromIndex(r.from), editor.posFromIndex(r.to));
    editor.focus();
    editor.scrollIntoView(
      { from: editor.posFromIndex(r.from), to: editor.posFromIndex(r.openTo) },
      32,
    );
  });
  let attempts = 0;
  const initialize = () => {
    if (!window.CodeMirror) {
      if (++attempts < 100) setTimeout(initialize, 100);
      else
        container.textContent = "CodeMirror could not load. Reload the page.";
      return;
    }
    if (!appState.editor.currentSVG) appState.editor.fileName = "svgaze.svg";
    editor = window.CodeMirror(container, {
      value: appState.editor.currentSVG || DEFAULT_SVG,
      mode: "xml",
      theme: "svgaze",
      lineNumbers: true,
      lineWrapping: appState.editor.wordWrap,
      tabSize: 2,
      indentUnit: 2,
      autoCloseTags: true,
      matchTags: { bothTags: true },
      matchBrackets: true,
      autoCloseBrackets: true,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    });
    editor.setSize("100%", "100%");
    editor.on("change", () => publish(editor.getValue(), nextModified ?? true));
    editor.on("cursorActivity", () => {
      const cursor = editor.getCursor("from");
      const status = document.getElementById("editorCursorPosition");
      if (status) status.textContent = `Line ${cursor.line + 1}:${cursor.ch}`;
      const pos = editor.indexFromPos(cursor);
      window.dispatchEvent(
        new CustomEvent("editor-element-focus", {
          detail: { range: elementAtPosition(ranges, pos) },
        }),
      );
    });
    const wrap = document.getElementById("editorWrap");
    if (wrap) {
      wrap.checked = appState.editor.wordWrap;
      wrap.addEventListener("change", () => {
        appState.editor.wordWrap = wrap.checked;
        editor.setOption("lineWrapping", wrap.checked);
      });
    }
    publish(editor.getValue(), false);
  };
  initialize();
}

function publish(code, modified = true) {
  appState.editor.currentSVG = code;
  appState.editor.isModified = modified;
  appState.editor.originalSize = new TextEncoder().encode(code).length;
  ranges = sourceElements(code);
  marker?.clear();
  marker = null;
  const size = document.getElementById("editorFileSize");
  if (size) size.textContent = appState.editor.originalSize + " B";
  clearTimeout(colorTimer);
  colorTimer = setTimeout(updateColorPickers, 100);
  window.dispatchEvent(
    new CustomEvent("editor-code-changed", { detail: { svgCode: code } }),
  );
}

function highlightSource(range) {
  marker?.clear();
  marker = null;
  if (!editor || !range || range.to > editor.getValue().length) return;
  const from = editor.posFromIndex(range.from),
    to = editor.posFromIndex(range.to);
  for (let line = from.line; line <= to.line; line++)
    for (const mark of editor.findMarksAt({ line, ch: 0 }))
      if (mark.__isFold) mark.clear();
  marker = editor.markText(from, to, { className: "svgaze-source-highlight" });
  editor.scrollIntoView({ from, to: editor.posFromIndex(range.openTo) }, 30);
}

function updateColorPickers() {
  if (!editor) return;
  colorMarks.forEach((mark) => mark.clear());
  colorMarks = [];
  const code = editor.getValue(),
    pattern =
      /(?:fill|stroke|stop-color|flood-color|color)\s*=\s*["']([^"']+)["']/g;
  let match;
  while ((match = pattern.exec(code))) {
    const value = match[1];
    if (
      /^(none|inherit|currentColor|transparent|url\(|var\()/i.test(value) ||
      !CSS.supports("color", value)
    )
      continue;
    const from = match.index + match[0].indexOf(value),
      input = document.createElement("input");
    input.type = "color";
    input.className = "svgaze-inline-color";
    input.value = colorHex(value);
    input.setAttribute("aria-label", value);
    const bookmark = editor.setBookmark(editor.posFromIndex(from), {
      widget: input,
      insertLeft: true,
    });
    colorMarks.push(bookmark);
    input.addEventListener("change", () => {
      const pos = bookmark.find();
      if (!pos) return;
      const at = editor.indexFromPos(pos);
      editor.replaceRange(
        input.value,
        pos,
        editor.posFromIndex(at + value.length),
        "svgaze-color",
      );
    });
  }
}

export function getEditorContent() {
  return editor ? editor.getValue() : appState.editor.currentSVG || "";
}
export function setEditorContent(code, { modified = true } = {}) {
  if (!editor) {
    publish(code, modified);
    return;
  }
  const previous = editor.getValue();
  if (previous === code) {
    if (!modified) appState.editor.isModified = false;
    window.dispatchEvent(new CustomEvent("editor-document-state-changed"));
    return;
  }
  let start = 0;
  while (
    start < previous.length &&
    start < code.length &&
    previous[start] === code[start]
  )
    start++;
  let oldEnd = previous.length,
    newEnd = code.length;
  while (
    oldEnd > start &&
    newEnd > start &&
    previous[oldEnd - 1] === code[newEnd - 1]
  ) {
    oldEnd--;
    newEnd--;
  }
  nextModified = modified;
  try {
    editor.replaceRange(
      code.slice(start, newEnd),
      editor.posFromIndex(start),
      editor.posFromIndex(oldEnd),
      "svgaze-edit",
    );
  } finally {
    nextModified = undefined;
  }
  appState.editor.isModified = modified;
}
export function clearEditor() {
  setEditorContent("");
  appState.editor.fileName = "untitled.svg";
}
export function focusEditor() {
  editor?.focus();
}
export function getCodeEditor() {
  return editor;
}
export default {
  initCodeEditor,
  getEditorContent,
  setEditorContent,
  clearEditor,
  focusEditor,
};
