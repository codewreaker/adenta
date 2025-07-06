import type {BundledTheme, BundledLanguage} from 'shiki'
import rehypeShiki from '@shikijs/rehype'
// Use dynamic import for shiki (ESM)

/**

  const shiki = await import('shiki');
  const highlighter = await shiki.createHighlighter({ themes: ['nord'], langs: ['js','ts','tsx','jsx','json','css','html','md','mdx'] });
  // Use dynamic import for unist-util-visit (ESM)
  const { visit } = await import('unist-util-visit');
  const rehypeShiki = () => async (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'code' && node.properties && node.properties.className) {
        const lang = (node.properties.className[0] || '').replace('language-', '');
        if (lang && highlighter.getLoadedLanguages().includes(lang)) {
          const code = node.children[0]?.value || '';
          node.children = [{ type: 'raw', value: highlighter.codeToHtml(code, { lang, theme: 'nord' }) }];
        }
      }
    });
  };
     * 
   */

class ShikiHighlighterSingleton {
  private static instance: ShikiHighlighterSingleton | null = null;
  private highlighter: any = null;
  private rehypeShiki: any = null;
  private initialized = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static async getInstance(
    themes: BundledTheme[] = ['nord'], 
    langs: BundledLanguage[] = ['js', 'ts', 'tsx', 'jsx', 'json', 'css', 'html', 'md', 'mdx']
  ) {
    if (!ShikiHighlighterSingleton.instance) {
      ShikiHighlighterSingleton.instance = new ShikiHighlighterSingleton();
    }

    if (!ShikiHighlighterSingleton.instance.initialized) {
      await ShikiHighlighterSingleton.instance.initialize(themes, langs);
    }

    return ShikiHighlighterSingleton.instance;
  }

  private async initialize(
    themes:BundledTheme[] , 
    langs:BundledLanguage[]
  ) {
    if (this.initialized) return;

    const shiki = await import('shiki');
    this.highlighter = await shiki.createHighlighter({
      themes,
      langs,
    });

    // Use dynamic import for unist-util-visit (ESM)
    const { visit } = await import('unist-util-visit');

    this.rehypeShiki = () => async (tree: any) => {
      visit(tree, 'element', (node: any) => {
        if (
          node.tagName === 'code' &&
          node.properties &&
          node.properties.className
        ) {
          const lang = (node.properties.className[0] || '').replace(
            'language-',
            ''
          );
          if (lang && this.highlighter.getLoadedLanguages().includes(lang)) {
            const code = node.children[0]?.value || '';
            node.children = [
              {
                type: 'raw',
                value: this.highlighter.codeToHtml(code, {
                  lang,
                  theme: 'nord',
                }),
              },
            ];
          }
        }
      });
    };

    this.initialized = true;
  }

  private getHighlighter() {
    if (!this.initialized) {
      throw new Error('Singleton not initialized. Call getInstance() first.');
    }
    return this.highlighter;
  }

  private getRehypeShiki() {
    if (!this.initialized) {
      throw new Error('Singleton not initialized. Call getInstance() first.');
    }
    return this.rehypeShiki;
  }

  getShiki() {
    const highlighter = this.getHighlighter();
    const rehypeShiki = this.getRehypeShiki();
    return { highlighter, rehypeShiki };
  }
}

// Usage example:
// const singleton = await ShikiHighlighterSingleton.getInstance();
// const {highlighter, rehypeShiki = singleton.getShiki();
// const  = singleton.getRehypeShiki();
export default ShikiHighlighterSingleton;

export {rehypeShiki}