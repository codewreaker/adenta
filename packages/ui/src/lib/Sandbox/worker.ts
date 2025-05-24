let buildWorker: Worker | null = null;

export function initBuildWorker() {
  if (buildWorker) return buildWorker;
  
  // Create the worker
  buildWorker = new Worker(
    new URL('./buildWorker.ts', import.meta.url),
    { type: 'module' }
  );

  return buildWorker;
}

export function terminateBuildWorker() {
  if (buildWorker) {
    buildWorker.terminate();
    buildWorker = null;
  }
}
