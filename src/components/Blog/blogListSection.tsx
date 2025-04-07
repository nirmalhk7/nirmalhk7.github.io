import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";

const BlogListSection = ({ blogItems }: { blogItems: BlogMiniInterface[] }) => {
  return (
    <WebSection
      className="bg-gray-100 selection:bg-accent selection:text-white"
      id="blog-list"
    >
      <div>
        <div className=" m-auto" style={{ maxWidth: "1500px" }}>
          <div className="section_intro has-bottom-sep pt-20">
            <div className="text-center">
              <h3>The Blue Green Manual</h3>
              <h1>All Articles</h1>
            </div>
          </div>
          <div className="py-5 columns-4 gap-0">
            {blogItems.map((element, index) => {
              return (
                <div className="break-inside-avoid-column" key={index}>
                  <div className=" overflow-hidden relative hover:opacity-100 hover:visible">
                    <Link
                      title={element.excerpt ?? "The Blue Green Manual"}
                      href={`/blog/${element.slug}`}
                    >
                      <Image
                        src={element.frontmatter.img}
                        width={500}
                        height={600}
                        alt="image"
                        className="brightness-50 hover:brightness-25 hover:scale-105 transition duration-300"
                      />
                    </Link>
                    <div className="px-8 z-20 bottom-8	left-0 absolute w-full">
                      <div className="grid grid-flow-row-dense grid-cols-2">
                        <h4 className="text-white text-2xl m-0 font-bold col-span-2">
                          {element.frontmatter?.title}
                        </h4>
                        <strong className="text-accent uppercase font-blocky">
                          {element.frontmatter?.category}
                        </strong>
                        <div className="text-gray-300 uppercase font-blocky text-end">
                          {element.frontmatter?.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WebSection>
  );
};
export default BlogListSection;
