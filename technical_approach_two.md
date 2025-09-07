
## CMS Architecture
- Payload CMS as the admin interface
- Dynamic collections based on `adenta.config.js`
- Supabase as the database backend
- Auto-generated API routes

## Plugin System (Future)
```typescript
// Plugin architecture for extensibility
interface AdentaPlugin {
  name: string;
  setup(framework: AdentaFramework): void;
  build?(config: AdentaConfig): void;
  dev?(config: AdentaConfig): void;
}

// Example plugin usage in config
export default {
  plugins: [
    '@adenta/plugin-auth',
    '@adenta/plugin-payments',
    ['@adenta/plugin-analytics', { provider: 'vercel' }]
  ]
};
```

## File Structure for Generated Projects
```
my-adenta-app/
├── adenta.config.js          # Main configuration
├── package.json              # Dependencies
├── .env.example              # Environment template
├── src/                      # Application source
│   ├── app/                 # UI application
│   ├── cms/                 # CMS configuration
│   └── types/               # Generated types
├── supabase/                # Supabase configuration
│   ├── config.toml
│   ├── migrations/
│   └── seed.sql
└── public/                  # Static assets
```

## Development Workflow
1. `npx adenta --new` → Interactive project creation
2. `cd project && npm install` → Install dependencies
3. `npm run dev` → Start development servers
4. `npm run build` → Production build
5. `npm run deploy` → Deploy to Vercel/Netlify

## Key Benefits of This Approach
1. **Zero Configuration**: Works out of the box with sensible defaults
2. **Full Stack**: Database, API, CMS, and UI in one command
3. **Type Safe**: TypeScript throughout with generated types
4. **Modern Stack**: Latest React, RSPack, Supabase, Payload CMS
5. **Extensible**: Plugin system for additional functionality
6. **Developer Experience**: Hot reload, error boundaries, dev tools


# CLI Structure
```ts
// packages/cli/src/commands/new.ts
import { intro, outro, text, select, confirm, spinner } from '@clack/prompts';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'pathe';
import { execSync } from 'child_process';
import pc from 'picocolors';

export interface ProjectOptions {
  name: string;
  template: 'basic' | 'cms' | 'api-only' | 'fullstack';
  ui: 'react' | 'vue' | 'svelte';
  styling: 'tailwind' | 'styled-components' | 'css-modules';
  database: boolean;
  cms: boolean;
  typescript: boolean;
}

export async function createNewProject() {
  intro(pc.bgCyan(' Adenta Framework '));
  
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-adenta-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        return 'Project name can only contain letters, numbers, hyphens, and underscores';
      }
    }
  });
  
  const template = await select({
    message: 'Which template would you like to use?',
    options: [
      { value: 'fullstack', label: 'Fullstack (UI + CMS + API)', hint: 'Complete setup with everything' },
      { value: 'cms', label: 'CMS + API', hint: 'Backend with content management' },
      { value: 'basic', label: 'Basic UI', hint: 'Frontend only application' },
      { value: 'api-only', label: 'API Only', hint: 'Backend API only' }
    ]
  });
  
  const ui = await select({
    message: 'Which UI framework?',
    options: [
      { value: 'react', label: 'React', hint: 'Most popular' },
      { value: 'vue', label: 'Vue.js', hint: 'Progressive framework' },
      { value: 'svelte', label: 'Svelte', hint: 'Compile-time optimized' }
    ]
  });
  
  const styling = await select({
    message: 'Which styling solution?',
    options: [
      { value: 'tailwind', label: 'Tailwind CSS', hint: 'Utility-first CSS' },
      { value: 'styled-components', label: 'Styled Components', hint: 'CSS-in-JS' },
      { value: 'css-modules', label: 'CSS Modules', hint: 'Scoped CSS' }
    ]
  });
  
  const useDatabase = template !== 'basic' || await confirm({
    message: 'Do you want to set up Supabase?',
    initialValue: true
  });
  
  const useCMS = ['fullstack', 'cms'].includes(template as string) || await confirm({
    message: 'Do you want to include the CMS?',
    initialValue: false
  });
  
  const useTypeScript = await confirm({
    message: 'Do you want to use TypeScript?',
    initialValue: true
  });
  
  const options: ProjectOptions = {
    name: projectName as string,
    template: template as ProjectOptions['template'],
    ui: ui as ProjectOptions['ui'],
    styling: styling as ProjectOptions['styling'],
    database: useDatabase as boolean,
    cms: useCMS as boolean,
    typescript: useTypeScript as boolean
  };
  
  await scaffoldProject(options);
  
  outro(pc.green(`✅ Project ${options.name} created successfully!`));
  console.log('\nNext steps:');
  console.log(pc.cyan(`  cd ${options.name}`));
  console.log(pc.cyan('  npm install'));
  console.log(pc.cyan('  npm run dev'));
}

async function scaffoldProject(options: ProjectOptions) {
  const s = spinner();
  
  try {
    s.start('Creating project structure...');
    
    const projectDir = resolve(options.name);
    
    if (existsSync(projectDir)) {
      throw new Error(`Directory ${options.name} already exists`);
    }
    
    mkdirSync(projectDir, { recursive: true });
    
    // Generate adenta.config.js
    const config = generateConfig(options);
    writeFileSync(
      join(projectDir, 'adenta.config.js'),
      config
    );
    
    
    // Create basic structure
    mkdirSync(join(projectDir, 'src'), { recursive: true });
    mkdirSync(join(projectDir, 'public'), { recursive: true });
    
    if (options.database) {
      s.message('Setting up Supabase...');
      await setupSupabase(projectDir);
    }
    
    if (options.cms) {
      s.message('Setting up CMS...');
      await setupCMS(projectDir, options);
    }
    
    s.message('Generating template files...');
    await generateTemplateFiles(projectDir, options);
    
    s.stop('Project created successfully!');
    
  } catch (error) {
    s.stop('Failed to create project');
    throw error;
  }
}

function generateConfig(options: ProjectOptions): string {
  return `export default {
  database: {
    provider: 'supabase',
    ${options.database ? '// URL and keys will be loaded from .env' : '// Database disabled'}
  },
  
  cms: {
    enabled: ${options.cms},
    ${options.cms ? 'adminPath: "/admin",' : ''}
  },
  
  ui: {
    framework: '${options.ui}',
    styling: '${options.styling}',
  },
  
  build: {
    target: 'universal',
    bundler: 'rspack',
  },
  
  dev: {
    port: 3000,
    host: 'localhost',
  },
};`;
}

async function setupSupabase(projectDir: string) {
  // Initialize Supabase project
  try {
    execSync('supabase init', { cwd: projectDir });
    
    // Create .env.example
    const envExample = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
`;
    
    writeFileSync(join(projectDir, '.env.example'), envExample);
  } catch (error) {
    console.warn('Supabase CLI not found. Please install it manually.');
  }
}

async function setupCMS(projectDir: string, options: ProjectOptions) {
  // Create CMS configuration
  const cmsConfig = `import { buildConfig } from 'payload/config';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { postgresAdapter } from '@payloadcms/db-postgres';

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
});`;
  
  mkdirSync(join(projectDir, 'cms'), { recursive: true });
  writeFileSync(join(projectDir, 'cms', 'payload.config.ts'), cmsConfig);
}

async function generateTemplateFiles(projectDir: string, options: ProjectOptions) {
  // Generate basic app structure based on options
  const appContent = options.ui === 'react' ? generateReactApp(options) : 
                    options.ui === 'vue' ? generateVueApp(options) : 
                    generateSvelteApp(options);
  
  const ext = options.typescript ? 'tsx' : 'jsx';
  writeFileSync(join(projectDir, 'src', `App.${ext}`), appContent);
}

function generateReactApp(options: ProjectOptions): string {
  return `import React from 'react';
${options.styling === 'tailwind' ? "import './index.css';" : ''}

function App() {
  return (
    <div className="${options.styling === 'tailwind' ? 'min-h-screen bg-gray-100 flex items-center justify-center' : 'app'}">
      <div className="${options.styling === 'tailwind' ? 'text-center' : 'content'}">
        <h1 className="${options.styling === 'tailwind' ? 'text-4xl font-bold text-gray-900 mb-4' : 'title'}">
          Welcome to ${options.name}
        </h1>
        <p className="${options.styling === 'tailwind' ? 'text-lg text-gray-600' : 'description'}">
          Built with Adenta Framework
        </p>
        ${options.database ? `
        <div className="${options.styling === 'tailwind' ? 'mt-8' : 'database-status'}">
          <p>🚀 Supabase is configured and ready to use!</p>
        </div>` : ''}
        ${options.cms ? `
        <div className="${options.styling === 'tailwind' ? 'mt-4' : 'cms-status'}">
          <a 
            href="/admin" 
            className="${options.styling === 'tailwind' ? 'text-blue-500 hover:text-blue-700 underline' : 'cms-link'}"
          >
            Access CMS Admin
          </a>
        </div>` : ''}
      </div>
    </div>
  );
}

export default App;`;
}

function generateVueApp(options: ProjectOptions): string {
  return `<template>
  <div class="${options.styling === 'tailwind' ? 'min-h-screen bg-gray-100 flex items-center justify-center' : 'app'}">
    <div class="${options.styling === 'tailwind' ? 'text-center' : 'content'}">
      <h1 class="${options.styling === 'tailwind' ? 'text-4xl font-bold text-gray-900 mb-4' : 'title'}">
        Welcome to ${options.name}
      </h1>
      <p class="${options.styling === 'tailwind' ? 'text-lg text-gray-600' : 'description'}">
        Built with Adenta Framework
      </p>
      ${options.database ? `
      <div class="${options.styling === 'tailwind' ? 'mt-8' : 'database-status'}">
        <p>🚀 Supabase is configured and ready to use!</p>
      </div>` : ''}
      ${options.cms ? `
      <div class="${options.styling === 'tailwind' ? 'mt-4' : 'cms-status'}">
        <a 
          href="/admin" 
          class="${options.styling === 'tailwind' ? 'text-blue-500 hover:text-blue-700 underline' : 'cms-link'}"
        >
          Access CMS Admin
        </a>
      </div>` : ''}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>`;
}

function generateSvelteApp(options: ProjectOptions): string {
  return `<script>
  // Your Svelte app logic here
</script>

<div class="${options.styling === 'tailwind' ? 'min-h-screen bg-gray-100 flex items-center justify-center' : 'app'}">
  <div class="${options.styling === 'tailwind' ? 'text-center' : 'content'}">
    <h1 class="${options.styling === 'tailwind' ? 'text-4xl font-bold text-gray-900 mb-4' : 'title'}">
      Welcome to ${options.name}
    </h1>
    <p class="${options.styling === 'tailwind' ? 'text-lg text-gray-600' : 'description'}">
      Built with Adenta Framework
    </p>
    ${options.database ? `
    <div class="${options.styling === 'tailwind' ? 'mt-8' : 'database-status'}">
      <p>🚀 Supabase is configured and ready to use!</p>
    </div>` : ''}
    ${options.cms ? `
    <div class="${options.styling === 'tailwind' ? 'mt-4' : 'cms-status'}">
      <a 
        href="/admin" 
        class="${options.styling === 'tailwind' ? 'text-blue-500 hover:text-blue-700 underline' : 'cms-link'}"
      >
        Access CMS Admin
      </a>
    </div>` : ''}
  </div>
</div>`;
}

// packages/cli/src/commands/dev.ts
export async function devCommand() {
  const { loadAdentaConfig, AdentaFramework } = await import('@adenta/core');
  
  const config = await loadAdentaConfig();
  const framework = new AdentaFramework(config);
  
  await framework.dev();
}

// packages/cli/src/commands/build.ts
export async function buildCommand() {
  const { loadAdentaConfig, AdentaFramework } = await import('@adenta/core');
  
  const config = await loadAdentaConfig();
  const framework = new AdentaFramework(config);
  
  await framework.build();
}
```


# Core Config
```ts
// packages/core/src/config/index.ts
export interface AdentaConfig {
  // Database configuration
  database: {
    provider: 'supabase' | 'postgres';
    url?: string;
    key?: string;
    serviceKey?: string;
  };
  
  // CMS configuration
  cms: {
    enabled: boolean;
    collections?: string[];
    adminPath?: string;
    secret?: string;
  };
  
  // UI configuration
  ui: {
    framework: 'react' | 'vue' | 'svelte';
    styling: 'tailwind' | 'styled-components' | 'css-modules';
    components?: string[];
  };
  
  // Build configuration
  build: {
    target: 'node' | 'browser' | 'universal';
    bundler: 'rspack' | 'vite' | 'webpack';
  };
  
  // Development configuration
  dev: {
    port: number;
    host: string;
    https?: boolean;
  };
}

// Configuration loader with c12
import { loadConfig } from 'c12';
import { resolve } from 'pathe';

export async function loadAdentaConfig(rootDir: string = process.cwd()): Promise<AdentaConfig> {
  const { config } = await loadConfig<AdentaConfig>({
    name: 'adenta',
    configFile: 'adenta.config',
    rcFile: '.adentarc',
    globalRc: true,
    dotenv: true,
    defaults: {
      database: {
        provider: 'supabase'
      },
      cms: {
        enabled: true,
        adminPath: '/admin'
      },
      ui: {
        framework: 'react',
        styling: 'tailwind'
      },
      build: {
        target: 'universal',
        bundler: 'rspack'
      },
      dev: {
        port: 3000,
        host: 'localhost'
      }
    }
  });
  
  return config;
}

// packages/core/src/supabase/index.ts
import { createClient } from '@supabase/supabase-js';
import type { AdentaConfig } from '../config';

export class SupabaseManager {
  private client: any;
  private config: AdentaConfig['database'];
  
  constructor(config: AdentaConfig['database']) {
    this.config = config;
  }
  
  async initialize() {
    if (this.config.provider === 'supabase') {
      this.client = createClient(
        this.config.url!,
        this.config.key!
      );
    }
    return this.client;
  }
  
  async setupProject() {
    // Logic to setup Supabase project via CLI
    // This will run supabase init, supabase start, etc.
  }
  
  async generateTypes() {
    // Generate TypeScript types from Supabase schema
  }
  
  getClient() {
    return this.client;
  }
}

// packages/core/src/framework/index.ts
export class AdentaFramework {
  private config: AdentaConfig;
  private supabase: SupabaseManager;
  
  constructor(config: AdentaConfig) {
    this.config = config;
    this.supabase = new SupabaseManager(config.database);
  }
  
  async initialize() {
    await this.supabase.initialize();
    // Initialize other services
  }
  
  async build() {
    // Build the application based on config
  }
  
  async dev() {
    // Start development server
  }
}
```


# Adenta Framework - Technical Implementation

## Configuration System
- Use `c12` for configuration loading (already in your dependencies)
- Support `adenta.config.js`, `.adentarc`, and environment variables
- Allow configuration merging and overrides

## Development Server
```typescript
// Core development server approach
class AdentaDev {
  async start(config: AdentaConfig) {
    // 1. Start Supabase local development (if enabled)
    if (config.database.provider === 'supabase') {
      await this.startSupabase();
    }
    
    // 2. Start CMS (if enabled)
    if (config.cms.enabled) {
      await this.startCMS();
    }
    
    // 3. Start UI development server
    await this.startUI(config);
  }
}
```

## Build System
- Use RSPack (already in dependencies) as default bundler
- Support multiple targets: SSG, SSR, SPA
- Automatic code splitting and optimization
- TypeScript support out of the box

## Database Integration
```typescript
// Supabase integration approach
export class SupabaseManager {
  async setupProject(projectDir: string) {
    // 1. Initialize Supabase project
    execSync('supabase init', { cwd: projectDir });
    
    // 2. Start local development
    execSync('supabase start', { cwd: projectDir });
    
    // 3. Generate TypeScript types
    await this.generateTypes();
    
    // 4. Setup authentication (if needed)
    await this.setupAuth();
  }
  
  async generateTypes() {
    // Generate types from Supabase schema
    execSync('supabase gen types typescript --local > types/database.ts');
  }
}
```