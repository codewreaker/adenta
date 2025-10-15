import { PromiseExecutor } from '@nx/devkit';
import { AdentaJsCmsExecutorSchema } from './schema.js';

const runExecutor: PromiseExecutor<AdentaJsCmsExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for AdentaJsCms', options);
  return {
    success: true,
  };
};

export default runExecutor;
