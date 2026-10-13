import React from "react";
import { BlogMiniInterface } from "@/interfaces/blog";
import { trackClick, trackSelectContent } from "@/util/analytics";
import { EditorialRow, PageSection } from "@/components/Site/Editorial";

const BlogListSection = ({ blogItems }: { blogItems: BlogMiniInterface[] }) => (
  <PageSection
    id="blog-list"
    eyebrow="The Blue Green Manual"
    title="Notes from the work."
    description="Architecture, GitOps, homelabs, and other systems worth explaining."
  >
    <div>
      {blogItems.map((blog, index) => (
        <EditorialRow
          key={blog.slug}
          index={index}
          eyebrow={blog.frontmatter?.category?.join(" / ")}
          title={blog.frontmatter?.title || "Article"}
          description={blog.excerpt || blog.frontmatter?.description || ""}
          meta={blog.frontmatter?.date}
          image={blog.frontmatter?.img}
          imageAlt={blog.frontmatter?.title || "Article cover"}
          href={`/blog/${blog.slug}`}
          onClick={() => {
            trackSelectContent("blog_post", blog.slug, { item_list_name: "blog_list", item_index: index });
            trackClick(blog.frontmatter?.title || "", "blog_list_link");
          }}
        />
      ))}
    </div>
  </PageSection>
);

export default BlogListSection;
