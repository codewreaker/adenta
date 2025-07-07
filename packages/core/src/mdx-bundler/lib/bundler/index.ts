// packages/core/src/mdx-bundler/lib/index.ts
import { bundleMDX } from 'mdx-bundler';
//import rehypeShiki from './shiki.js';
import { loadMdxFiles } from './loaders.js';
import {errorContent, CollatedErrors} from './error-render.js'
import { BundleMDXOptions, StandardSourceOutput, AdentaBundleMDxOptions, BundledMdxResult, MdxSourceInput } from '../types.js';
import { basename, resolve } from 'path';



const mdxOptions: BundleMDXOptions['mdxOptions'] = (options) => {
  // options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeShiki];
  return options;
};

// --- Utility: Bundle MDX files with shiki highlighting ---
export async function bundleMdxFiles(
  files: StandardSourceOutput[],
  options?: AdentaBundleMDxOptions
): Promise<BundledMdxResult[]> {
  return Promise.all(
    files.map(async ({ filepath, content, type }) => {
      try {
        if(type === 'local'){
          const cwd =  basename(filepath);
          options = {...options, cwd};
        }
        const { code, frontmatter } = await bundleMDX({
          source: content,
          mdxOptions,
          ...options,
        });

        return { filepath, code, frontmatter };
      } catch (error) {
        console.log(error);
        CollatedErrors[filepath] = error as Error;
        const { code, frontmatter } = await bundleMDX({
          source: errorContent(filepath),
          mdxOptions,
        }).catch((internalError)=>{
          console.error(internalError);
          return {code: errorContent(internalError), frontmatter:{}}
        });
        // Use the dynamic error MDX template and frontmatter
        return {
          filepath,
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
