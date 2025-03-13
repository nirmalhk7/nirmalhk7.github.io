export interface BlogFrontmatterInterface {
  tags: string[];
  category: string;
  title: string;
  img?: string
}

export interface BlogMiniInterface {
  frontmatter?: BlogFrontmatterInterface;
  excerpt: string | null | undefined;
  slug: string;
}

export interface BlogInterface extends BlogMiniInterface {
  content: string | null;
}
