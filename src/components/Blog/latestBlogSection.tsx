// import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";

const LatestBlogSection = ({
  frontmatter,
  excerpt,
  slug
}: BlogMiniInterface) => {
  return (
    <WebSection
      className="bg-gradient-to-r from-accent to-accentLight not-underline pt-8 pb-8"
      id="blog-first"
    >
      <div className="container mx-auto">
        <div className="grid laptop:grid-cols-2 tablet:grid-cols-2 mobile-l:grid-cols-1">
          <div className="py-10">
            <Image
              src={frontmatter?.img}
              width={400}
              height={400}
              alt={frontmatter.title}
            />
          </div>
          <div className="laptop:text-right tablet:text-right relative text-white py-10">
            <div>
              <h3 className="text-white">Latest Article</h3>
              <h1 className="font-bold leading-snug mt-20 font-heading">
                {frontmatter.title}
              </h1>
              <div className="entry-content no-underline mb-10 not-underline">
                <p>{excerpt}</p>
              </div>
              <Link
                className="button button-white inline-block"
                href={`/blog/${slug}`}
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </WebSection>
  );
};

export default LatestBlogSection;
