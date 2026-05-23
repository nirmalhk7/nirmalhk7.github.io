// import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WebSection from "@/elements/WebSection";
import { BlogMiniInterface } from "@/interfaces/blog";
import { trackClick, trackSelectContent } from "@/util/analytics";
import { SectionReveal } from "@/components/UI/SectionReveal";
import { motion, useReducedMotion } from "framer-motion";

const LatestBlogSection = React.forwardRef<HTMLElement, BlogMiniInterface>(({
  frontmatter,
  excerpt,
  slug
}, ref) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <WebSection
      ref={ref}
      className="bg-gradient-to-r from-accent to-accentLight not-underline pt-8 pb-8 group"
      id="blog-first"
    >
      <Link 
        href={`/blog/${slug}`}
        className="block no-underline"
        onClick={() => {
          trackSelectContent("blog_post", slug, {
            item_list_name: "latest_blog",
          });
          trackClick(frontmatter?.title || "", "latest_blog_read_more");
        }}
      >
        <div className="container mx-auto">
          <SectionReveal
            className="grid laptop:grid-cols-2 tablet:grid-cols-2 mobile-l:grid-cols-1"
            y={18}
          >
            <motion.div
              className="py-10"
              whileHover={shouldReduceMotion ? undefined : { rotate: -1.5, scale: 1.025 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative inline-block overflow-hidden rounded-3xl shadow-2xl shadow-black/20">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-gradient-to-tr from-white/0 via-white/35 to-white/0 opacity-0 group-hover:opacity-100"
                  animate={shouldReduceMotion ? undefined : { x: ["-120%", "120%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <Image
                  src={frontmatter?.img || ""}
                  width={400}
                  height={400}
                  alt={frontmatter?.title || "Blog Image"}
                  className="transition duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
            <div className="laptop:text-right tablet:text-right relative text-white py-10">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, x: 28 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
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
              </motion.div>
            </div>
          </SectionReveal>
        </div>
      </Link>
    </WebSection>
  );
});

LatestBlogSection.displayName = "LatestBlogSection";

export default LatestBlogSection;
