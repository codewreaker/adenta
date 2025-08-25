proposed archtiecture
```
@adenta/cms/
├── supabase/
│   ├── config.toml              # Supabase local config
│   ├── seed.sql                 # Initial data
│   └── migrations/              # Database migrations
│       └── 20240101000000_initial_schema.sql
├── src/
│   ├── core/
│   │   ├── supabase-client.ts   # Supabase client setup
│   │   ├── payload-config.ts     # Payload CMS configuration
│   │   ├── database.ts           # DB connection logic
│   │   └── types.ts              # TypeScript definitions
│   ├── adapters/
│   │   ├── supabase.ts           # Supabase adapter
│   │   ├── postgres.ts           # Native Postgres adapter
│   │   └── base.ts               # Abstract adapter interface
|   |
│   ├── scripts/
│   │   ├── setup-local.ts       # Local setup automation
│   │   └── seed-data.ts         # Seed script
|   |
|   |
│   ├── api/
│   │   ├── routes.ts             # REST API routes
│   │   └── middleware.ts         # Auth, validation, etc.
│   ├── migrations/
│   │   └── initial-schema.sql    # Base database schema
│   └── index.ts                  # Main export
├── config/
│   └── cms.config.js             # User configuration file
└── package.json
```


The library would expose a simple API:
typescriptimport { createCMS } from '@adenta/cms'

```tsx
const cms = createCMS({
  database: {
    type: 'postgres', // or 'supabase'
    url: process.env.DATABASE_URL
  },
  collections: [
    // User-defined collections
  ]
})

export default cms
```