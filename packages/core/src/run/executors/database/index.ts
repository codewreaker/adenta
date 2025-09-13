import { PromiseExecutor } from '@nx/devkit';
import { AdentaJsDbExecutorSchema } from './schema.js';

const runExecutor: PromiseExecutor<AdentaJsDbExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for AdentaJsDb', options);
  return {
    success: true,
  };
};

export default runExecutor;
