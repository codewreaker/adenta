# @adenta/cms

[![npm version](https://badge.fury.io/js/%40adenta%2Fcms.svg)](https://badge.fury.io/js/%40adenta%2Fcms)
[![npm downloads](https://img.shields.io/npm/dm/@adenta/cms)](https://www.npmjs.com/package/@adenta/cms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-000000?logo=payload&logoColor=white)](https://payloadcms.com/)

> **⚠️ WARNING: This package is currently in active development and is NOT stable for production use. Breaking changes may occur without notice.**

Content Management System built with Payload CMS and Supabase. Provides a modern, headless CMS with PostgreSQL database, authentication, and admin interface.

## 🚧 Status: Work in Progress

This package is under active development. The API is not stable and may change significantly between versions. Use at your own risk.

The intended solution should feel like below

## 📦 Installation

```bash
npm install @adenta/cms
# or
yarn add @adenta/cms
# or
pnpm add @adenta/cms
```

## 🔧 Requirements

- Node.js >= 18.20.2
- PostgreSQL or Supabase
- pnpm >= 9.0.0

## 📖 Quick Start

```typescript
import { createCMS } from '@adenta/cms'

const cms = createCMS({
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL
  },
  collections: [
    {
      name: 'posts',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'content',
          type: 'richText'
        }
      ]
    }
  ]
})

export default cms
```

## 🛠️ Features

### Database Adapters
```typescript
// PostgreSQL
const postgresConfig = {
  type: 'postgres',
  url: process.env.DATABASE_URL
}

// Supabase
const supabaseConfig = {
  type: 'supabase',
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY
}
```

### Collections
```typescript
import { CollectionConfig } from '@adenta/cms'

const Posts: CollectionConfig = {
  name: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      unique: true
    },
    {
      name: 'content',
      type: 'richText'
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media'
    }
  ]
}
```

### Authentication
```typescript
import { auth } from '@adenta/cms'

// Login
const user = await auth.login({
  email: 'user@example.com',
  password: 'password'
})

// Register
const newUser = await auth.register({
  email: 'newuser@example.com',
  password: 'password',
  name: 'John Doe'
})
```

## 🚀 Development

```bash
# Start development server
pnpm start

# Build for production
pnpm build

# Run tests
pnpm test
```

## 📚 Documentation

For detailed documentation, visit [docs.adenta.dev](https://docs.israelprempeh.com/)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Packages

- [`@adenta/core`](../core) - Core utilities and shared functionality
- [`@adenta/cli`](../cli) - Command-line interface tools
- [`@adenta/ui`](../ui) - React UI components

## 📊 Version History

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

---

**Note**: This package is part of the Adenta ecosystem. For more information, visit [adenta.dev](https://adenta.dev).
