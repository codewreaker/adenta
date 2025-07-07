import { CollectionConfig, createCollection } from '@tanstack/db';
import { ParsedDoc } from './types.js';


let blogCollection: ReturnType<typeof createCollection<ParsedDoc>>;


/**
 * Singleton helper for the MDX collection.
 * Usage: import { getMDXCollection } from './mdx-bundler'
 */
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
      transaction.mutations.map(({key, changes}) => {
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(changes))
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
  getKey = (item: ParsedDoc) => item.slug,
}: Partial<Pick<CollectionConfig<ParsedDoc, string>, 'getKey' | 'onDelete' | 'onUpdate' | 'onInsert'>> = {}) => {
  if (!blogCollection) {

    blogCollection = createCollection<ParsedDoc>({
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
