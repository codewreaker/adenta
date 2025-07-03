import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono();
const postsDir = path.join(__dirname, 'posts');
const distDir = path.join(__dirname, 'dist');

// Serve static files from dist (client build)
app.get('/', c => c.html(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')));
app.get('/assets/*', c => {
  const rel = c.req.path.replace('/assets/', '');
  const filePath = path.join(distDir, 'assets', rel);
  if (!fs.existsSync(filePath)) return c.notFound();
  const ext = path.extname(filePath);
  const type = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/plain';
  return c.body(fs.readFileSync(filePath), 200, { 'Content-Type': type });
});
app.get('/dist/*', c => {
  // fallback for any other static files in dist
  const rel = c.req.path.replace('/dist/', '');
  const filePath = path.join(distDir, rel);
  if (!fs.existsSync(filePath)) return c.notFound();
  const ext = path.extname(filePath);
  const type = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/plain';
  return c.body(fs.readFileSync(filePath), 200, { 'Content-Type': type });
});

// Serve getMDXComponent utility for browser
app.get('/client.js', c =>
  c.body(`export { getMDXComponent } from 'mdx-bundler/client';`, 200, { 'Content-Type': 'application/javascript' })
);

// Main API endpoint
app.post('/api/mdx', async c => {
  const body = await c.req.json();
  

  try {
    let source = '';
    if (body.type === 'local') {
      const filePath = path.join(postsDir, `${body.slug}.mdx`);
      if (!fs.existsSync(filePath)) return c.json({ error: 'Not found' }, 404);
      source = fs.readFileSync(filePath, 'utf8');
    } else if (body.type === 'github') {
      const { owner, repo, path: repoPath, branch = 'main' } = body;
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repoPath}`;
      const res = await fetch(url);
      if (!res.ok) return c.json({ error: 'Could not fetch MDX from GitHub' }, 404);
      source = await res.text();
    } else if (body.type === 'raw') {
      source = body.mdx;
    } else {
      return c.json({ error: 'Invalid type' }, 400);
    }
    const { code, frontmatter } = await bundleMDX({ source });
    return c.json({ code, frontmatter });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

serve({ fetch: app.fetch, port: 4000 });
console.log('Unified server running at http://localhost:4000'); 