import { ExecutorContext } from '../../../types/index.js';

import { AdentaJsCmsExecutorSchema } from './schema.js';
import executor from './index.js';

const options: AdentaJsCmsExecutorSchema = {};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  }
};

describe('AdentaJsCms Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
