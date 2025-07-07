// packages/core/src/mdx-bundler/lib/index.ts
import { bundleMDX } from 'mdx-bundler';
import rehypeShiki from './shiki.js';
import { loadMdxFiles } from './loaders.js';
import {errorContent, CollatedErrors} from './error-render.js'
import { BundleMDXOptions, StandardSourceOutput, AdentaBundleMDxOptions, BundledMdxResult, MdxSourceInput } from '../types.js';



const mdxOptions: BundleMDXOptions['mdxOptions'] = (options) => {
  options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeShiki];
  return options;
};

// --- Utility: Bundle MDX files with shiki highlighting ---
export async function bundleMdxFiles(
  files: StandardSourceOutput[],
  options?: AdentaBundleMDxOptions
): Promise<BundledMdxResult[]> {
  return Promise.all(
    files.map(async ({ filename, content }) => {
      try {
        const { code, frontmatter } = await bundleMDX({
          source: content,
          cwd: process.cwd(),
          mdxOptions,
          ...options,
        });

        return { filename, code, frontmatter };
      } catch (error) {
        console.log(error);
        CollatedErrors[filename] = error as Error;
        const { code, frontmatter } = await bundleMDX({
          source: errorContent(filename),
          mdxOptions,
        });
        // Use the dynamic error MDX template and frontmatter
        return {
          filename,
          code,
          frontmatter,
        };
      }
    })
  );
}

// --- Unified API ---
export async function loadAndBundleMdx(
  input: MdxSourceInput,
  options?: AdentaBundleMDxOptions
): Promise<BundledMdxResult[]> {
  const files = await loadMdxFiles(input);
  return bundleMdxFiles(files, options);
}
