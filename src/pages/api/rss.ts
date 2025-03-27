import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { NextApiRequest, NextApiResponse } from "next";
import RSS from "rss";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const feed = new RSS({
        title: "The Blue Green Manual | RSS Feed",
        description: "RSS feed for The Blue Green Manual - blog by Nirmal Khedkar",
        feed_url: `${req.headers.host}/api/rss`,
        site_url: `${req.headers.host}`,
        language: "en",
    });

    loadMarkdownFiles("content/blog", { getExcerpt: true, getContent: false }).map(
        (blog) => {
            feed.item({
                title: blog.frontmatter.title,
                description: blog.frontmatter.description,
                url: `${req.headers.host}/blog/${blog.slug}`,
                date: blog.frontmatter.date,
            });
        }
    )

    const xml = feed.xml({ indent: true });

    res.setHeader("Content-Type", "application/rss+xml");
    res.status(200).send(xml);
}