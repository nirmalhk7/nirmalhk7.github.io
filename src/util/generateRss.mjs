import fs from "fs";
import path from "path";
import RSS from "rss";
import { loadMarkdownFiles } from "./loadMarkdown";

const generateRSSFeed = () => {
  const feed = new RSS({
    title: "The Blue Green Manual | RSS Feed",
    description: "RSS feed for The Blue Green Manual - blog by Nirmal Khedkar",
    feed_url: "https://nirmalhk7.github.io/rss.xml",
    site_url: "https://nirmalhk7.github.io",
    language: "en",
  });

  const blogs = loadMarkdownFiles("content/blog", { getExcerpt: true, getContent: false });
  blogs.forEach((blog) => {
    feed.item({
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      url: `https://nirmalhk7.github.io/blog/${blog.slug}`,
      date: blog.frontmatter.date,
    });
  });

  const outputPath = path.join(__dirname, "../../public/rss.xml");
  fs.writeFileSync(outputPath, feed.xml({ indent: true }));
  console.log("RSS feed generated at:", outputPath);
};

generateRSSFeed();