import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";



const BlogListSection = ({blogItems}: {blogItems: BlogMiniInterface[]}) => {
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
              <h1>All Posts</h1>
            </div>
          </div>
          <div>
            <div className="columns-4">
              {blogItems && blogItems.map((element, index) => {
                return (
                  <div className="break-inside-avoid-column" key={index}>
                    <div className=" overflow-hidden relative hover:opacity-100 hover:visible">
                      <div className=" before:bg-black before:z-10">
                        <Link
                          title={element.excerpt ?? "The Blue Green Manual"}
                          href={`/blog/${element.slug}`}
                        >
                          <Image
                            src={`/blog/${element.frontmatter?.img}`}
                            width={500}
                            height={300}
                            alt="image"
                          />
                        </Link>
                      </div>
                      <div className="pt-0 pb-0 pl-12 pr-12 z-10 bottom-12	left-0 absolute">
                        <h3 className="text-white text-2xl font-semibold m-0 uppercase font-blocky">
                          {element.frontmatter?.title}
                        </h3>
                        <strong className="text-accent">
                          {element.frontmatter?.category}
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
    </WebSection>
  );
};
export default BlogListSection;
