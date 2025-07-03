// packages/core/src/index.ts
import { getMDXCollection } from './collection.js';
import { loadFromGithub, loadFromFiles, storeDoc } from './loaders.js';
import type { BuildOptions } from 'esbuild';
import {} from 'mdx-bundler/client'

const _bundleMDX = async (...args) => ({
  frontmatter: {
    title: 'Dummy Title',
    description: 'This is a dummy description.',
    publishedAt: '2023-01-01',
    updatedAt: '2023-01-02',
    tags: ['dummy', 'test'],
    author: 'Dummy Author',
    draft: false,
    featured: false,
  },

  body: `
   import * as React from "react";
   export default function DummyComponent() {
     return (
       <div>
         <h1>Dummy Title</h1>
         <p>This is a dummy description.</p>
         <p>Published: 2023-01-01</p>
         <p>Updated: 2023-01-02</p>
         <ul>
           <li>dummy</li>
           <li>test</li>
           <p>${JSON.stringify(args, null, 4)}</p>
         </ul>
         <p>Author: Dummy Author</p>
         <p>Status: Draft: false, Featured: false</p>
         <div>This is the dummy body content.</div>
       </div>
     );
   }
 `,
});

const parseMdx = async (source: string, esbuildOptions: BuildOptions) => {
  try {
    const { code, frontmatter } = await bundleMDX({
      source,
      esbuildOptions:(options: BuildOptions, frontmatter: Frontmatter) => {
        console.log(options);
        debugger
        return {
          ...options,
        }
      },
      files: {
        './demo.tsx': `
    import * as React from 'react'
    
    function Demo() {
      return <div>Neat demo!</div>
    }
    
    export default Demo
        `,
      },
    });
    return { body: code, frontmatter };
  } catch (error) {
    console.error(error);
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
        async (content: string, filePath: File) => {
          console.log(`LOCAL FILES: [${filePath}]`);
          const { body, frontmatter } = await parseMdx(
            loadedContent,
            buildOptions
          );
          await storeDoc(collection, body, frontmatter, filePath);
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
