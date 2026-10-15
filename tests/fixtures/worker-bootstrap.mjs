import { parentPort } from 'node:worker_threads';
globalThis.self = { postMessage: (message) => parentPort.postMessage(message) };
await import('../../js/modules/editorOptimizerWorker.js');
parentPort.on('message', (data) => self.onmessage({ data }));
parentPort.postMessage({ ready: true });
