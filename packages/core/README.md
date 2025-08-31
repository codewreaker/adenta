# @adenta/core

[![npm version](https://badge.fury.io/js/%40adenta%2Fcore.svg)](https://badge.fury.io/js/%40adenta%2Fcore)
[![npm downloads](https://img.shields.io/npm/dm/@adenta/core)](https://www.npmjs.com/package/@adenta/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

> **⚠️ WARNING: This package is currently in active development and is NOT stable for production use. Breaking changes may occur without notice.**

Core utilities and shared functionality for the Adenta ecosystem. Provides essential tools for configuration, logging, environment management, and common utilities.

## 🚧 Status: Work in Progress

This package is under active development. The API is not stable and may change significantly between versions. Use at your own risk.

## 📦 Installation

```bash
npm install @adenta/core
# or
yarn add @adenta/core
# or
pnpm add @adenta/core
```

## 🔧 Requirements

- Node.js >= 18.20.2
- TypeScript (recommended)

## 📖 Usage

```typescript
import { logger, loadConfig, getCwd } from '@adenta/core'

// Initialize logger
const log = logger('my-app')

// Load configuration
const config = await loadConfig({
  name: 'my-app',
  defaults: {
    port: 3000
  }
})

// Get current working directory
const cwd = getCwd()
```

## 🛠️ API

### Logger
```typescript
import { logger } from '@adenta/core'

const log = logger('namespace')
log.info('Hello World')
log.error('Something went wrong')
```

### Configuration
```typescript
import { loadConfig } from '@adenta/core'

const config = await loadConfig({
  name: 'app-name',
  defaults: {
    port: 3000,
    host: 'localhost'
  }
})
```

### Environment Utilities
```typescript
import { getCwd, formatWithOptions } from '@adenta/core'

const cwd = getCwd()
const formatted = formatWithOptions('Hello {name}', { name: 'World' })
```

## 📚 Documentation

For detailed documentation, visit [docs.adenta.dev](https://docs.israelprempeh.com/)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Packages

- [`@adenta/cli`](../cli) - Command-line interface tools
- [`@adenta/ui`](../ui) - React UI components
- [`@adenta/cms`](../cms) - Content management system

## 📊 Version History

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes.

---

**Note**: This package is part of the Adenta ecosystem. For more information, visit [adenta.dev](https://adenta.dev).
