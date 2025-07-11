import { Hono } from 'hono';
import { serve } from '@hono/node-server';
// import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAndBundleMdx } from '../src/mdx-bundler';
import {
  MdxSourceInput,
} from '../src/mdx-bundler/lib/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();
const distDir = path.join(__dirname, 'dist');

// Serve static files from dist (client build)
app.get('/', (c) =>
  c.html(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'))
);
app.get('/assets/*', (c) => {
  const rel = c.req.path.replace('/assets/', '');
  const filePath = path.join(distDir, 'assets', rel);
  if (!fs.existsSync(filePath)) return c.notFound();
  const ext = path.extname(filePath);
  const type =
    ext === '.js'
      ? 'application/javascript'
      : ext === '.css'
      ? 'text/css'
      : 'text/plain';
  return c.body(fs.readFileSync(filePath), 200, { 'Content-Type': type });
});
app.get('/dist/*', (c) => {
  // fallback for any other static files in dist
  const rel = c.req.path.replace('/dist/', '');
  const filePath = path.join(distDir, rel);
  if (!fs.existsSync(filePath)) return c.notFound();
  const ext = path.extname(filePath);
  const type =
    ext === '.js'
      ? 'application/javascript'
      : ext === '.css'
      ? 'text/css'
      : 'text/plain';
  return c.body(fs.readFileSync(filePath), 200, { 'Content-Type': type });
});

// Main API endpoint
app.post('/api/mdx', async (c) => {
  const body = await c.req.json();

  try {
    let input: MdxSourceInput;
    if (body.type === 'local') {
      const {filepaths} = body
      input = {
        type: 'local',
        meta: {
          filepaths,
          filePathDir: __dirname
        }
      };
    } else if (body.type === 'github') {
      const { owner, repo, path, branch = 'main', slugs } = body;
      input = {
        type: 'github',
        meta: {
          owner,
          repo,
          branch,
          path,
          slugs
        }
      };
    } else if (body.type === 'raw') {
      input = {
        type: body.type,
        meta: {
         mdx:[body.mdx]
        }
      };
    } else {
      return c.json({ error: 'Invalid type' }, 400);
    }
    const results = await loadAndBundleMdx(input);
    // For compatibility with old API, return the first result (single file)
    if (results.length === 1) {
      const { code, frontmatter } = results[0];
      return c.json({ code, frontmatter });
    }
    // If multiple files, return all
    return c.json({ results });
  } catch (e) {
    console.error('INTERNAL', e);
    return c.json({ error: e.message }, 500);
  }
});

serve({ fetch: app.fetch, port: 4000 });
console.log('Unified server running at http://localhost:4000');
