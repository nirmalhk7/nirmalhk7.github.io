// import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";
import { trackClick } from "@/util/analytics";

const LatestBlogSection = ({
  frontmatter,
  excerpt,
  slug
}: BlogMiniInterface) => {
  return (
    <WebSection
      className="bg-gradient-to-r from-accent to-accentLight not-underline pt-8 pb-8 group"
      id="blog-first"
    >
      <Link 
        href={`/blog/${slug}`}
        className="block no-underline"
        onClick={() => trackClick(frontmatter?.title || "", "latest_blog_read_more")}
      >
        <div className="container mx-auto">
          <div className="grid laptop:grid-cols-2 tablet:grid-cols-2 mobile-l:grid-cols-1">
            <div className="py-10">
              <Image
                src={frontmatter?.img || ""}
                width={400}
                height={400}
                alt={frontmatter?.title || "Blog Image"}
              />
            </div>
            <div className="laptop:text-right tablet:text-right relative text-white py-10">
              <div>
                <h3 className="text-white">Latest Article</h3>
                <h1 className="font-bold leading-snug mt-20 font-heading text-7xl">
                  {frontmatter?.title || ""}
                </h1>
                <div className="entry-content no-underline mb-10 not-underline">
                  <p className="text-3xl">{excerpt}</p>
                </div>
                <div
                  className="button button-white inline-block"
                >
                  Read More
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </WebSection>
  );
};

export default LatestBlogSection;
