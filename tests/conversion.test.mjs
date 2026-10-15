import test from "node:test";
import assert from "node:assert/strict";
import { parse as parseJavaScript } from "@babel/parser";
import { installDOM } from "./dom.mjs";
installDOM();
const { convertComponent } =
  await import("../js/modules/editorComponentConverter.js");
const { parse, dimensions, resize, transformSvg, dataUri } =
  await import("../js/modules/editorSvgCore.js");
const { sourceElements, previewDocument } =
  await import("../js/modules/editorSvgMapper.js");
const { asIco, validateRasterSize } =
  await import("../js/modules/editorRasterExport.js");

test("React JSX and TSX remain valid with styles, namespaces, ARIA, mixed text, quotes and semicolons", () => {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Bob's icon; &quot;hi&quot;" width="100%" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h10"/></defs><use xlink:href="#a" class="icon" style="stroke-width:2;fill:red"/><text xml:space="preserve">A &amp; B; <tspan>{C}</tspan> D</text></svg>`;
  for (const typescript of [false, true])
    for (const singleQuotes of [false, true])
      for (const stripSemicolons of [false, true]) {
        const code = convertComponent(source, {
          typescript,
          singleQuotes,
          stripSemicolons,
        });
        assert.doesNotThrow(() =>
          parseJavaScript(code, {
            sourceType: "module",
            plugins: ["jsx", ...(typescript ? ["typescript"] : [])],
          }),
        );
        assert.match(code, /aria-label=/);
        assert.match(code, /xlinkHref=/);
        assert.match(code, /className=/);
        assert.match(code, /strokeWidth/);
        assert.match(code, /B;/);
        assert.match(code, /\{C\}/);
      }
});
test("React Native imports every used component and uses SvgProps rather than browser DOM props", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><defs><linearGradient id="a"><stop offset="0" stop-color="red"/></linearGradient><clipPath id="clip"><rect width="10" height="10"/></clipPath></defs><g clip-path="url(#clip)"><ellipse rx="3" ry="2"/><text><tspan>ação</tspan></text></g></svg>';
  const code = convertComponent(source, { native: true, typescript: true });
  const ast = parseJavaScript(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const imports = ast.program.body
    .filter(
      (n) =>
        n.type === "ImportDeclaration" && n.source.value === "react-native-svg",
    )
    .flatMap((n) => n.specifiers.map((s) => s.local.name));
  for (const name of [
    "Svg",
    "Defs",
    "LinearGradient",
    "Stop",
    "ClipPath",
    "Rect",
    "G",
    "Ellipse",
    "Text",
    "TSpan",
    "SvgProps",
  ])
    assert.ok(imports.includes(name), name);
  assert.doesNotMatch(code, /SVGSVGElement/);
});
test("dimension inference, non-square rotation and flipping preserve the viewport", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 20 200 100"><defs><linearGradient id="a"/></defs><rect width="200" height="100"/></svg>';
  assert.equal(dimensions(source).w, 200);
  const rotated = transformSvg(source, "rotate");
  assert.deepEqual(dimensions(rotated).vb, [10, 20, 100, 200]);
  assert.ok(parse(rotated).querySelector("svg > defs"));
  assert.match(transformSvg(source, "x"), /matrix\(-1 0 0 1 220 0\)/);
  assert.deepEqual(dimensions(resize(source, 500, 250)).vb, [10, 20, 200, 100]);
});
test("20 flips cancel without accumulating wrappers, including nonzero fractional viewBox origins", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="10.5 -20.25 200 100"><defs><clipPath id="c"><rect width="20" height="30"/></clipPath></defs><g id="art" transform="translate(7 9)" clip-path="url(#c)"><path d="M10 20h30v40z"/></g></svg>';
  const original = new XMLSerializer().serializeToString(parse(source));
  for (const axis of ["x", "y"]) {
    let current = source;
    for (let i = 1; i <= 20; i++) {
      current = transformSvg(current, axis);
      const root = parse(current).documentElement;
      assert.equal(root.querySelectorAll("g").length, (i % 2) + 1);
      assert.equal(
        root.querySelector("#art").getAttribute("transform"),
        "translate(7 9)",
      );
      assert.ok(root.querySelector("svg > defs"));
      if (i % 2 === 0) assert.equal(current, original);
    }
  }
});

test("four rotations restore a rectangular viewport and mixed operations share at most one wrapper", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="10 20 200 100"><rect x="10" y="20" width="200" height="100"/></svg>';
  let current = source;
  for (let i = 0; i < 4; i++) {
    current = transformSvg(current, "rotate");
    assert.ok(parse(current).querySelectorAll("g").length <= 1);
  }
  assert.equal(current, new XMLSerializer().serializeToString(parse(source)));
  for (const op of ["x", "y", "x", "y"]) current = transformSvg(current, op);
  assert.equal(parse(current).querySelectorAll("g").length, 0);
  for (const op of ["rotate", "x", "y", "rotate", "x", "rotate", "y"]) {
    current = transformSvg(current, op);
    assert.ok(parse(current).querySelectorAll("g").length <= 1);
  }
});

test("old stacked toolbar transforms collapse and arbitrary artwork transforms remain unchanged", () => {
  const original =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><g transform="rotate(23)"><rect width="10" height="20"/></g></svg>';
  let current =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
    '<g transform="translate(0 400) scale(1 -1)">'.repeat(19) +
    '<rect width="10" height="20"/>' +
    "</g>".repeat(19) +
    "</svg>";
  current = transformSvg(current, "y");
  assert.equal(parse(current).querySelectorAll("g").length, 0);
  current = transformSvg(transformSvg(original, "y"), "y");
  assert.equal(current, new XMLSerializer().serializeToString(parse(original)));
  const noNamespace = transformSvg(
    transformSvg('<svg viewBox="0 0 10 20"><circle r="2"/></svg>', "x"),
    "x",
  );
  assert.equal(parse(noNamespace).querySelectorAll("g").length, 0);
});

test("preview is transparent and isolates style/script from the application, including SVG without xmlns", () => {
  const source =
    '<svg width="30" height="30"><style>body{display:none}</style><script>alert(1)</script><circle onclick="bad()" cx="15" cy="15" r="10"/></svg>';
  const output = previewDocument(source, sourceElements(source));
  const doc = new DOMParser().parseFromString(output, "text/html");
  assert.equal(doc.querySelector("script"), null);
  assert.equal(doc.querySelector("[onclick]"), null);
  assert.match(output, /background:transparent!important/);
  assert.match(output, /default-src 'none'/);
  assert.doesNotMatch(source, /data-studio-key/);
  assert.doesNotThrow(() =>
    convertComponent('<svg><rect style="fill:red"/></svg>'),
  );
});
test("source ranges distinguish minified siblings, multiline attributes and > inside values", () => {
  const source =
      '<svg><!-- <rect/> --><g id="a>b"><rect\n width="2"/><circle/><rect width="4"/></g></svg>',
    elements = sourceElements(source);
  assert.deepEqual(
    elements.map((e) => e.name),
    ["svg", "g", "rect", "circle", "rect"],
  );
  assert.equal(
    source.slice(elements[4].from, elements[4].to),
    '<rect width="4"/>',
  );
});
test("data URI Unicode round trips without corrupting text whitespace", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg"><text>ação  🎨</text></svg>';
  assert.equal(decodeURIComponent(dataUri(source).split(",")[1]), source);
  assert.equal(
    Buffer.from(dataUri(source, true).split(",")[1], "base64").toString("utf8"),
    source,
  );
});
test("ICO contains a correct PNG image entry and oversized raster exports fail before allocating canvas", async () => {
  const blob = new Blob([new Uint8Array([137, 80, 78, 71])], {
    type: "image/png",
  });
  const ico = await asIco(blob, 256, 256),
    view = new DataView(await ico.arrayBuffer());
  assert.equal(view.getUint16(2, true), 1);
  assert.equal(view.getUint8(6), 0);
  assert.equal(view.getUint32(14, true), 4);
  assert.equal(view.getUint32(18, true), 22);
  assert.throws(() => validateRasterSize(257, 256, "ICO"));
  assert.throws(() => validateRasterSize(16384, 16384));
  assert.throws(() => validateRasterSize(0, 64));
});
