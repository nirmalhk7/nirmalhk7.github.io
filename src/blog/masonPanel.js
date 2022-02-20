import Image from "next/image";
import Link from "../components/link";
const MasonPanel = ({ sitename, blogItems }) => {
    return (
      <section className="bg-gray">
        <div className="">
          <div className="blog-content m-auto" style={{ maxWidth: "1500px" }}>
            <div
              className="section_intro has-bottom-sep"
              style={{ paddingTop: "5em" }}
            >
              <div className="text-center">
                <h3>Eclipse</h3>
                <h1>All Posts</h1>
              </div>
            </div>
            <div className="blog-list block-1-2 block-w-full">
              <div className="row">
                <div className="columns-4">
                  {blogItems.map((element, index) => {
                    let srx = element.frontmatter.img;
                    // if (srx.childImageSharp !== null) {
                    //   srx = {
                    //     src: srx.childImageSharp.fixed.srcWebp,
                    //     srcSet: srx.childImageSharp.fixed.srcSetWebp,
                    //   };
                    // } else {
                    //   srx = { src: srx.publicURL, srcSet: null };
                    // }
  
                    return (
                      <div className="break-inside-avoid-column masonry__brick" key={index}>
                        <div className="overflow-hidden relative hover:opacity-100 hover:visible">
                          <div className="item-folio__thumb">
                            <Link
                              className=""
                              title={element.frontmatter.description}
                              to={`/blog/${element.relativeDirectory}`}
                            >
                              <Image
                                alt={element.frontmatter.title}
                                layout="fill"
                                src={srx}
                              />
                            </Link>
                          </div>
                          <div className="bottom-12	left-0 absolute">
                            <h3 className="text-white text-base font-semibold m-0 uppercase font-blocky">
                              {element.frontmatter.title}
                            </h3>
                              <strong className="text-accent">
                                {element.frontmatter.category}
                              </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  export default MasonPanel