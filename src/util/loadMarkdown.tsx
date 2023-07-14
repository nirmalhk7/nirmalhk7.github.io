import fs from "fs"
import matter from "gray-matter"

export const loadMarkdownFile = (path: string, slug: string) => {
    const readFile = fs.readFileSync(path, 'utf-8');
    const { data: frontmatter } = matter(readFile);
      
    return {
      id: slug,
      ... fs.statSync(path),
      childMarkdownRemark: { frontmatter },
      slug
    };
}


export const loadMarkdownFiles = (path: fs.PathLike) => {
    const files = fs.readdirSync(path);
    return files.map((fileName) => {
      const slug = fileName.replace('.md', '');
      const readFile = fs.readFileSync(`${path}/${fileName}`, 'utf-8');
      const { data: frontmatter } = matter(readFile);
        
      return {
        id: slug,
        // birthtime: fs.statSync(`${path}/${fileName}`).birthtime,
        childMarkdownRemark: { frontmatter },
        slug
      };  
    }); 
}