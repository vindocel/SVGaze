import { optimize } from '../vendor/optimizer.js';
import { runOptimization } from './editorOptimizerEngine.js';
self.onmessage = ({ data: { id, source, config, format } }) => {
  try {
    self.postMessage({ id, result: runOptimization(optimize, source, config, format) });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};
