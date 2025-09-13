import { PromiseExecutor } from '@nx/devkit';
import { AdentaJsUiExecutorSchema } from './schema.js';

const runExecutor: PromiseExecutor<AdentaJsUiExecutorSchema> = async (
  options,
) => {
  console.log('Executor ran for AdentaJsUi', options);
  return {
    success: true,
  };
};

export default runExecutor;
