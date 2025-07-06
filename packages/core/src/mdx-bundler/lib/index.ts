// packages/core/src/mdx-bundler/lib/index.ts
import { bundleMDX } from 'mdx-bundler';
import { rehypeShiki } from './shiki-instance.js';
import { loadMdxFiles } from './loaders.js';

const errorContent = `
'---
title: Error in bundling
date: 2025-07-06
description: adenta bundler Error message
categories:
  - review
meta:
  keywords:
    - career
bannerCredit: Photo by [Joshua Earle](https://unsplash.com/photos/ICE__bo2Vws)
---

It's been an incredible decade. So much of my life has changed in the last 10
years. I'm going to share a few select highlights from my life in the last 10
years and then talk about some of the things I'm looking forward for the next
decade.
`;

const CollatedErrors = {}

// --- Utility: Bundle MDX files with shiki highlighting ---
export async function bundleMdxFiles<
  T extends {
    [key: string]: object;
  }
>(
  files: { filename: string; content: string; type: MdxSourceInput['type'] }[],
  options?: AdentaBundleMDxOptions<T>
): Promise<BundledMdxResult[]> {
  return Promise.all(
    files.map(async ({ filename, content }) => {
      try {
        const { code, frontmatter } = await bundleMDX({
          source: content,
          cwd: process.cwd(),
          mdxOptions(options) {
            options.rehypePlugins = [
              ...(options.rehypePlugins || []),
              rehypeShiki,
            ];
            return options;
          },
          ...options,
        });
        return { filename, code, frontmatter };
      } catch (error) {
        console.error(error);
        return { filename, code: errorContent, frontmatter: {} };
      }
    })
  );
}

// --- Unified API ---
export async function loadAndBundleMdx(
  input: MdxSourceInput,
  options: AdentaBundleMDxOptions<{
    [key: string]: object;
  }> = {}
): Promise<BundledMdxResult[]> {
  const files = await loadMdxFiles(input);
  return bundleMdxFiles(files, options);
}
