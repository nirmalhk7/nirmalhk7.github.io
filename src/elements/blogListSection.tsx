import { Link } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import React from "react";
import Utils from "./utils";

type blogDetails = {
  relativeDirectory: string,
  childMarkdownRemark: {
    frontmatter: {
      description: string,
      title: string,
      img: ImageDataLike,
      category: string
    }
  }
}

type MasonPanelProps = {
  sitename: string,
  blogItems: blogDetails[]
}

const BlogListSection = ({ blogItems, sitename }: MasonPanelProps) => {
  return (
    <section className="bg-gray">
      <div className=" m-auto">
        <div
          className="has-bottom-sep"
        >
          <div className="text-center">
            <h3 className="text-accent">{sitename}</h3>
            <h1>All Posts</h1>
          </div>
        </div>
        <div>
          <div className="columns-4">
            {blogItems.map((element, index) => {
              return (
                <div className="break-inside-avoid-column" key={index}>
                  <div className=" overflow-hidden relative hover:opacity-100 hover:visible">
                    <Link
                      title={Utils.getFrontmatter(element).description}
                      to={`/blog/${element.relativeDirectory}`}
                    >
                      <GatsbyImage
                        alt={Utils.getFrontmatter(element).title}
                        image={getImage(Utils.getFrontmatter(element).img)}
                      />
                      <div className="py-2 px-12 bottom-12	left-0 backdrop-brightness-50 absolute">
                        <h3 className="text-white text-base font-semibold m-0 uppercase font-blocky">
                          {Utils.getFrontmatter(element).title}
                        </h3>
                        <strong className="text-accent uppercase">
                          {Utils.getFrontmatter(element).category}
                        </strong>
                      </div>
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default BlogListSection;
