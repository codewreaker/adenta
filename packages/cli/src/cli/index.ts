#!/usr/bin/env node

import {
  intro,
  outro,
  spinner,
  select,
  text,
  isCancel,
  note,
} from '@clack/prompts';


import chalk from 'picocolors'
import { promises as fs } from 'node:fs';
import path from 'node:path';

const sourceDir = '.adenta/mdx-bundler/';
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'build':
      await handleBuild();
      break;
    case 'init':
      await handleInit();
      break;
    case 'dev':
      handleDev();
      break;
    default:
      await showMenu();
      break;
  }
}

async function showMenu() {
  intro(chalk.cyan('static-blog-gen CLI'));
  const cmd = await select({
    message: 'What do you want to do?',
    options: [
      { value: 'build', label: 'Build static site' },
      { value: 'init', label: 'Initialize blog config' },
      { value: 'dev', label: 'Start dev server' },
      { value: 'exit', label: 'Exit' },
    ],
  });
  if (isCancel(cmd) || cmd === 'exit') {
    outro('Goodbye!');
    process.exit(0);
  }
  if (cmd === 'build') await handleBuild();
  if (cmd === 'init') await handleInit();
  if (cmd === 'dev') handleDev();
}

async function handleBuild() {
  intro(chalk.cyan('Build static site from remote GitHub repository'));
  const configPath = await text({
    message: 'Path to config file:',
    initialValue: 'blog-gen.config.js',
  });
  if (isCancel(configPath)) return outro('Cancelled');
  const outputDir = await text({
    message: 'Output directory:',
    initialValue: 'dist',
  });
  if (isCancel(outputDir)) return outro('Cancelled');

  const s = spinner();
  s.start('Loading configuration...');
  try {
    const config = await loadConfig(path.resolve(configPath as string));
    config.outputDir = outputDir as string;
    s.stop('Configuration loaded');

    s.start('Initializing Drizzle...');
    const dbInstance = await createDBInstance();
    s.stop('DB initialized');

    s.start('Building static site...');
    const generator = createGenerator(config, dbInstance);
    await generator.build();
    s.stop('Static site built successfully!');

    outro(chalk.green(`\n✅ Your blog is ready at: ${config.outputDir}`));
    console.log(chalk.blue(`📁 Generated ${config.outputDir}`));
  } catch (error: any) {
    s.stop('Build failed');
    outro(chalk.red('Error:') + ' ' + error.message);
    process.exit(1);
  }
}

async function handleInit() {
  intro(chalk.cyan('Initialize a new blog configuration'));
  const template = await select({
    message: 'Choose a configuration template:',
    options: [
      { value: 'basic', label: 'Basic' },
      // Add more templates if needed
    ],
    initialValue: 'basic',
  });

  if (isCancel(template)) return outro('Cancelled');

  const s = spinner();
  s.start('Creating configuration...');
  try {
    await fs.mkdir(sourceDir, { recursive: true });
    const configContent = generateConfigTemplate(template as string);
    await fs.writeFile(`${sourceDir}/config.ts`, configContent, 'utf-8');

    const schemaContent = generateSchemaExample();
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.writeFile(`${sourceDir}/schema.ts`, schemaContent, 'utf-8');

    s.stop('Configuration created');
    outro(chalk.green('\n✅ Blog configuration initialized!'));
    const steps = [
      `1. Update ${sourceDir}/config.js with your GitHub repository details`,
      '2. Update src/db/schema.ts with your database schema',
      '3. Set up your database connection in drizzle.config.ts',
      '4. Run: npm run build',
    ];
    note(steps.join('\n'), chalk.blue('\n📝 Next steps:'));
  } catch (error: any) {
    s.stop('Initialization failed');
    outro(chalk.red('Error:') + ' ' + error.message);
    process.exit(1);
  }
}

function handleDev() {
  intro(chalk.cyan('Development server'));
  outro(chalk.blue('🚧 Development server feature coming soon!'));
  console.log('For now, use the build command and serve the output directory.');
}

function generateConfigTemplate(template: string): string {
  return `import { defineConfig } from '@adenta/core/mdx-bundler'

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
`;
}

function generateSchemaExample(): string {
  return `// ${sourceDir}db/schema.ts\n// Example schema\nexport const posts = []\n`;
}

/**
 * @todo
 * @returns 
 */
async function createDBInstance() {
  try {
    const connectionString = process.env['DATABASE_URL'] || 'postgresql://localhost:5432/blog';
    const client = { connectionString };
    return client
  } catch (error) {
    throw new Error(`Failed to initialize database: ${(error as Error)?.message}`);
  }
}

/**
 * 
 * @param arg0 
 * @returns
 */
const loadConfig = (arg0: string) => {
  return { outputDir: 'somestring' }
}

function createGenerator(config: { outputDir: string }, dbInstance?: { connectionString: string; }) {
  return { build: console.log }
}

