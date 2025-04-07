import { NextApiRequest, NextApiResponse } from "next";
import { sortBy } from "lodash";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import RSS from "rss";
import dayjs from "dayjs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Load and sort blog posts
  const blogDetail = sortBy(
    loadMarkdownFiles("content/blog", {
      getContent: true,
      getExcerpt: true,
    }),
    (o) => o.frontmatter.date
  ).reverse();

  const blogDescription = `Named after the deployment process, I'm in hunt for learning all processes that make production software production grade. Good software products today cannot have downtimes, and I'm all about finding those concepts which helps engineers make resilient software.`;

  // Initialize RSS feed
  const feed = new RSS({
    title: "The Blue Green Manual",
    description: blogDescription,
    feed_url: "https://nirmalhk7.com/api/rss",
    site_url: "https://nirmalhk7.com/blog",
    pubDate: new Date(),
    language: "en",
    categories: [],
    copyright: `Copyright © ${new Date().getFullYear()} Nirmal Khedkar. All rights reserved.`,
    managingEditor: "Nirmal Khedkar",
    webMaster: "Nirmal Khedkar",
    custom_elements: [
      { resume: "https://nirmalhk7.com/resume?utm_source=rss&utm_medium=web" },
    ],
  });

  // Add items to the RSS feed
  blogDetail.forEach((post) => {
    feed.item({
      title: post.frontmatter.title,
      description: post.frontmatter.description || "",
      url: `https://nirmalhk7.com/blog/${post.slug}?utm_source=rss`,
      date: dayjs(post.frontmatter.date).format("DD MMM YYYY"),
      categories: [post.frontmatter.category],
      author: "Nirmal Khedkar"
    });
  });

  // Set headers and send the RSS feed
  res.setHeader("Content-Type", "application/rss+xml");
  res.status(200).send(feed.xml({ indent: true }));
}
