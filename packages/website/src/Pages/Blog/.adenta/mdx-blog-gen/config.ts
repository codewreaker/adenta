import { defineConfig } from '@adenta/mdx-blog-gen'

export default defineConfig({
  // GitHub repository configuration
  remote: {
    owner: 'your-username',           // GitHub username or organization
    repo: 'your-blog-content',        // Repository name containing your .md/.mdx files
    branch: 'main',                   // Branch to pull from (optional, defaults to 'main')
    docsPath: 'posts',                // Path to your markdown files in the repo (optional)
    token: process.env.GITHUB_TOKEN   // GitHub token for private repos (optional)
  },
  
  // Output configuration
  outputDir: 'dist',                  // Where to build the static site
  tempDir: '.temp',                   // Temporary directory for downloaded content
  
  // Database configuration (for metadata storage)
  database: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/blog'
  },
  
  // Build options
  buildOptions: {
    minify: true,
    sourceMaps: false,
    publicPath: '/'
  },
  
  // MDX compilation options
  mdx: {
    development: false,
    remarkPlugins: [],
    rehypePlugins: []
  }
})
