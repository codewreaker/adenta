
interface BlogMetadata {
  slug: string;
  title: string;
  description?: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags?: string[];
  author?: string;
  draft?: boolean;
  featured?: boolean;
  [key: string]: any;
}


// Define the type for a parsed doc
interface ParsedDoc {
    slug: string
    filePath: string
    frontmatter: any
    content: string
    compiledContent: string
    metadata: BlogMetadata
  }