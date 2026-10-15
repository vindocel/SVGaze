import test from "node:test";
import assert from "node:assert/strict";
import { installDOM } from "./dom.mjs";
installDOM();
const { setElementProperty } = await import("../js/modules/editorInspector.js");
const { parse } = await import("../js/modules/editorSvgCore.js");

test("inspector preserves markup outside the selected opening tag and updates inline overrides", () => {
  const source =
    '<svg xmlns="http://www.w3.org/2000/svg"><!--keep--><g id="a>b"><rect style="fill:red;stroke:blue" width="30"></rect><circle r="5"/></g></svg>';
  const result = setElementProperty(source, 2, "fill", "#3b82f6");
  assert.ok(
    result.startsWith(
      '<svg xmlns="http://www.w3.org/2000/svg"><!--keep--><g id="a>b">',
    ),
  );
  assert.ok(result.endsWith('</rect><circle r="5"/></g></svg>'));
  assert.equal(parse(result).querySelector("rect").style.fill, "#3b82f6");
  assert.equal((result.match(/xmlns=/g) || []).length, 1);
});

test("inspector rejects invalid geometry and escapes values without injecting XML nodes", () => {
  const source = '<svg><rect width="20" height="20"/></svg>';
  assert.throws(() => setElementProperty(source, 1, "width", "-1"));
  assert.throws(() => setElementProperty(source, 1, "opacity", "2"));
  assert.throws(() => setElementProperty(source, 1, "id", "different"));
  const result = setElementProperty(
    source,
    1,
    "fill",
    'red"/><script>bad</script>',
  );
  assert.equal(parse(result).querySelector("script"), null);
  assert.equal(parse(result).querySelectorAll("rect").length, 1);
});
