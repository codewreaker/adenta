import fs from 'node:fs';
import { GitHubFileInfo, MdxSourceInput, StandardSourceOutput } from '../types.js';
import { join, resolve } from 'node:path';

// --- Utility: Load MDX files ---
export async function loadMdxFiles(
  input: MdxSourceInput
): Promise<StandardSourceOutput[]> {
  if (input.type === 'github') {
    const { owner, repo, path, slugs = [], branch = 'main' } = input.meta;
    // For simplicity, assume path is a file or a directory (not recursive)
    // Use global fetch (Node 18+)
    if (slugs.length > 0) {
      return Promise.all(
        slugs.map(async (slug) => {
          const filepath = `${path}/${slug}.mdx`;
          const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filepath}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error('Could not fetch MDX from GitHub');
          return { filepath, content: await res.text(), type: input.type };
        })
      );
    } else {
      // Directory listing via GitHub API
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Could not list directory from GitHub');
      const files:GitHubFileInfo[] = await res.json();
      const mdxFiles = files.filter((f) => f.name.endsWith('.mdx'));
      return Promise.all(
        mdxFiles.map(async (f) => {
          const fileRes = await fetch(f.download_url);
          if (!fileRes.ok) throw new Error('Could not fetch ' + f.name);
          return { filepath: f.path, content: await fileRes.text(), type: input.type };
        })
      );
    }
  } else if (input.type === 'local') {
    const { filepaths, filePathDir } = input.meta;

    return filepaths.map(({path, slug}) => {
      const filepath = join(join(filePathDir,path), `${slug}.mdx`);
      if (!fs.existsSync(filepath)) throw new Error('File Not found');
      return {
        filepath,
        content: fs.readFileSync(filepath, 'utf8'),
        type: input.type,
      }
    });
  } else if (input.type === 'raw') {
    const { mdx } = input.meta;
    return mdx.map((content) => ({
      filepath: 'raw.mdx',
      content,
      type: input.type,
    }));
  }
  throw new Error('Invalid input type');
}
