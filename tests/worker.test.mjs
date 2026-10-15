import test from 'node:test';
import assert from 'node:assert/strict';
import { Worker } from 'node:worker_threads';
import { once } from 'node:events';
import { normalizeConfig } from '../js/modules/editorOptimizerEngine.js';
test('the shipped browser worker module runs real optimization in a separate thread and reports parse failures', async () => {
  const worker = new Worker(new URL('./fixtures/worker-bootstrap.mjs', import.meta.url), {
    type: 'module',
  });
  try {
    const [ready] = await once(worker, 'message');
    assert.equal(ready.ready, true);
    worker.postMessage({
      id: 1,
      source:
        '<svg xmlns="http://www.w3.org/2000/svg"><!-- remove --><rect width="10" height="10"/></svg>',
      config: normalizeConfig(),
    });
    const [success] = await once(worker, 'message');
    assert.equal(success.id, 1);
    assert.match(success.result, /<svg/);
    assert.doesNotMatch(success.result, /<!--/);
    worker.postMessage({ id: 2, source: '<svg><g></svg>', config: normalizeConfig() });
    const [failure] = await once(worker, 'message');
    assert.equal(failure.id, 2);
    assert.match(failure.error, /Unexpected close tag/);
  } finally {
    await worker.terminate();
  }
});
