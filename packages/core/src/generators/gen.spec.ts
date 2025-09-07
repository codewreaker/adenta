import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { adentaGenGenGenerator } from './gen';
import { AdentaGenGenGeneratorSchema } from './schema';

describe('@adenta/gen:gen generator', () => {
  let tree: Tree;
  const options: AdentaGenGenGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await adentaGenGenGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
