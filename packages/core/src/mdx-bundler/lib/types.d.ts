interface BlogMetadata {
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
interface ParsedDoc {
    slug: string
    filePath: string
    frontmatter: any
    content: string
    metadata: BlogMetadata
  }



type ParsedDocCollection = ReturnType<typeof import('@tanstack/db').createCollection<ParsedDoc>>
type CollectionConfigCallbacks = Partial<Pick<import('@tanstack/db').CollectionConfig<ParsedDoc, string>, 'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'>>

type AdentaBundleMDxOptions<T> = Omit<import('mdx-bundler/dist/types.d.ts').BundleMDX<T>, 'file' |'files' | 'source'>

// --- Types ---
interface GithubMeta {
  owner: string;
  repo: string;
  path: string; // path within repo
  branch?: string;
}

type MdxSourceInput =
  | { type: 'github'; meta: GithubMeta }
  | { type: 'local'; files: string[] } // absolute or relative paths
  | { type: 'raw'; files: { filename: string; content: string }[] };

interface BundledMdxResult {
  filename: string;
  code: string;
  frontmatter: any;
  metadata?: any;
}
