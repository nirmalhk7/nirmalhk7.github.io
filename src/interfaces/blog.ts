export interface BlogMiniInterface {
  childMarkdownRemark: {
    frontmatter?: {
      tags: string[];
      category: string;
      title: string;
      img?: string
    };
  };
  excerpt: string | null | undefined;
  slug: string;
}

export interface BlogInterface extends BlogMiniInterface {
  content: string | null;
}
