#!/usr/bin/env node

import { intro, outro, spinner, select, text, isCancel } from '@clack/prompts'
import chalk from 'chalk'
import { createGenerator, GeneratorConfig } from '../src/index.js'
import { promises as fs } from 'fs'
import path from 'path'
import { createCollection } from '@tanstack/db'

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'build':
      await handleBuild()
      break
    case 'init':
      await handleInit()
      break
    case 'dev':
      handleDev()
      break
    default:
      await showMenu()
      break
  }
}

async function showMenu() {
  intro(chalk.cyan('static-blog-gen CLI'))
  const cmd = await select({
    message: 'What do you want to do?',
    options: [
      { value: 'build', label: 'Build static site' },
      { value: 'init', label: 'Initialize blog config' },
      { value: 'dev', label: 'Start dev server' },
      { value: 'exit', label: 'Exit' },
    ],
  })
  if (isCancel(cmd) || cmd === 'exit') {
    outro('Goodbye!')
    process.exit(0)
  }
  if (cmd === 'build') await handleBuild()
  if (cmd === 'init') await handleInit()
  if (cmd === 'dev') handleDev()
}

async function handleBuild() {
  intro(chalk.cyan('Build static site from remote GitHub repository'))
  const configPath = await text({
    message: 'Path to config file:',
    initialValue: 'blog-gen.config.js',
  })
  if (isCancel(configPath)) return outro('Cancelled')
  const outputDir = await text({
    message: 'Output directory:',
    initialValue: 'dist',
  })
  if (isCancel(outputDir)) return outro('Cancelled')

  const s = spinner()
  s.start('Loading configuration...')
  try {
    const config = await loadConfig(path.resolve(configPath as string))
    config.outputDir = outputDir as string
    s.stop('Configuration loaded')

    s.start('Initializing Drizzle...')
    const drizzleInstance = await loadDBInstance(config)
    s.stop('Drizzle initialized')

    s.start('Building static site...')
    const generator = createGenerator(config, drizzleInstance)
    await generator.build()
    s.stop('Static site built successfully!')

    outro(chalk.green(`\n✅ Your blog is ready at: ${config.outputDir}`))
    console.log(chalk.blue(`📁 Generated ${config.outputDir}`))
  } catch (error: any) {
    s.stop('Build failed')
    outro(chalk.red('Error:') + ' ' + error.message)
    process.exit(1)
  }
}

async function handleInit() {
  intro(chalk.cyan('Initialize a new blog configuration'))
  const template = await select({
    message: 'Choose a configuration template:',
    options: [
      { value: 'basic', label: 'Basic' },
      // Add more templates if needed
    ],
    initialValue: 'basic',
  })
  if (isCancel(template)) return outro('Cancelled')

  const s = spinner()
  s.start('Creating configuration...')
  try {
    const configContent = generateConfigTemplate(template as string)
    await fs.writeFile('blog-gen.config.js', configContent, 'utf-8')

    // These functions should be implemented or replaced with static examples
    const drizzleContent = generateDrizzleExample()
    await fs.writeFile('drizzle.config.ts', drizzleContent, 'utf-8')

    const schemaContent = generateSchemaExample()
    await fs.mkdir('src/db', { recursive: true })
    await fs.writeFile('src/db/schema.ts', schemaContent, 'utf-8')

    s.stop('Configuration created')
    outro(chalk.green('\n✅ Blog configuration initialized!'))
    console.log(chalk.blue('\n📝 Next steps:'))
    console.log('1. Update blog-gen.config.js with your GitHub repository details')
    console.log('2. Update src/db/schema.ts with your database schema')
    console.log('3. Set up your database connection in drizzle.config.ts')
    console.log('4. Run: npm run build')
  } catch (error: any) {
    s.stop('Initialization failed')
    outro(chalk.red('Error:') + ' ' + error.message)
    process.exit(1)
  }
}

function handleDev() {
  intro(chalk.cyan('Development server'))
  outro(chalk.blue('🚧 Development server feature coming soon!'))
  console.log('For now, use the build command and serve the output directory.')
}

async function loadConfig(configPath: string): Promise<GeneratorConfig> {
  try {
    const module = await import(configPath)
    return module.default || module
  } catch (error: any) {
    throw new Error(`Failed to load config from ${configPath}: ${error.message}`)
  }
}

async function loadDBInstance(config: GeneratorConfig) {
  // Define a collection for posts with localStorage sync
  const posts = createCollection({
    id: 'posts',
    getKey: (item) => item?.slug as string,
    sync: {
      sync: ({ collection }) => {
        const key = 'posts';
        // Load from localStorage on startup
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        if (saved) {
          try {
            const arr = JSON.parse(saved);
            arr.forEach((item) => collection.insert(item));
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
        // Save to localStorage on every change
        collection.subscribeChanges(() => {
          const all = Array.from(collection.values());
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(all));
          }
        });
      }
    }
  });

  // Return an adapter matching the expected Database interface
  return {
    insert: (table: string) => ({
      values: async (data: any) => {
        if (table === 'posts') {
          posts.insert(data);
        }
      },
      onConflictDoUpdate: async (options: { target: string; set: any }) => {
        if (table === 'posts') {
          if (posts.has(options.target)) {
            posts.update(options.target, () => options.set);
          } else {
            posts.insert(options.set);
          }
        }
      },
    }),
  }
}

function generateConfigTemplate(template: string): string {
  return `import { defineConfig } from '@yourorg/static-blog-generator'

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
`
}

// TODO: Implement or import these example generators
function generateDrizzleExample(): string {
  return `// drizzle.config.ts\nexport default {\n  // Add your Drizzle ORM config here\n}\n`
}

function generateSchemaExample(): string {
  return `// src/db/schema.ts\n// Example schema\nexport const posts = []\n`
}

main();

