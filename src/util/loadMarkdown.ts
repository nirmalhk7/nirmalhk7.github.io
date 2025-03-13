import fs from "fs";
import matter from "gray-matter";

interface LoadMarkdownOptions {
  getContent?: boolean;
  getExcerpt?: boolean;
}

const parseMarkdownFile = (path: string) => {
  const readFile = fs.readFileSync(path, "utf-8");
  return matter(readFile);
};

interface MarkdownObject {
  frontmatter: { [key: string]: string };
  content: string | null;
  excerpt: string | null;
  slug: string;
}

const createMarkdownObject = (
  slug: string,
  frontmatter: any,
  content: string,
  options: {
    getContent: boolean;
    getExcerpt: boolean;
  },
  excerpt: string
): MarkdownObject => {
  const obj: MarkdownObject = {
    frontmatter,
    content: options.getContent ? content : null,
    excerpt: options.getExcerpt ? excerpt : null,
    slug,
  };
  return obj;
};

export const loadMarkdownFile = (
  path: string,
  slug: string,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject => {
  const { data: frontmatter, content, excerpt } = parseMarkdownFile(path);
  return createMarkdownObject(slug, frontmatter, content, options, excerpt);
};

export const loadMarkdownFiles = (
  path: fs.PathLike,
  options?: LoadMarkdownOptions
): MarkdownObject[] => {
  const files = fs.readdirSync(path);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(".md", "");
      const {
        data: frontmatter,
        content,
        excerpt,
      } = parseMarkdownFile(`${path}/${fileName}`);
      return createMarkdownObject(slug, frontmatter, content, excerpt, options);
    });
};
