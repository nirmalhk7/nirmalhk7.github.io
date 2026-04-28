import React from "react";
import Link from "next/link";
import Image from "next/image";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";
import { motion, Variants } from "framer-motion";
import { trackClick } from "@/util/analytics";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const slideUpItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

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
          <motion.div 
            className="py-10 columns-1 tablet:columns-2 laptop:columns-3 desktop:columns-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {blogItems.map((element, index) => {
              return (
                <motion.div variants={slideUpItem} className="break-inside-avoid-column mb-8" key={index}>
                  <div className="overflow-hidden relative rounded-3xl group shadow-md hover:shadow-2xl transition-all duration-500 bg-black min-h-[250px] flex flex-col justify-end">
                    <Image
                      src={element.frontmatter?.img || ""}
                      fill
                      alt={element.frontmatter?.title || "Blog image"}
                      className="brightness-75 group-hover:brightness-50 group-hover:scale-105 transition duration-700 object-cover"
                    />
                    <Link
                      title={element.excerpt ?? "The Blue Green Manual"}
                      href={`/blog/${element.slug}`}
                      className="absolute inset-0 z-10"
                      onClick={() => trackClick(element.frontmatter?.title || "", "blog_list_link")}
                    >
                      <span className="sr-only">Read {element.frontmatter?.title}</span>
                    </Link>
                    <div className="p-10 z-20 relative w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pointer-events-none">
                      <div className="space-y-3">
                        <strong className="text-accent uppercase font-blocky text-sm tracking-widest block font-bold">
                          {element.frontmatter?.category}
                        </strong>
                        <h4 className="text-white text-3xl m-0 font-bold leading-tight">
                          {element.frontmatter?.title}
                        </h4>
                        <div className="flex justify-between items-center text-gray-400 uppercase font-blocky text-xs tracking-tighter pt-4 border-t border-white/10 mt-6">
                          <span>{element.frontmatter?.date}</span>
                          <span className="text-accent font-bold group-hover:translate-x-1 transition-transform">READ MORE →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </WebSection>
  );
};
export default BlogListSection;
