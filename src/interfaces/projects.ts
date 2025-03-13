export interface ProjectInterface {
  frontmatter: {
    title: string;
    tags?: string[];
    special?: boolean;
  };
  content: string | null;
  excerpt: string | null | undefined;
  slug: string;
}
