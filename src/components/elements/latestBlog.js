import { Link } from "gatsby";

const LatestBlogItem = ({ item }) => {
  if (!item.frontmatter) return null;
  let srx = item.frontmatter.img;
  // if (srx.childImageSharp !== null) {
  //   srx = {
  //     src: srx.childImageSharp.fixed.srcWebp,
  //     srcSet: srx.childImageSharp.fixed.srcSetWebp,
  //   };
  // } else {
  //   srx = { src: srx.publicURL, srcSet: null };
  // }
  return (
    <section
      className="bg-gradient-accent"
      id="blog-first"
      style={{
        textDecoration: "none",
        paddingTop: "2em",
        paddingBottom: "2em",
      }}
    >
      <div className="sm:container blog-content">
        {/* <Link
            className="blog-list block-1-2 block-w-full"
            style={{ marginTop: "0rem" }}
            to={`/blog/${item.relativeDirectory}`}
          > */}
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <div className>
            <img
              alt="Latest Blog"
              src={srx.src}
              srcSet={srx.srcSet}
              style={{ width: "70%", height: "auto" }}
            />
          </div>
          <div className="text-md-right">
            <h1
              className="entry-title text-white text-decoration-none"
              style={{ textDecoration: "none" }}
            >
              {item.frontmatter.title}
            </h1>
            <div
              className="entry-content text-white text-decoration-none"
              style={{ textDecoration: "none" }}
            >
              <p>{item.frontmatter.description}</p>
            </div>
            <Link
              className="btn btn-outline-white btn-outline-fill-white "
              to={`/blog/${item.relativeDirectory}`}
            >
              Read More
            </Link>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </section>
  );
};

export default LatestBlogItem;
