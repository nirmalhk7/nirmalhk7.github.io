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

interface MarkdownObject {
  frontmatter: { [key: string]: string };
  content: string | null;
  excerpt: string | undefined;
  slug: string;
}


export const loadMarkdownFile = (
  path: fs.PathLike,
  slug: string,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject => {
  const { data: frontmatter, content, excerpt } = parseMarkdownFile(path);
  const fileInfo = {
    slug,
    frontmatter,
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

export const loadMarkdownFiles = (
  path: fs.PathLike,
  options: LoadMarkdownOptions = { getContent: true, getExcerpt: true }
): MarkdownObject[] => {
  const files = fs.readdirSync(path);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(".md", "");
      return loadMarkdownFile(`${path}/${fileName}`, slug, options);
    });
};
