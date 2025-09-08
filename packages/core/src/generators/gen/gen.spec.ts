import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { adentaGenGenerator } from './index.js';
import { AdentaGenGeneratorSchema } from './schema.js';

describe('@adenta/gen:gen generator', () => {
  let tree: Tree;
  const options: AdentaGenGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await adentaGenGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
