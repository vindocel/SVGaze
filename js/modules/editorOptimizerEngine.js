import { defaults } from './editorOptimizerConfig.js';

export function normalizeConfig(saved) {
  const values = { ...defaults };
  if (Array.isArray(saved?.plugins))
    for (const entry of saved.plugins)
      if (entry && Object.hasOwn(values, entry.name) && typeof entry.enabled === 'boolean')
        values[entry.name] = entry.enabled;
  if (saved?.options)
    for (const key of Object.keys(values))
      if (typeof saved.options[key] === 'boolean') values[key] = saved.options[key];
  const precision = (v) => Number.isInteger(v) && v >= 0 && v <= 8;
  return {
    options: values,
    number: precision(saved?.number) ? saved.number : 3,
    transform: precision(saved?.transform) ? saved.transform : 5,
  };
}
export function runOptimization(optimize, source, config, format) {
  const plugins = format
    ? []
    : Object.entries(config.options)
        .filter(([, enabled]) => enabled)
        .map(([name]) => ({
          name,
          params:
            name === 'prefixIds'
              ? { prefix: 'svgaze' }
              : ['convertTransform', 'convertPathData'].includes(name)
                ? { transformPrecision: config.transform }
                : {},
        }));
  return optimize(source, {
    floatPrecision: config.number,
    plugins,
    js2svg: {
      pretty: format?.pretty || false,
      indent: format?.indent === 'tab' ? '\t' : Number(format?.indent) || 2,
      useShortTags: format?.shortTags !== false,
    },
  }).data;
}
export class OptimizationClient {
  constructor(worker) {
    this.worker = worker;
    this.sequence = 0;
    this.pending = new Map();
    this.failure = null;
    worker.onmessage = ({ data }) => {
      const request = this.pending.get(data.id);
      if (!request) return;
      this.pending.delete(data.id);
      data.error ? request.reject(new Error(data.error)) : request.resolve(data.result);
    };
    worker.onerror = () => {
      this.failure = new Error('SVG optimizer could not load.');
      for (const request of this.pending.values()) request.reject(this.failure);
      this.pending.clear();
    };
  }
  run(source, config, format) {
    if (this.failure) return Promise.reject(this.failure);
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending.set(id, { resolve, reject });
      try {
        this.worker.postMessage({ id, source, config, format });
      } catch (error) {
        this.pending.delete(id);
        reject(error);
      }
    });
  }
  close() {
    this.worker.terminate();
    for (const request of this.pending.values()) request.reject(new Error('Optimizer closed.'));
    this.pending.clear();
  }
}
