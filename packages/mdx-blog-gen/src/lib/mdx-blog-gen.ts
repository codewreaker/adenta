// packages/core/src/index.ts
import { compile } from '@mdx-js/mdx';
import type { GeneratorConfig } from './define-config.js';

export interface BlogMetadata {
  slug: string;
  title: string;
  description?: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags?: string[];
  author?: string;
  draft?: boolean;
  featured?: boolean;
  [key: string]: any;
}

interface Database {
  insert: (table: string) => {
    values: (data: any) => Promise<void>;
    onConflictDoUpdate: (options: {
      target: string;
      set: any;
    }) => Promise<void>;
  };
}

// FileSystem abstraction for Node and browser
interface FileSystem {
  mkdir(path: string, opts?: { recursive?: boolean }): Promise<void>;
  writeFile(path: string, content: string, encoding?: string): Promise<void>;
  readFile(path: string, encoding?: string): Promise<string>;
  readdir(path: string, opts?: { withFileTypes?: boolean }): Promise<any[]>;
  join(...parts: string[]): string;
  relative(from: string, to: string): string;
  basename(p: string, ext?: string): string;
  extname(p: string): string;
  exists(path: string): Promise<boolean>;
}

// Node implementation
let nodeFs: any, nodePath: any;
const isNode =
  typeof process !== 'undefined' && process.versions && process.versions.node;

class NodeFileSystem implements FileSystem {
  constructor() {
    if (!nodeFs) nodeFs = require('fs').promises;
    if (!nodePath) nodePath = require('path');
  }
  mkdir(path: string, opts?: { recursive?: boolean }) {
    return nodeFs.mkdir(path, opts);
  }
  writeFile(path: string, content: string, encoding = 'utf-8') {
    return nodeFs.writeFile(path, content, encoding);
  }
  readFile(path: string, encoding = 'utf-8') {
    return nodeFs.readFile(path, encoding);
  }
  readdir(path: string, opts?: { withFileTypes?: boolean }) {
    return nodeFs.readdir(path, opts);
  }
  join(...parts: string[]) {
    return nodePath.join(...parts);
  }
  relative(from: string, to: string) {
    return nodePath.relative(from, to);
  }
  basename(p: string, ext?: string) {
    return nodePath.basename(p, ext);
  }
  extname(p: string) {
    return nodePath.extname(p);
  }
  async exists(path: string) {
    try {
      await nodeFs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}

// Browser implementation (in-memory, metadata via @tanstack/db)
import { getMDXCollection } from './api.js';

const fsCollection = getMDXCollection({
  getKey: (item) => item['path'] as string,
});

class BrowserFileSystem implements FileSystem {
  async mkdir(path: string, opts?: { recursive?: boolean }) {
    if (!fsCollection.has(path)) {
      fsCollection.insert({ path, type: 'dir' });
    }
    // Optionally handle recursive
  }

  async writeFile(path: string, content: string, _encoding = 'utf-8') {
    if (fsCollection.has(path)) {
      fsCollection.update(path, (draft) => {
        draft.content = content;
        draft.type = 'file';
      });
    } else {
      fsCollection.insert({ path, type: 'file', content });
    }
  }

  async readFile(path: string, _encoding = 'utf-8') {
    const file = fsCollection.get(path);
    if (!file || file.type !== 'file')
      throw new Error('File not found: ' + path);
    return file.content as string;
  }

  async readdir(path: string, opts?: { withFileTypes?: boolean }) {
    const children = Array.from(fsCollection.values()).filter((item) => {
      if (item.path === path) return false;
      //@ts-expect-error: item may not have a path property, but we ensure it does in our usage
      const parent = item.path.substring(0, item.path.lastIndexOf('/'));
      return parent === path;
    });
    return children;
  }

  async exists(path: string) {
    return fsCollection.has(path);
  }

  join(...parts: string[]) {
    return parts.join('/').replace(/\\/g, '/');
  }
  relative(from: string, to: string) {
    if (to.startsWith(from)) return to.slice(from.length).replace(/^\//, '');
    return to;
  }
  basename(p: string, ext?: string) {
    const base = p.split('/').pop() || '';
    if (ext && base.endsWith(ext)) return base.slice(0, -ext.length);
    return base;
  }
  extname(p: string) {
    const base = p.split('/').pop() || '';
    const idx = base.lastIndexOf('.');
    return idx >= 0 ? base.slice(idx) : '';
  }
}

const fs: FileSystem = isNode ? new NodeFileSystem() : new BrowserFileSystem();

export class StaticSiteGenerator {
  private config: GeneratorConfig;
  private db: any;

  constructor(config: GeneratorConfig, dbInstance: Database) {
    this.config = config;
    this.db = dbInstance;
  }

  async build(cb?: (content: string) => void): Promise<void> {
    console.debug('🚀 Starting static site generation...');

    // Step 1: Download remote content
    const contentDir = await this.downloadRemoteContent();

    // Step 2: Process markdown files
    const processedFiles = await this.processMarkdownFiles(contentDir);

    // Step 3: Generate routes
    await this.generateRoutes(processedFiles);

    // Step 4: Build static site
    await this.buildStaticSite(processedFiles, cb);

    console.debug('✅ Static site generation completed!');
  }

  private async downloadRemoteContent(): Promise<string> {
    const { remote } = this.config;
    const tempDir =
      this.config.tempDir ||
      fs.join(
        isNode ? (typeof process !== 'undefined' ? process.cwd() : '') : '',
        '.temp'
      );

    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });

    const contentUrl = `https://api.github.com/repos/${remote.owner}/${
      remote.repo
    }/contents/${remote.docsPath || ''}?ref=${remote.branch || 'main'}`;

    console.log(`📥 Downloading content from: ${remote.owner}/${remote.repo}`);

    try {
      const response = await fetch(contentUrl, {
        headers: remote.token
          ? {
              Authorization: `token ${remote.token}`,
              Accept: 'application/vnd.github.v3+json',
            }
          : {
              Accept: 'application/vnd.github.v3+json',
            },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const files = await response.json();
      await this.downloadFiles(files, tempDir, remote);

      return tempDir;
    } catch (error) {
      console.error('❌ Failed to download remote content:', error);
      throw error;
    }
  }

  private async downloadFiles(
    files: any[],
    baseDir: string,
    remote: any
  ): Promise<void> {
    for (const file of files) {
      if (
        file.type === 'file' &&
        (file.name.endsWith('.md') || file.name.endsWith('.mdx'))
      ) {
        const filePath = fs.join(baseDir, file.name);

        // Download file content
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();

        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`📄 Downloaded: ${file.name}`);
      } else if (file.type === 'dir') {
        // Recursively download directory contents
        const subDir = fs.join(baseDir, file.name);
        await fs.mkdir(subDir, { recursive: true });

        const subContentUrl = `https://api.github.com/repos/${remote.owner}/${
          remote.repo
        }/contents/${file.path}?ref=${remote.branch || 'main'}`;
        const subResponse = await fetch(subContentUrl, {
          headers: remote.token
            ? {
                Authorization: `token ${remote.token}`,
                Accept: 'application/vnd.github.v3+json',
              }
            : {
                Accept: 'application/vnd.github.v3+json',
              },
        });

        const subFiles = await subResponse.json();
        await this.downloadFiles(subFiles, subDir, remote);
      }
    }
  }

  private async processMarkdownFiles(
    contentDir: string
  ): Promise<ProcessedFile[]> {
    console.log('🔄 Processing markdown files...');

    const files = await this.getMarkdownFiles(contentDir);
    const processedFiles: ProcessedFile[] = [];

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const { frontmatter, body } = this.parseFrontmatter(content);

        // Compile MDX using @rspress/mdx-rs
        const compiledContent = await compile(body, {
          rehypePlugins: this.config.mdx?.rehypePlugins,
          remarkPlugins: this.config.mdx?.remarkPlugins,
          development: this.config.mdx?.development || false,
          baseUrl: contentDir,
        });

        const relativePath = fs.relative(contentDir, filePath);
        const slug = this.generateSlug(relativePath);

        const processedFile: ProcessedFile = {
          slug,
          filePath,
          relativePath,
          frontmatter,
          content: body,
          compiledContent: compiledContent.code,
          metadata: {
            slug,
            title:
              frontmatter.title || fs.basename(filePath, fs.extname(filePath)),
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
        };

        processedFiles.push(processedFile);
        console.log(`✅ Processed: ${relativePath}`);
      } catch (error) {
        console.error(`❌ Failed to process ${filePath}:`, error);
      }
    }

    return processedFiles;
  }

  private async getMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = fs.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await this.getMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private parseFrontmatter(content: string): {
    frontmatter: any;
    body: string;
  } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (match) {
      const frontmatterYaml = match[1];
      const body = match[2];

      // Simple YAML parser for frontmatter
      const frontmatter: any = {};
      const lines = frontmatterYaml.split('\n');

      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();

          // Handle arrays
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

  private generateSlug(relativePath: string): string {
    return relativePath
      .replace(/\.(md|mdx)$/, '')
      .replace(/\\/g, '/')
      .replace(/\/index$/, '')
      .toLowerCase();
  }

  private async generateRoutes(processedFiles: ProcessedFile[]): Promise<void> {
    console.log('🛣️  Generating routes...');

    const routesDir = fs.join(this.config.outputDir, 'routes');
    await fs.mkdir(routesDir, { recursive: true });

    // Generate TanStack Router route files
    for (const file of processedFiles) {
      const routePath = fs.join(routesDir, `${file.slug}.tsx`);
      const routeContent = this.generateRouteComponent(file);

      await fs.writeFile(routePath, routeContent, 'utf-8');
    }

    // Generate route tree
    const routeTree = this.generateRouteTree(processedFiles);
    await fs.writeFile(fs.join(routesDir, '__root.tsx'), routeTree, 'utf-8');
  }

  private generateRouteComponent(file: ProcessedFile): string {
    return `import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

// Compiled MDX content
const MDXContent = ${file.compiledContent}

export const Route = createFileRoute('/${file.slug}')({
  component: () => {
    const metadata = useMemo(() => (${JSON.stringify(
      file.metadata,
      null,
      2
    )}), [])
    
    return (
      <article className="prose prose-lg max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
          {metadata.description && (
            <p className="text-xl text-gray-600 mb-4">{metadata.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {metadata.author && <span>By {metadata.author}</span>}
            <time dateTime={metadata.publishedAt}>
              {new Date(metadata.publishedAt).toLocaleDateString()}
            </time>
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex gap-2">
                {metadata.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        <MDXContent />
      </article>
    )
  },
  head: () => ({
    title: metadata.title,
    meta: [
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
    ]
  })
})
`;
  }

  private generateRouteTree(processedFiles: ProcessedFile[]): string {
    const routes = processedFiles.map((file) => `'/${file.slug}'`).join(', ');

    return `import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Blog</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
`;
  }

  private async buildStaticSite(
    processedFiles: ProcessedFile[],
    cb?: (content: string) => void
  ): Promise<void> {
    console.log('🏗️  Building static site...');

    // Save metadata to database
    await this.saveMetadataToDatabase(processedFiles);

    // Generate static HTML files
    await this.generateStaticHTML(processedFiles, cb);

    // Copy assets if needed
    await this.copyAssets();
  }

  private async saveMetadataToDatabase(
    processedFiles: ProcessedFile[]
  ): Promise<void> {
    console.log('💾 Saving metadata to database...');

    // This assumes you have a `posts` table with appropriate schema
    // You would replace this with your actual Drizzle schema
    try {
      for (const file of processedFiles) {
        await this.db
          .insert(/* your posts table */)
          .values(file.metadata)
          .onConflictDoUpdate({
            target: file.slug,
            set: file.metadata,
          });
      }
      console.log(`✅ Saved ${processedFiles.length} posts to database`);
    } catch (error) {
      console.error('❌ Failed to save to database:', error);
    }
  }

  private async generateStaticHTML(
    processedFiles: ProcessedFile[],
    cb?: (content: string) => void
  ): Promise<void> {
    // This would integrate with your build system to generate static HTML
    // For now, we'll create a simple index
    const indexPath = fs.join(this.config.outputDir, 'index.html');
    const indexContent = this.generateIndexHTML(processedFiles);

    if (cb) {
      cb(indexContent);
    } else {
      await fs.writeFile(indexPath, indexContent, 'utf-8');
    }
  }

  private generateIndexHTML(processedFiles: ProcessedFile[]): string {
    const posts = processedFiles
      .filter((file) => !file.metadata.draft)
      .sort(
        (a, b) =>
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime()
      );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h1>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${posts
          .map(
            (file) => `
          <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-2">
                <a href="/${file.slug}" class="hover:text-blue-600">
                  ${file.metadata.title}
                </a>
              </h2>
              ${
                file.metadata.description
                  ? `
                <p class="text-gray-600 mb-4">${file.metadata.description}</p>
              `
                  : ''
              }
              <div class="flex items-center justify-between text-sm text-gray-500">
                <time dateTime="${file.metadata.publishedAt}">
                  ${new Date(file.metadata.publishedAt).toLocaleDateString()}
                </time>
                ${
                  file.metadata.tags && file.metadata.tags.length > 0
                    ? `
                  <div class="flex gap-1">
                    ${file.metadata.tags
                      .slice(0, 2)
                      .map(
                        (tag: string) => `
                      <span class="bg-gray-100 px-2 py-1 rounded text-xs">${tag}</span>
                    `
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          </article>
        `
          )
          .join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  private async copyAssets(): Promise<void> {
    // Copy any static assets (images, etc.) from the source
    // This would be implemented based on your specific needs
  }
}

interface ProcessedFile {
  slug: string;
  filePath: string;
  relativePath: string;
  frontmatter: any;
  content: string;
  compiledContent: string;
  metadata: BlogMetadata;
}


// Utility functions
export const createGenerator = (
  config: GeneratorConfig,
  dbInstance: Database
) => {
  return new StaticSiteGenerator(config, dbInstance);
};
