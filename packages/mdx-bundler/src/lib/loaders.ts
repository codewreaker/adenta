/**
 * Load from file paths (string[]) in Node/Vite context.
 */
export async function loadFromFiles(
filePaths: LoadOptions['filePaths'] | null = null,
  callback: (
    content: string,
    filePath: File
  ) => Promise<void>
) {

 if(!filePaths) throw Error('No filePaths specified');

  const pathMod = await import('node:path');
  for (const filePath of filePaths) {
    const resolvedPath = pathMod.resolve(String(filePath));
    // Dynamic import (Vite/Node only)
    const mod = await import(/* @vite-ignore */ resolvedPath);
    // Try default export, content property, or the whole module as string
    let content = '';
    if (typeof mod.default === 'string') {
      content = mod.default;
    } else if (typeof mod.content === 'string') {
      content = mod.content;
    } else if (typeof mod === 'string') {
      content = mod;
    } else {
      throw new Error(
        `Could not extract MDX/MD content from module: ${resolvedPath}`
      );
    }
    await callback(content, filePath);
  }
}

const loadFromRemote: LoadFromRemote = async (
  { branch, filePaths, owner, repo, token },
  callback
) => {
  for (const file of filePaths) {
    if (
      file.type === 'file' &&
      (file.name.endsWith('.md') || file.name.endsWith('.mdx'))
    ) {
      const contentResponse = await fetch(file?.download_url);
      const content = await contentResponse.text();
      await callback(content, file?.path);
    } else if (file.type === 'dir') {
      const subContentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`;
      const headers: Record<string, string> = token
        ? {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          }
        : { Accept: 'application/vnd.github.v3+json' };
      const subResponse = await fetch(subContentUrl, { headers });
      const subFiles = await subResponse.json();
      await loadFromRemote(
        { filePaths: subFiles, owner, repo, branch, token },
        callback
      );
    }
  }
};


/**
* Load all MDX/MD files from a GitHub repo (recursively).
*/
export async function loadFromGithub(options:GithubLoadeOptions, callback: (
    content: string,
    filePath: string
  ) => Promise<void>) {
 const { owner, repo, branch = 'main', docsPath = '', token } = options;
 const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${docsPath}?ref=${branch}`;
 const headers: Record<string, string> = token
   ? {
       Authorization: `token ${token}`,
       Accept: 'application/vnd.github.v3+json',
     }
   : { Accept: 'application/vnd.github.v3+json' };
 const response = await fetch(contentUrl, { headers });
 if (!response.ok) throw new Error('Failed to fetch content from GitHub');
 const file = await response.json();
 await loadFromRemote({filePaths: [file], owner, repo, branch, token}, callback);
}

/**
 * Parse and store a doc in the collection.
 */
export async function storeDoc(
    collection: ParsedDocCollection,
    content: string,
    frontmatter: Frontmatter,
    filePath: string
  ) {
    const slug = filePath
      .replace(/\\/g, '/')
      .replace(/\.(md|mdx)$/, '')
      .replace(/\/index$/, '')
      .toLowerCase();
    collection.insert({
      slug,
      filePath,
      frontmatter,
      content,
      metadata: {
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description,
        publishedAt: frontmatter.publishedAt
          ? new Date(frontmatter.publishedAt)
          : new Date(),
        updatedAt: frontmatter.updatedAt
          ? new Date(frontmatter.updatedAt)
          : undefined,
        tags: frontmatter.tags || [],
        author: frontmatter.author,
        draft: frontmatter.draft || false,
        featured: frontmatter.featured || false,
      },
    });
  }