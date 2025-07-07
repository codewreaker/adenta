import type { bundleMDX } from 'mdx-bundler';

export type BundleMDXOptions = Parameters<typeof bundleMDX>[0];

export type AdentaBundleMDxOptions = Omit<
  BundleMDXOptions,
  'file' | 'source' | 'mdxOptions'
>;

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

// Define the type for a parsed doc
export interface ParsedDoc {
  slug: string;
  filePath: string;
  frontmatter: any;
  content: string;
  metadata: BlogMetadata;
}

export type ParsedDocCollection = ReturnType<
  typeof import('@tanstack/db').createCollection<ParsedDoc>
>;
export type CollectionConfigCallbacks = Partial<
  Pick<
    import('@tanstack/db').CollectionConfig<ParsedDoc, string>,
    'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'
  >
>;

// --- Types ---

type SourceInputType = 'local' | 'github' | 'raw';

export interface StandardSourceOutput {
  filepath: string | 'raw.mdx';
  content: string;
  type: SourceInputType;
}

interface SourceInput {
  type: SourceInputType;
  meta: {[key:string], any}
  //paths?: StandardSourceOutput[];
}
export interface GithubMDXSource extends SourceInput {
  type: 'github';
  meta: {
    owner: string;
    repo: string;
    branch?: string;
    path: string;
    slugs?: string[];
  }
}

export interface LocalMDXSource extends SourceInput {
  type: 'local';
  meta: {
    filepaths: string[]
  }
} //{ type: 'local'; files: string[] } // absolute or relative paths

export interface RawMDXSource extends SourceInput {
  type: 'raw';
  meta: {
    mdx: string[];
  }
} // { type: 'raw'; files: { filename: string; content: string }[] };

export type MdxSourceInput = GithubMDXSource | LocalMDXSource | RawMDXSource;

// ... existing code ...

// GitHub API response types
export interface GitHubFileInfo {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

// ... rest of your existing code ...

export type BundledMdxResult = {
  filename: string;
  metadata?: any;
} & ReturnType<typeof bundleMDX>;
