import { getEditorContent, setEditorContent } from "./editorCodeManager.js";
import { parse } from "./editorSvgCore.js";
import { sourceElements } from "./editorSvgMapper.js";
import { text } from "./editorText.js";
import { showToast } from "./toast.js";

let selection = null,
  writing = false,
  host;
const geometry = {
  rect: ["x", "y", "width", "height", "rx", "ry"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  line: ["x1", "y1", "x2", "y2"],
  image: ["x", "y", "width", "height"],
  text: ["x", "y", "font-size"],
  use: ["x", "y", "width", "height"],
};
export function setElementProperty(source, index, name, value) {
  const range = sourceElements(source)[index];
  const node = [...parse(source).querySelectorAll("*")][index];
  if (
    !range ||
    !node ||
    ![
      ...(geometry[node.localName] || []),
      "fill",
      "stroke",
      "stroke-width",
      "opacity",
      "transform",
      "d",
      "points",
    ].includes(name)
  )
    throw new Error(
      text("Selecione um elemento compatível.", "Select a compatible element."),
    );
  const numeric = [
    ...(geometry[node.localName] || []),
    "stroke-width",
    "opacity",
  ].includes(name);
  const scalar = value
    .trim()
    .match(
      /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)(px|pt|pc|mm|cm|in|em|ex|%)?$/i,
    );
  const amount = scalar ? Number(scalar[1]) : NaN;
  if (
    numeric &&
    value !== "" &&
    (!Number.isFinite(amount) ||
      ([
        "width",
        "height",
        "r",
        "rx",
        "ry",
        "stroke-width",
        "font-size",
      ].includes(name) &&
        amount < 0) ||
      (name === "opacity" && (scalar?.[2] || amount < 0 || amount > 1)))
  )
    throw new Error(text("Valor numérico inválido.", "Invalid numeric value."));
  // Serialize only this opening tag, preserving unrelated source, comments and formatting.
  if (value === "") node.removeAttribute(name);
  else node.setAttribute(name, value);
  if (
    node.hasAttribute("style") &&
    ["fill", "stroke", "opacity", "stroke-width"].includes(name)
  ) {
    const inline = document.createElement("span");
    inline.setAttribute("style", node.getAttribute("style"));
    if (inline.style.getPropertyValue(name)) {
      if (value === "") inline.style.removeProperty(name);
      else inline.style.setProperty(name, value);
      if (inline.style.length)
        node.setAttribute("style", inline.getAttribute("style"));
      else node.removeAttribute("style");
    }
  }
  const original = source.slice(range.from, range.openTo);
  const blank = node.cloneNode(false);
  let opening = new XMLSerializer().serializeToString(blank);
  opening = opening.slice(0, sourceElements(opening)[0].openTo);
  if (!node.hasAttribute("xmlns"))
    opening = opening.replace(/\sxmlns="[^"]*"/, "");
  const selfClosing = /\/\s*>$/.test(original);
  if (!selfClosing) opening = opening.replace(/\s*\/\s*>$/, ">");
  return source.slice(0, range.from) + opening + source.slice(range.openTo);
}
export function initEditorInspector(container) {
  host = container;
  for (const event of ["svg-element-select", "editor-element-focus"])
    window.addEventListener(event, (e) => {
      if (writing) return;
      selection = e.detail.range?.index ?? null;
      render();
    });
  window.addEventListener("editor-code-changed", () => {
    if (writing) return;
    selection = null;
    render();
  });
  render();
}
function render() {
  host.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = text("Elemento selecionado", "Selected element");
  host.append(title);
  let node;
  try {
    if (selection !== null)
      node = [...parse(getEditorContent()).querySelectorAll("*")][selection];
  } catch {}
  if (!node || node.localName === "svg") {
    const hint = document.createElement("p");
    hint.className = "workbench-hint";
    hint.textContent = text(
      "Clique em uma forma na prévia ou posicione o cursor no código para editar suas propriedades.",
      "Click a shape in preview or place the code cursor to edit its properties.",
    );
    host.append(hint);
    return;
  }
  const badge = document.createElement("code");
  badge.className = "workbench-element-name";
  badge.textContent = `<${node.localName}>${node.id ? " #" + node.id : ""}`;
  host.append(badge);
  const hint = document.createElement("p");
  hint.className = "workbench-hint";
  hint.textContent = text(
    "Valores locais; regras CSS e herança podem afetar a aparência.",
    "Local values; CSS rules and inheritance may affect appearance.",
  );
  host.append(hint);
  const attributes = [
    ...(geometry[node.localName] || []),
    "fill",
    "stroke",
    "stroke-width",
    "opacity",
    "transform",
  ];
  if (node.localName === "path") attributes.push("d");
  if (["polygon", "polyline"].includes(node.localName))
    attributes.push("points");
  for (const name of attributes) {
    const label = document.createElement("label");
    label.textContent = name;
    const field = document.createElement(
      ["d", "points", "transform"].includes(name) ? "textarea" : "input",
    );
    field.dataset.property = name;
    field.setAttribute("aria-label", name);
    field.value =
      node.style?.getPropertyValue(name) || node.getAttribute(name) || "";
    field.placeholder = text("Padrão / herdado", "Default / inherited");
    field.onchange = () => {
      try {
        writing = true;
        const source = getEditorContent();
        setEditorContent(
          setElementProperty(source, selection, name, field.value),
        );
        const range = sourceElements(getEditorContent())[selection];
        window.dispatchEvent(
          new CustomEvent("editor-element-focus", { detail: { range } }),
        );
      } catch (error) {
        showToast(error.message, "error");
        render();
      } finally {
        writing = false;
      }
    };
    label.append(field);
    host.append(label);
  }
}
