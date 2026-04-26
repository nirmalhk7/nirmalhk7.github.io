import fs from "fs";
import matter from "gray-matter";

interface LoadMarkdownOptions {
  getContent: boolean;
  getExcerpt: boolean;
}

const parseMarkdownFile = (path: fs.PathLike) => {
  const readFile = fs.readFileSync(path, "utf-8");
  return matter(readFile);
};

export interface MarkdownObject<T = Record<string, unknown>> {
  frontmatter: T;
  content: string | null;
  excerpt: string | undefined;
  slug: string;
}


export const loadMarkdownFile = <T = Record<string, unknown>>(
  path: fs.PathLike,
  slug: string,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject<T> => {
  const { data: frontmatter, content, excerpt } = parseMarkdownFile(path);
  const fileInfo: MarkdownObject<T> = {
    slug,
    frontmatter: frontmatter as T,
    content: "",
    excerpt: ""
  }
  if(options.getContent===true){
    fileInfo.content = content
  }
  if(options.getExcerpt===true){
    fileInfo.excerpt = excerpt || ""
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

