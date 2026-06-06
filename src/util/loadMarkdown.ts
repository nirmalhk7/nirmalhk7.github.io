import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ProjectFrontmatterInterface } from "@/interfaces/projects";

interface LoadMarkdownOptions {
  getContent: boolean;
  getExcerpt: boolean;
}

const PROJECT_SYNC_MANIFEST = ".github-sync.json";

const parseMarkdownFile = (path: fs.PathLike) => {
  const readFile = fs.readFileSync(path, "utf-8");
  return matter(readFile);
};

const cleanExcerptText = (value: string) =>
  value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const extractExcerptFromContent = (content: string) => {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    if (/^#{1,6}\s+.+$/.test(paragraph) && !paragraph.includes("\n")) {
      continue;
    }

    const cleaned = cleanExcerptText(paragraph);
    if (cleaned) {
      return cleaned;
    }
  }

  return "";
};

export interface MarkdownObject<T = Record<string, unknown>> {
  frontmatter: T;
  content: string | null;
  excerpt: string | null;
  slug: string;
}

export const loadMarkdownFile = <T = Record<string, unknown>>(
  path: fs.PathLike,
  slug: string,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject<T> => {
  const { data: frontmatter, content, excerpt } = parseMarkdownFile(path);
  const frontmatterSummary = (frontmatter as { summary?: unknown }).summary;
  const resolvedExcerpt =
    typeof frontmatterSummary === "string" && frontmatterSummary.trim().length > 0
      ? frontmatterSummary.trim()
      : excerpt?.trim() || extractExcerptFromContent(content);

  const fileInfo: MarkdownObject<T> = {
    slug,
    frontmatter: frontmatter as T,
    content: null,
    excerpt: null
  };
  if (options.getContent === true) {
    fileInfo.content = content;
  }
  if (options.getExcerpt === true) {
    fileInfo.excerpt = resolvedExcerpt;
  }

  return fileInfo;
};

export const loadMarkdownFiles = <T = Record<string, unknown>>(
  path: fs.PathLike,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject<T>[] => {
  const files = fs.readdirSync(path);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(".md", "");
      return loadMarkdownFile<T>(`${path}/${fileName}`, slug, options);
    });
};

export const loadProjectMarkdownFiles = (
  projectsDir: fs.PathLike,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject<ProjectFrontmatterInterface>[] => {
  const projectPath = projectsDir.toString();
  const projectFiles = fs
    .readdirSync(projectPath)
    .filter((fileName) => fileName.endsWith(".md"));

  const markdownFiles = projectFiles.map((fileName) =>
    loadMarkdownFile<ProjectFrontmatterInterface>(
      path.join(projectPath, fileName),
      fileName.replace(".md", ""),
      options
    )
  );

  const syncManifestPath = path.join(projectPath, PROJECT_SYNC_MANIFEST);
  if (!fs.existsSync(syncManifestPath)) {
    return markdownFiles;
  }

  const generatedMarkdownFiles = markdownFiles.filter(
    (file) => file.frontmatter.source === "github"
  );

  return generatedMarkdownFiles.length > 0 ? generatedMarkdownFiles : markdownFiles;
};
