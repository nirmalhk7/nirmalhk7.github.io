import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { BlogFrontmatterInterface, BlogInterface } from "@/interfaces/blog";
import { ArticleJsonLd } from "next-seo";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { loadMarkdownFile, loadMarkdownFiles } from "@/util/loadMarkdown";
import { DefaultPageProps } from "../_app";
import { PageHero, PageSection, editorialStyles as styles } from "@/components/Site/Editorial";
import Image from "next/image";
import BlogShare from "@/components/Blog/BlogShare";
import { openGraphImage } from "@/util/openGraph";
import { markdownHeadings } from "@/util/markdownHeadings";

const BLOG_SEO_TITLES: Record<string, string> = {
  homelab_architect: "Planning a Reliable Homelab Architecture",
  homelab_hypervisors: "Proxmox and Hypervisors for Homelabs",
};

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false }
);

interface BlogTemplatePageProps extends DefaultPageProps {
  current: BlogInterface;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = loadMarkdownFiles("content/blog", {
    getContent: false,
    getExcerpt: false,
  });

  const paths = blogs.map((file) => {
    return {
      params: {
        blogId: file.slug,
      },
    };
  });

  return {
    paths,
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps<BlogTemplatePageProps> = async (
  context
) => {
  const blogId = context.params?.blogId as string;
  const currentBlog = loadMarkdownFile<BlogFrontmatterInterface>(
    "content/blog/" + blogId + ".md",
    blogId,
    { getContent: true, getExcerpt: false }
  );

  return {
    props: {
      current: currentBlog,
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: BLOG_SEO_TITLES[blogId] || currentBlog.frontmatter.title,
          description: currentBlog.frontmatter.description,
          canonical: `https://nirmalhk7.com/blog/${blogId}`,
          openGraph: {
            type: "article",
            url: `https://nirmalhk7.com/blog/${blogId}`,
            article: {
              publishedTime: currentBlog.frontmatter.date,
              authors: ["Nirmal Khedkar"],
              tags: currentBlog.frontmatter.tags,
            },
            images: [openGraphImage(BLOG_SEO_TITLES[blogId] || currentBlog.frontmatter.title, currentBlog.frontmatter.description || "Notes from the work. The Blue Green Manual.", "article")],
          },
        },
      },
    },
  };
};

const BlogTemplate = ({
  current,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nirmalhk7.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://nirmalhk7.com/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": current.frontmatter?.title || "Post",
        "item": `https://nirmalhk7.com/blog/${current.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArticleJsonLd
        useAppDir={false}
        url={`https://nirmalhk7.com/blog/${current.slug}`}
        title={current.frontmatter?.title || ""}
        images={[`https://nirmalhk7.com${current.frontmatter?.img}`]}
        datePublished={current.frontmatter?.date || ""}
        authorName="Nirmal Khedkar"
        description={current.frontmatter?.description || ""}
      />
      <main className={styles.page}>
        <PageHero
          variant="article"
          eyebrow="The Blue Green Manual / Article"
          title={current.frontmatter?.title || "Article"}
          description={current.frontmatter?.description}
          image={current.frontmatter?.img}
          imageAlt={`Cover image for ${current.frontmatter?.title || "this article"}`}
          compact
        >
          <Link href="/blog">← All writing</Link>
        </PageHero>
        <PageSection>
          <div className={styles.articleMeta}>
            <span>{current.frontmatter?.date}</span>
            <span>{current.frontmatter?.category?.join(" / ")}</span>
            <span>By Nirmal Khedkar</span>
          </div>
          <ReactMarkdown
            className={styles.articleBody}
            components={{
              ...markdownHeadings,
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    // eslint-disable-next-line react/no-children-prop
                    children={String(children).replace(/\n$/, "")}
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : <code {...props} className={className}>{children}</code>;
              },
              img({ src, alt }) {
                return (
                  <span className={styles.articleImage}>
                    <Image src={src || ""} alt={alt || "Article image"} fill sizes="(max-width: 767px) calc(100vw - 44px), (max-width: 1612px) 84vw, 1360px" />
                  </span>
                );
              },
            }}
          >
            {current.content || ""}
          </ReactMarkdown>
          <div className={styles.articleFooter}>
            <p>Share this article</p>
            <BlogShare slug={current.slug} title={current.frontmatter?.title || "Article"} />
            <ul className={styles.tagList} aria-label="Article tags">
              {current.frontmatter?.tags?.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <Link href="/blog" className={styles.textLink}>Read all writing <span aria-hidden="true">↗</span></Link>
          </div>
        </PageSection>
      </main>
    </>
  );
};

export default BlogTemplate;
