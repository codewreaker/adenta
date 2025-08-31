import { dirname } from 'pathe';
import { isBrowser } from './env-utils.ts';

export const getCwd = (): string => {
  // Node.js/Deno/Bun - use process.cwd() or fallback to import.meta.url
  try {
    return process.cwd();
  } catch (error) {
    if (isBrowser) return dirname(import.meta.url);
    // Fallback to module directory if process.cwd() fails
    throw error;
  }
};
