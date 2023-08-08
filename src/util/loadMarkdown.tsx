import fs from "fs"
import matter from "gray-matter"

interface LoadMarkdownOptions {
  getContent?: boolean,
  getExcerpt?: boolean
}

export const loadMarkdownFile = (path: string, slug: string, options?: LoadMarkdownOptions) => {
    const readFile = fs.readFileSync(path, 'utf-8');
    const { data: frontmatter, content, excerpt } = matter(readFile);
      
    return {
      id: slug,
      childMarkdownRemark: { frontmatter },
      content: options && options.getContent ? content: null,
      excerpt: options && options.getExcerpt ? excerpt:null,
      slug
    };
}


export const loadMarkdownFiles = (path: fs.PathLike, options?: LoadMarkdownOptions) => {
    const files = fs.readdirSync(path);
  
    return files.filter(e1=>e1.endsWith(".md")).map((fileName) => {
      const slug = fileName.replace('.md', '');
      const readFile = fs.readFileSync(`${path}/${fileName}`, 'utf-8');
      const { data: frontmatter, content, excerpt } = matter(readFile);
      
      return {
        id: slug,
        childMarkdownRemark: { frontmatter },
        content: options && options.getContent ? content: null,
        excerpt: options && options.getExcerpt ? excerpt:null,
        slug
      };  
    }); 
}