import fs from 'node:fs'

// --- Utility: Load MDX files ---
export async function loadMdxFiles(
  input: MdxSourceInput
): Promise<{ filename: string; content: string, type: MdxSourceInput['type'] }[]> {
  if (input.type === 'github') {
    const { owner, repo, path: repoPath, branch = 'main' } = input.meta;
    // For simplicity, assume path is a file or a directory (not recursive)
    // Use global fetch (Node 18+)
    if (repoPath.endsWith('.mdx')) {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${repoPath}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Could not fetch MDX from GitHub');
      return [{ filename: repoPath, content: await res.text(), type:input.type }];
    } else {
      // Directory listing via GitHub API
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}?ref=${branch}`;
      console.log(`url:${apiUrl}`);
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Could not list directory from GitHub');
      const files = await res.json();
      const mdxFiles = files.filter((f: any) => f.name.endsWith('.mdx'));
      return Promise.all(
        mdxFiles.map(async (f: any) => {
          const fileRes = await fetch(f.download_url);
          if (!fileRes.ok) throw new Error('Could not fetch ' + f.name);
          return { filename: f.path, content: await fileRes.text() };
        })
      );
    }
  } else if (input.type === 'local') {
    return input.files.map((file) => ({
      filename: file,
      content: fs.readFileSync(file, 'utf8'),
      type:input.type
    }));
  } else if (input.type === 'raw') {
    return input.files.map((file) => ({
      filename: file.filename,
      content: file.content,
      type: input.type
    }));
  }
  throw new Error('Invalid input type');
}