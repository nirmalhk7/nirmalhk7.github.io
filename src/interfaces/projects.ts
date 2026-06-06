export interface ProjectFrontmatterInterface {
  title: string;
  tags?: string[];
  special?: boolean;
  summary?: string;
  url?: string;
  homepage?: string;
  source?: "github" | "manual";
}

export interface ProjectInterface {
  frontmatter: ProjectFrontmatterInterface;
  content: string | null;
  excerpt: string | null;
  slug: string;
}
