// Type definition for the config
export interface GeneratorConfig {
  file?: {
    filePaths: string[];
  };
  remote?: {
    owner: string;
    repo: string;
    branch?: string;
    docsPath?: string;
    token?: string;
  };
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

// Helper for type-safe config
export function defineConfig(config: GeneratorConfig): GeneratorConfig {
  return config;
}
