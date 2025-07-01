// packages/core/src/index.ts
import { compile as compileMdx } from '@mdx-js/mdx';
import type { GeneratorConfig } from './define-config.js';
import { createCollection, CollectionConfig } from '@tanstack/db';
import { getMDXCollection } from './api.js';

// Browser implementation (in-memory, metadata via @tanstack/db)

// Utility: parse frontmatter (YAML frontmatter)
function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  if (match) {
    const frontmatterYaml = match[1];
    const body = match[2];
    const frontmatter: any = {};
    const lines = frontmatterYaml.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key] = value
            .slice(1, -1)
            .split(',')
            .map((v) => v.trim().replace(/['"]/g, ''));
        } else {
          frontmatter[key] = value.replace(/['"]/g, '');
        }
      }
    }
    return { frontmatter, body };
  }
  return { frontmatter: {}, body: content };
}

/**
 * Main generator class for loading, parsing, and rendering MDX/MD files.
 * Pass a config and a TanStack DB collection instance.
 */
export class MdxBlogGen {
  private opts: GeneratorConfig['buildOptions'];
  private collection: ReturnType<typeof createCollection<ParsedDoc>>;

  constructor(
    buildOptions: GeneratorConfig['buildOptions'],
    collection: ReturnType<typeof createCollection<ParsedDoc>>
  ) {
    this.collection = collection;
    this.opts = buildOptions;
  }

  /**
   * Load all MDX/MD files from a GitHub repo (recursively).
   */
  async loadFromGithub(options: {
    owner: string;
    repo: string;
    branch?: string;
    docsPath?: string;
    token?: string;
  }) {
    const { owner, repo, branch = 'main', docsPath = '', token } = options;
    const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${docsPath}?ref=${branch}`;
    const headers: Record<string, string> = token
      ? {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        }
      : { Accept: 'application/vnd.github.v3+json' };
    const response = await fetch(contentUrl, { headers });
    if (!response.ok) throw new Error('Failed to fetch content from GitHub');
    const files = await response.json();
    await this._loadFilesFromGithub(files, owner, repo, branch, token);
  }

  private async _loadFilesFromGithub(
    files: any[],
    owner: string,
    repo: string,
    branch: string,
    token?: string
  ) {
    for (const file of files) {
      if (
        file.type === 'file' &&
        (file.name.endsWith('.md') || file.name.endsWith('.mdx'))
      ) {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        await this._parseAndStoreDoc(content, file.path);
      } else if (file.type === 'dir') {
        const subContentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`;
        const headers: Record<string, string> = token
          ? {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            }
          : { Accept: 'application/vnd.github.v3+json' };
        const subResponse = await fetch(subContentUrl, { headers });
        const subFiles = await subResponse.json();
        await this._loadFilesFromGithub(subFiles, owner, repo, branch, token);
      }
    }
  }

  /**
   * Load from file paths (string[]) in Node/Vite context.
   */
  async loadFromFiles(
    { filePaths }: GeneratorConfig['file'] = { filePaths: [] }
  ) {
    const pathMod = await import('node:path');
    for (const filePath of filePaths) {
      const resolvedPath = pathMod.resolve(filePath);
      // Dynamic import (Vite/Node only)
      const mod = await import(/* @vite-ignore */ resolvedPath);
      // Try default export, content property, or the whole module as string
      let content = '';
      if (typeof mod.default === 'string') {
        content = mod.default;
      } else if (typeof mod.content === 'string') {
        content = mod.content;
      } else if (typeof mod === 'string') {
        content = mod;
      } else {
        throw new Error(
          `Could not extract MDX/MD content from module: ${resolvedPath}`
        );
      }
      await this._parseAndStoreDoc(content, filePath);
    }
  }

  /**
   * Parse and store a doc in the collection.
   */
  private async _parseAndStoreDoc(content: string, filePath: string) {
    const { frontmatter, body } = parseFrontmatter(content);
    const compiled = await compileMdx(body, this.opts?.mdx);
    const slug = filePath
      .replace(/\\/g, '/')
      .replace(/\.(md|mdx)$/, '')
      .replace(/\/index$/, '')
      .toLowerCase();
    this.collection.insert({
      slug,
      filePath,
      frontmatter,
      content: body,
      compiledContent: String(compiled),
      metadata: {
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        publishedAt: frontmatter.publishedAt
          ? new Date(frontmatter.publishedAt)
          : new Date(),
        updatedAt: frontmatter.updatedAt
          ? new Date(frontmatter.updatedAt)
          : undefined,
        tags: frontmatter.tags || [],
        author: frontmatter.author,
        draft: frontmatter.draft || false,
        featured: frontmatter.featured || false,
        ...frontmatter,
      },
    });
  }

  /**
   * Get all parsed docs.
   */
  getAllDocs() {
    return Array.from(this.collection.values());
  }

  /**
   * Get a doc by slug.
   */
  getDoc(slug: string) {
    return this.collection.get(slug);
  }

  /**
   * Render a doc to HTML (returns a simple HTML page).
   */
  renderDocToHtml(loadedDoc?:ParsedDoc, slug?: string, ): string {
    const doc = loadedDoc || this.collection.get(slug || '');
    // if (!doc) throw new Error('Doc not found: ' + slug);
    if (!doc) return;
    const meta = doc.metadata;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <div class="max-w-4xl mx-auto py-6">
    <article class="prose prose-lg">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">${meta.title}</h1>
        ${
          meta.description
            ? `<p class="text-xl text-gray-600 mb-4">${meta.description}</p>`
            : ''
        }
        <div class="flex items-center gap-4 text-sm text-gray-500">
          ${meta.author ? `<span>By ${meta.author}</span>` : ''}
          <time dateTime="${meta.publishedAt}">${new Date(
      meta.publishedAt
    ).toLocaleDateString()}</time>
          ${
            meta.tags && meta.tags.length > 0
              ? `<div class="flex gap-2">${meta.tags
                  .map(
                    (tag: string) =>
                      `<span class="bg-gray-100 px-2 py-1 rounded">${tag}</span>`
                  )
                  .join('')}</div>`
              : ''
          }
        </div>
      </header>
      <div id="mdx-content">${doc.compiledContent}</div>
    </article>
  </div>
</body>
</html>`;
  }
}

/**
 * Factory function for the generator.
 * Usage: const generator = createGenerator(config, getMDXCollection())
 */
export const createGenerator = (
  { remote, buildOptions, file }: GeneratorConfig,
  CollectionConfig: Partial<Pick<CollectionConfig<ParsedDoc, string>, 'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'>>= {}
) => {
  const collection = getMDXCollection(CollectionConfig)
  const gen = new MdxBlogGen(buildOptions, collection);

  const load = async () => {
    if (remote) {
      await gen.loadFromGithub(remote);
    } else {
      await gen.loadFromFiles(file);
    }
  };
  
  return {
    load,
    collection,
    getAllDocs: gen.getAllDocs,
    getDoc: gen.getDoc,
    renderDocToHtml: gen.renderDocToHtml,
  };
};

/**
 * Example usage:
 *
 * import { createGenerator, getMDXCollection } from './mdx-blog-gen'
 * import type { GeneratorConfig } from './define-config'
 *
 * const config: GeneratorConfig = { ... }
 * const generator = createGenerator(config, getMDXCollection())
 * // For user file uploads:
 * await generator.loadFromFiles(Array.from(input.files))
 * // For remote (GitHub):
 * await generator.loadFromGithub({ ... })
 * const html = generator.renderDocToHtml('my-slug')
 */
