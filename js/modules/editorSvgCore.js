// Shared local SVG operations. No uploads or remote services.
export function parse(svg) {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  if (
    doc.querySelector("parsererror") ||
    doc.documentElement.localName !== "svg"
  )
    throw new Error(
      doc.querySelector("parsererror")?.textContent?.split("\n")[0] ||
        "Enter a valid <svg> document.",
    );
  return doc;
}
export function serialize(doc) {
  return new XMLSerializer().serializeToString(doc);
}
function pixelLength(value, fallback) {
  const match = String(value || "")
    .trim()
    .match(/^((?:\d+(?:\.\d*)?|\.\d+))(px|in|cm|mm|pt|pc)?$/i);
  if (!match || Number(match[1]) <= 0) return fallback;
  return (
    Number(match[1]) *
    { px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 16 }[
      match[2]?.toLowerCase() || "px"
    ]
  );
}
export function dimensions(svg) {
  const root = parse(svg).documentElement;
  let vb = (root.getAttribute("viewBox") || "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (
    vb.length !== 4 ||
    vb.some((n) => !Number.isFinite(n)) ||
    vb[2] <= 0 ||
    vb[3] <= 0
  )
    vb = [
      0,
      0,
      pixelLength(root.getAttribute("width"), 400),
      pixelLength(root.getAttribute("height"), 400),
    ];
  return {
    w: pixelLength(root.getAttribute("width"), vb[2]),
    h: pixelLength(root.getAttribute("height"), vb[3]),
    vb,
  };
}
export function resize(svg, w, h) {
  const d = parse(svg);
  if (!(w > 0 && h > 0))
    throw new Error("Dimensions must be greater than zero.");
  const old = dimensions(svg);
  if (!d.documentElement.hasAttribute("viewBox"))
    d.documentElement.setAttribute("viewBox", old.vb.join(" "));
  d.documentElement.setAttribute("width", w);
  d.documentElement.setAttribute("height", h);
  return serialize(d);
}
// Compose toolbar transforms into a single matrix. Only attribute-free wrapper
// groups are folded; named/styled groups and their original transforms stay intact.
const stationaryNodes = new Set(["defs", "title", "desc", "style", "metadata"]);
const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
function wrapperMatrix(value) {
  const calls = [
    ...value.matchAll(/(matrix|translate|scale|rotate)\s*\(([^()]*)\)/g),
  ];
  if (
    !calls.length ||
    value.replace(/(matrix|translate|scale|rotate)\s*\([^()]*\)/g, "").trim()
  )
    return null;
  let result = [1, 0, 0, 1, 0, 0];
  for (const [, name, args] of calls) {
    const numbers = args
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (numbers.some((n) => !Number.isFinite(n))) return null;
    let next;
    if (name === "matrix" && numbers.length === 6) next = numbers;
    else if (name === "translate" && [1, 2].includes(numbers.length))
      next = [1, 0, 0, 1, numbers[0], numbers[1] || 0];
    else if (name === "scale" && [1, 2].includes(numbers.length))
      next = [numbers[0], 0, 0, numbers[1] ?? numbers[0], 0, 0];
    else if (name === "rotate" && numbers.length === 1 && numbers[0] === 90)
      next = [0, 1, -1, 0, 0, 0];
    else return null;
    result = multiply(result, next);
  }
  // Recognize only flips and quarter turns emitted by the editor, not arbitrary art transforms.
  const [a, b, c, d] = result;
  return [a, b, c, d].every((n) => [-1, 0, 1].includes(n)) &&
    Math.abs(a) + Math.abs(b) === 1 &&
    Math.abs(c) + Math.abs(d) === 1 &&
    Math.abs(a * d - b * c) === 1
    ? result
    : null;
}
export function transformSvg(svg, type) {
  if (!["rotate", "x", "y"].includes(type))
    throw new Error("Unknown SVG transformation.");
  const d = parse(svg),
    r = d.documentElement;
  const {
    vb: [x, y, w, h],
    w: pw,
    h: ph,
  } = dimensions(svg);
  let matrix =
    type === "rotate"
      ? [0, 1, -1, 0, x + y + h, y - x]
      : type === "x"
        ? [-1, 0, 0, 1, 2 * x + w, 0]
        : [1, 0, 0, -1, 0, 2 * y + h];
  const movable = (node) =>
    node.nodeType !== 1 || !stationaryNodes.has(node.localName);
  while (true) {
    const elements = [...r.children].filter(movable);
    const significantText = [...r.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim(),
    );
    const group = elements[0];
    if (
      significantText ||
      elements.length !== 1 ||
      group.localName !== "g" ||
      group.attributes.length !== 1 ||
      !group.hasAttribute("transform")
    )
      break;
    const previous = wrapperMatrix(group.getAttribute("transform"));
    if (!previous) break;
    matrix = multiply(matrix, previous);
    group.replaceWith(...group.childNodes);
  }
  matrix = matrix.map((n) => Number(n.toPrecision(15)) || 0);
  const identity = matrix.every((n, i) => n === [1, 0, 0, 1, 0, 0][i]);
  if (!identity) {
    const group = d.createElementNS(r.namespaceURI, "g");
    group.setAttribute("transform", `matrix(${matrix.join(" ")})`);
    const content = [...r.childNodes].filter(movable);
    // Keep definitions and metadata at the root, in their existing relative order.
    if (content.length) r.insertBefore(group, content[0]);
    else r.append(group);
    for (const child of content) group.append(child);
  }
  if (type === "rotate") {
    r.setAttribute("viewBox", `${x} ${y} ${h} ${w}`);
    r.setAttribute("width", ph);
    r.setAttribute("height", pw);
  }
  return serialize(d);
}

const colorAttrs = [
  "fill",
  "stroke",
  "stop-color",
  "flood-color",
  "lighting-color",
  "color",
];
function eachColor(doc, fn) {
  for (const e of doc.querySelectorAll("*")) {
    for (const a of colorAttrs)
      if (e.hasAttribute(a)) {
        const v = e.getAttribute(a);
        const out = fn(v);
        if (out !== v) e.setAttribute(a, out);
      }
    for (const a of ["style"])
      if (e.hasAttribute(a)) {
        e.setAttribute(
          a,
          e
            .getAttribute(a)
            .replace(
              /((?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*:\s*)([^;]+)/g,
              (_, p, v) => p + fn(v.trim()),
            ),
        );
      }
    if (e.localName === "style")
      e.textContent = e.textContent.replace(
        /((?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*:\s*)([^;}]+)/g,
        (_, p, v) => p + fn(v.trim()),
      );
  }
}
export function colors(svg) {
  const out = new Map();
  eachColor(parse(svg), (v) => {
    if (
      !/^(none|inherit|currentColor|transparent|url\(|var\()/i.test(v) &&
      CSS.supports("color", v)
    )
      out.set(v, (out.get(v) || 0) + 1);
    return v;
  });
  return [...out].map(([value, count]) => ({ value, count }));
}
export function replaceColor(svg, old, color) {
  if (color !== "currentColor" && !CSS.supports("color", color))
    throw new Error("Invalid color.");
  const d = parse(svg);
  eachColor(d, (v) =>
    (old === null && !/^(none|inherit|url\(|var\()/i.test(v)) || v === old
      ? color
      : v,
  );
  return serialize(d);
}
export function colorHex(value) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = value;
  return ctx.fillStyle.startsWith("#") ? ctx.fillStyle : "#000000";
}
export function dataUri(svg, base64 = false) {
  if (!base64) return "data:image/svg+xml," + encodeURIComponent(svg);
  const arr = new TextEncoder().encode(svg);
  let binary = "";
  for (let i = 0; i < arr.length; i += 8192)
    binary += String.fromCharCode(...arr.subarray(i, i + 8192));
  return "data:image/svg+xml;base64," + btoa(binary);
}
export function download(text, name, type = "image/svg+xml") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function png(svg, width, height, background = "transparent") {
  if (!(
    width > 0 &&
    height > 0 &&
    width <= 16384 &&
    height <= 16384 &&
    width * height <= 64000000
  ))
    throw new Error(
      "PNG dimensions must be positive and at most 64 megapixels (16384 px per side).",
    );
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(
          new Error("SVG could not be rasterized. Check external resources."),
        );
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(image, 0, 0, width, height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("PNG export failed."))),
        "image/png",
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
