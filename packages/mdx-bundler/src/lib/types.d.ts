
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

// Type definition for the config
interface GeneratorConfig {
  loadOptions: LoadOptions;
  buildOptions?: {
    minify?: boolean;
    sourceMaps?: boolean;
    publicPath?: string;
    mdx?: {
      remarkPlugins?: any[];
      rehypePlugins?: any[];
      development?: boolean;
      format?: 'detect' | 'md' | 'mdx';
      jsx?: boolean;
      jsxImportSource?: string;
      jsxRuntime?: 'automatic' | 'classic';
      outputFormat?: 'function-body' | 'program';
      elementAttributeNameCase?: 'react' | 'html';
      baseUrl?: URL | string | null;
      mdExtensions?: readonly string[];
      mdxExtensions?: readonly string[];
    };
  };
}

type ParsedDocCollection = ReturnType<typeof import('@tanstack/db').createCollection<ParsedDoc>>
type CollectionConfigCallbacks = Partial<Pick<CollectionConfig<ParsedDoc, string>, 'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'>>


interface GithubLoadeOptions {
  branch?: string;
  docsPath?: string;
  owner?: string;
  repo?: string;
  token?: string;
}

interface LoadOptions extends GithubLoadeOptions{
  filePaths: File[];
}

type LoadFromRemote = (
  options:LoadOptions, 
callback: (
  content: string,
  filePath: string
) => Promise<void>
)=>Promise<void>

type Frontmatter = Record<string, any>