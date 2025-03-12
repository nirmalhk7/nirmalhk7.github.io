import fs from "fs"
import matter from "gray-matter"

interface LoadMarkdownOptions {
  getContent?: boolean,
  getExcerpt?: boolean
}

const parseMarkdownFile = (path: string) => {
  const readFile = fs.readFileSync(path, 'utf-8');
  return matter(readFile);
}

const createMarkdownObject = (slug: string, frontmatter: any, content: string, excerpt?: string, options?: LoadMarkdownOptions) => ({
  childMarkdownRemark: { frontmatter },
  content: options?.getContent ? content : null,
  excerpt: options?.getExcerpt ? excerpt : null,
  slug
});

export const loadMarkdownFile = (path: string, slug: string, options?: LoadMarkdownOptions) => {
  const { data: frontmatter, content, excerpt } = parseMarkdownFile(path);
  return createMarkdownObject(slug, frontmatter, content, excerpt, options);
}

export const loadMarkdownFiles = (path: fs.PathLike, options?: LoadMarkdownOptions) => {
  const files = fs.readdirSync(path);
  return files.filter(file => file.endsWith(".md")).map((fileName) => {
    const slug = fileName.replace('.md', '');
    const { data: frontmatter, content, excerpt } = parseMarkdownFile(`${path}/${fileName}`);
    return createMarkdownObject(slug, frontmatter, content, excerpt, options);
  });
}