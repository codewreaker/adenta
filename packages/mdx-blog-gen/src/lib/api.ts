import type { GeneratorConfig } from './define-config.js';
import { CollectionConfig, createCollection } from '@tanstack/db';

export async function loadConfig(configPath: string): Promise<GeneratorConfig> {
  try {
    const module = await import(/* @vite-ignore */ configPath);
    return module.default || module;
  } catch (error: any) {
    throw new Error(
      `Failed to load config from ${configPath}: ${error.message}`
    );
  }
}

export function createDBInstance() {
  // Get Localstorage Instance
  const posts = getMDXCollection();
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
  };
}

let blogCollection: ReturnType<typeof createCollection>;

export const getMDXCollection = ({
  onDelete = async ({ transaction }) => {
    await Promise.all(
      transaction.mutations.map(({key, ...rest}) => {
        console.log(`[${key}] onDelete`);
        console.dir(rest);
      })
    );
  },
  onInsert = async ({ transaction }) => {
    console.log('onInsert');
    await Promise.all(
      transaction.mutations.map(({key, ...rest}) => {
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(rest))
        }
      })
    );
  },
  onUpdate = async ({ transaction }) => {
    console.log('onUpdate');
    await Promise.all(
      transaction.mutations.map(({key, ...rest}) => {
        console.log(`[${key}] onDelete`);
        console.dir(rest);
      })
    );
  },
  getKey = (item) => item['slug'] as string,
}: Partial<
  Pick<CollectionConfig, 'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'>
> = {}) => {
  if (!blogCollection) {

    blogCollection = createCollection({
      id: 'posts',
      getKey,
      onDelete,
      onInsert,
      onUpdate,
      sync: {
        sync: ({ collection }) => {
            const key = 'posts';
            // Load from localStorage on startup
            const saved =
              typeof localStorage !== 'undefined'
                ? localStorage.getItem(key)
                : null;
            if (saved) {
              try {
                const arr = JSON.parse(saved);
                arr.forEach((item: any) => collection.insert(item));
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
          },
      },
    });
  }
  return blogCollection;
};
