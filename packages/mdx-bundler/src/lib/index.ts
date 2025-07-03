// packages/core/src/index.ts
import { getMDXCollection } from './collection.js';
import { loadFromGithub, loadFromFiles, storeDoc } from './loaders.js';
import type { BuildOptions } from 'esbuild';
import {bundleMDX} from 'mdx-bundler'


const parseMdx = async (source: string, esbuildOptions: BuildOptions) => {
  try {
    const { code, frontmatter } = await bundleMDX({
      source,
      esbuildOptions:(options: BuildOptions) => {
        console.log(options);
        return {
          ...options,
          ...esbuildOptions
        }
      },
    });
    return { body: code, frontmatter };
  } catch (error) {
    console.error(error);
    return { body: '', frontmatter: {} };
  }
};

const createMdxBundler = (
  loadOptions: GeneratorConfig['loadOptions'] = { filePaths: [] },
  CollectionConfig: CollectionConfigCallbacks = {},
  buildOptions: GeneratorConfig['buildOptions'] = {}
) => {
  const collection = getMDXCollection(CollectionConfig);

  const { filePaths, ...githubOpts } = loadOptions;

  const load = async () => {
    if (githubOpts?.repo && githubOpts?.owner && githubOpts?.docsPath) {
      await loadFromGithub(
        githubOpts,
        async (loadedContent: string, filePath: string) => {
          console.log(`GitHub: [${filePath}]`);
          const { body, frontmatter } = await parseMdx(
            loadedContent,
            buildOptions
          );
          await storeDoc(collection, body, frontmatter, filePath);
        }
      );
    } else {
      await loadFromFiles(
        filePaths,
        async (loadedContent: string, filePath: File) => {
          console.log(`LOCAL FILES: [${filePath}]`);
          const { body, frontmatter } = await parseMdx(
            loadedContent,
            buildOptions
          );
          await storeDoc(collection, body, frontmatter, filePath as unknown as string);
        }
      );
    }
  };

  return {
    load,
    collection,
    getAllDocs: () => Array.from(collection.values()),
    getDoc: (slug: string) => collection.get(slug),
  };
};

/**
 * Example usage:
 *
 * const generator = createMdxBundler(config, collectionConfig, esbuildOptions)
 * // For user file uploads:
 * const res = await generator.loadFromFiles(Array.from(input.files))
 * // For remote (GitHub):
 */
export { createMdxBundler };
