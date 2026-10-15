import test from 'node:test';
import assert from 'node:assert/strict';
import { optimize } from '../js/vendor/optimizer.js';
import { defaults, options } from '../js/modules/editorOptimizerConfig.js';
import {
  normalizeConfig,
  runOptimization,
  OptimizationClient,
} from '../js/modules/editorOptimizerEngine.js';
const source =
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><title>ação</title><!-- hello --><rect x="1.123456" width="20" height="10" fill="#ff0000"/></svg>';
test('all 41 visible controls and internal defaults resolve to real SVGO plugins', () => {
  assert.equal(options.length, 41);
  for (const name of Object.keys(defaults))
    assert.ok(optimize(source, { plugins: [name] }).data.includes('<svg'));
});
test('changing a checkbox changes the actual optimization instead of applying a hardcoded preset', () => {
  const config = normalizeConfig();
  config.options.removeTitle = false;
  config.options.removeDimensions = false;
  config.options.removeViewBox = false;
  const preserved = runOptimization(optimize, source, config);
  assert.match(preserved, /<title>/);
  assert.match(preserved, /width="200"/);
  assert.match(preserved, /viewBox=/);
  config.options.removeTitle = true;
  config.options.removeDimensions = true;
  const changed = runOptimization(optimize, source, config);
  assert.doesNotMatch(changed, /<title>|width="200"/);
  assert.match(changed, /viewBox=/);
});
test('legacy preferences migrate safely and numeric and transform precision stay independent', () => {
  const config = normalizeConfig({
    plugins: [
      { name: 'removeTitle', enabled: true },
      { name: 'notAPlugin', enabled: true },
    ],
    number: 0,
    transform: 8,
  });
  assert.equal(config.options.removeTitle, true);
  assert.equal(config.options.notAPlugin, undefined);
  assert.equal(config.number, 0);
  assert.equal(config.transform, 8);
  assert.equal(normalizeConfig({ number: 99 }).number, 3);
  const off = Object.fromEntries(Object.keys(defaults).map((key) => [key, false]));
  off.cleanupNumericValues = true;
  const out = runOptimization(optimize, source, { options: off, number: 1, transform: 5 });
  assert.match(out, /x="1\.1"/);
});
test('formatting preserves mixed text, entities and CDATA and supports tabs/long tags', () => {
  const input =
    '<svg xmlns="http://www.w3.org/2000/svg"><text>A &amp; B<tspan> C </tspan>D</text><style><![CDATA[.a{fill:red}]]></style><g/></svg>';
  const output = runOptimization(optimize, input, normalizeConfig(), {
    pretty: true,
    indent: 'tab',
    shortTags: false,
  });
  assert.match(output, /A &amp; B/);
  assert.match(output, /> C <\/tspan>D/);
  assert.match(output, /CDATA/);
  assert.match(output, /\n\t<text>/);
  assert.doesNotMatch(output, /<g\/>/);
});
test('invalid SVG fails rather than falling back to weaker optimization', () =>
  assert.throws(
    () => runOptimization(optimize, '<svg><rect></svg>', normalizeConfig()),
    /Unexpected close tag/,
  ));
test('worker responses use request identities and failures reject pending work', async () => {
  const fake = {
    postMessage(message) {
      this.messages.push(message);
    },
    messages: [],
    terminate() {},
  };
  const client = new OptimizationClient(fake);
  const a = client.run('a', normalizeConfig()),
    b = client.run('b', normalizeConfig());
  fake.onmessage({ data: { id: 2, result: 'B' } });
  fake.onmessage({ data: { id: 1, result: 'A' } });
  assert.equal(await a, 'A');
  assert.equal(await b, 'B');
  const failed = client.run('c', normalizeConfig());
  fake.onmessage({ data: { id: 3, error: 'invalid SVG' } });
  await assert.rejects(failed, /invalid SVG/);
  assert.equal(client.pending.size, 0);
  client.close();
});
test('worker load failures reject pending and future requests instead of hanging the editor', async () => {
  const fake = { postMessage() {}, terminate() {} };
  const client = new OptimizationClient(fake),
    pending = client.run('source', normalizeConfig());
  fake.onerror();
  await assert.rejects(pending, /could not load/);
  await assert.rejects(client.run('another', normalizeConfig()), /could not load/);
  assert.equal(client.pending.size, 0);
  client.close();
});
