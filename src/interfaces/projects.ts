export interface ProjectFrontmatterInterface {
  title: string;
  tags?: string[];
  special?: boolean;
}

export interface ProjectInterface {
  frontmatter: ProjectFrontmatterInterface;
  content: string | null;
  excerpt: string | null | undefined;
  slug: string;
}
