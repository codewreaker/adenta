# Adenta Full-Stack Toolkit Architecture Plan

## Current Analysis

Your monorepo structure shows a well-organized approach with:
- **Core**: Utilities, tools, APIs, and DB setup (Supabase)
- **CMS**: PayloadCMS-based admin dashboard with Supabase Postgres
- **CLI**: Command-line interface for bootstrapping
- **UI**: React components library
- **Documentation**: RSPress-based docs

## Target Architecture for `npx adenta --new`

### 1. Enhanced CLI Structure (`packages/cli`)

```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── new.ts           # Main command handler
│   │   ├── init.ts          # Initialize existing project
│   │   └── generate.ts      # Code generation
│   ├── templates/           # Project templates
│   │   ├── nextjs/          # Next.js template
│   │   ├── react-spa/       # React SPA template
│   │   └── full-stack/      # Complete stack template
│   ├── generators/          # Code generators
│   │   ├── component.ts
│   │   ├── page.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── supabase.ts      # Supabase setup utilities
│   │   ├── config.ts        # Config management
│   │   └── templates.ts     # Template utilities
│   └── index.ts
```

### 2. Core Package Enhancement (`packages/core`)

```
packages/core/
├── src/
│   ├── config/
│   │   ├── index.ts         # Main config loader
│   │   ├── schema.ts        # Config validation schema
│   │   └── defaults.ts      # Default configurations
│   ├── database/
│   │   ├── supabase.ts      # Supabase client setup
│   │   ├── migrations.ts    # Migration utilities
│   │   └── types.ts         # Database types
│   ├── utils/
│   │   ├── logger.ts        # Enhanced logging
│   │   ├── filesystem.ts    # File operations
│   │   └── process.ts       # Process management
│   ├── auth/
│   │   ├── providers.ts     # Auth provider configs
│   │   └── middleware.ts    # Auth middleware
│   └── types/
│       └── config.ts        # Config type definitions
```

### 3. Configuration System (`adenta.config.js`)

```javascript
// adenta.config.js structure
export default {
  // Project metadata
  project: {
    name: "my-app",
    version: "1.0.0",
    description: "My Adenta application"
  },
  
  // Database configuration
  database: {
    provider: "supabase",
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },
  
  // CMS configuration
  cms: {
    enabled: true,
    path: "/admin",
    collections: ["users", "posts", "media"]
  },
  
  // UI configuration
  ui: {
    theme: "default",
    components: "@adenta/ui",
    styling: "tailwind"
  },
  
  // Build configuration
  build: {
    bundler: "rspack", // or "vite", "webpack"
    target: "web",
    output: "dist"
  },
  
  // Development configuration
  dev: {
    port: 3000,
    hot: true,
    proxy: {}
  },
  
  // Deployment configuration
  deploy: {
    platform: "vercel", // or "netlify", "railway"
    domains: ["example.com"]
  }
}
```

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
1. **Enhance CLI Package**
   - Implement `adenta new` command
   - Create project templates
   - Add interactive prompts using `@clack/prompts`

2. **Config System**
   - Design config schema with validation
   - Implement config loading and merging
   - Add environment variable support

3. **Template System**
   - Create base project templates
   - Implement template variable replacement
   - Add template validation

### Phase 2: Supabase Integration (Weeks 3-4)
1. **Database Setup**
   - Auto-initialize Supabase project
   - Generate database schema
   - Setup authentication

2. **CLI Supabase Commands**
   - `adenta db:init` - Initialize database
   - `adenta db:migrate` - Run migrations
   - `adenta db:seed` - Seed data

3. **Environment Management**
   - Auto-generate `.env` files
   - Validate required environment variables
   - Setup local development environment

### Phase 3: CMS Integration (Weeks 5-6)
1. **PayloadCMS Setup**
   - Auto-configure Payload with Supabase
   - Generate admin interface
   - Setup collections based on schema

2. **Admin Dashboard**
   - Integrate with existing CMS package
   - Custom admin components
   - Role-based access control

### Phase 4: Development Experience (Weeks 7-8)
1. **Hot Reload & Dev Server**
   - Integrate development server
   - Hot module replacement
   - Error handling and debugging

2. **Code Generation**
   - `adenta generate component`
   - `adenta generate page`
   - `adenta generate api`

## Technical Implementation Details

### 1. CLI Command Structure

```typescript
// packages/cli/src/commands/new.ts
import { intro, text, select, confirm, outro } from '@clack/prompts';
import { createProject } from '../utils/project';
import { setupSupabase } from '../utils/supabase';

export async function newCommand() {
  intro('🚀 Welcome to Adenta');
  
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-awesome-app'
  });
  
  const template = await select({
    message: 'Choose a template',
    options: [
      { value: 'full-stack', label: 'Full-stack (Next.js + CMS)' },
      { value: 'frontend', label: 'Frontend only (React SPA)' },
      { value: 'cms-only', label: 'CMS only (Payload + API)' }
    ]
  });
  
  const useSupabase = await confirm({
    message: 'Set up Supabase?',
    initialValue: true
  });
  
  // Create project
  await createProject({ name: projectName, template });
  
  if (useSupabase) {
    await setupSupabase(projectName);
  }
  
  outro('✅ Project created successfully!');
}
```

### 2. Supabase Setup Utility

```typescript
// packages/core/src/database/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

export async function initializeSupabase(projectName: string) {
  try {
    // Check if Supabase CLI is installed
    execSync('supabase --version', { stdio: 'ignore' });
    
    // Initialize Supabase project
    execSync(`supabase init`, { cwd: projectName });
    
    // Start local development
    execSync(`supabase start`, { cwd: projectName });
    
    // Get local credentials
    const status = execSync(`supabase status`, { 
      cwd: projectName, 
      encoding: 'utf8' 
    });
    
    return parseSupabaseStatus(status);
  } catch (error) {
    throw new Error('Supabase CLI not found. Please install it first.');
  }
}

function parseSupabaseStatus(status: string) {
  // Parse and return Supabase credentials
  const lines = status.split('\n');
  const credentials = {};
  
  lines.forEach(line => {
    if (line.includes('API URL')) {
      credentials.url = line.split(':').slice(1).join(':').trim();
    }
    // Parse other credentials...
  });
  
  return credentials;
}
```

### 3. Project Template System

```typescript
// packages/cli/src/utils/templates.ts
import { join } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

export async function generateFromTemplate(
  templatePath: string, 
  targetPath: string, 
  variables: Record<string, string>
) {
  const template = readFileSync(templatePath, 'utf8');
  const content = replaceVariables(template, variables);
  
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, content);
}

function replaceVariables(content: string, variables: Record<string, string>) {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}
```

## Key Benefits of This Architecture

1. **Developer Experience**: Single command setup with intelligent defaults
2. **Flexibility**: Modular approach allows choosing components
3. **Production Ready**: Built-in best practices and configurations
4. **Extensible**: Plugin system for custom functionality
5. **Type Safety**: Full TypeScript support throughout

## Next Steps

1. Start with Phase 1 to establish the foundation
2. Create a simple proof-of-concept with basic project generation
3. Gradually add Supabase integration and CMS setup
4. Iterate based on user feedback and real-world usage

This architecture will make Adenta a powerful competitor to frameworks like T3 Stack, but with the added benefit of integrated CMS and database management through Supabase.