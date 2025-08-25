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

1. Create a cli that sets up the project.
2. Command should setup and install supabase
3. cli should make it easy to display necessary details

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

4. Module federate the admin dashboard and the supabase dash