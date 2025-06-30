// Type definition for the config
export interface GeneratorConfig {
  remote: {
    owner: string
    repo: string
    branch?: string
    docsPath?: string
    token?: string
  }
  outputDir: string
  tempDir?: string
  database: {
    connectionString: string
  }
  buildOptions?: {
    minify?: boolean
    sourceMaps?: boolean
    publicPath?: string
  }
  mdx?: {
    remarkPlugins?: any[]
    rehypePlugins?: any[]
    development?: boolean
  }
}

// Helper for type-safe config
export function defineConfig(config: GeneratorConfig): GeneratorConfig {
  return config
}
