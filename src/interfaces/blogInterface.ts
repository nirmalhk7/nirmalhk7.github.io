
interface BlogInterface {
    html: string
    frontmatter: {
      title: string,
      category: string,
      date: string,
      img: {
        childImageSharp: {
          original: {
            src: string
          }
        }
      }
    }
  }

  export default BlogInterface;