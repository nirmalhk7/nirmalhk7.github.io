import { data } from "jquery";

const fs = require("fs");
const matter = require("gray-matter");
const fetch = require('node-fetch');

export const projects = async (preview = false) => {
  const projects = fs.readdirSync("content/projects");
  
  // eslint-disable-next-line no-undef
  return (await Promise.all(projects
    .map( (element, index) => {
      // const readFile = 
      const filepath = `content/projects/${element}`;
      return {
        metadata: fs.statSync(
          filepath
        ), info: matter(fs.readFileSync(filepath, "utf-8"))
      };
    })
    .map(async (abc, index) => {
      const { metadata, info }= abc;
      const { mtimeMs, atimeMs, ctimeMs, birthtimeMs } = metadata;
      const { content, excerpt, data } = info;
      const commonReturn = {
        birthTime: birthtimeMs,
        modifiedTime: Math.max([mtimeMs, atimeMs, ctimeMs]),
        excerpt,
        frontmatter: data,
        index
      };
      if (preview) {
        return data.special && commonReturn;
      }
      if (data.githubPublicUrl) {
        let res = await fetch(`${data.githubPublicUrl}/master/README.md`);
        res = await res.text();
        return {
          ...commonReturn,
          content: matter(res).content
        };
      }
      return {
        ...commonReturn,
        content
      };

    })))
    .filter(Boolean)
    .sort((first, second) => first.modifiedTime > second.modifiedTime);
};

export const fetchBlogs = (preview = false) => {
  const blogs = fs
    .readdirSync("content/blog")
    .filter((de) => de.isDirectory())
    .map((de) => de.name);
  return blogs
    .map((element, index) => {
      const readFile = fs.readFileSync(
        `content/projects/${element}/index.md`,
        "utf-8"
      );
      const { birthtimeMs, mtimeMs, ctimeMs, atimeMs } = fs.statSync(
        `content/projects/${element}`
      );
      const { data, content, excerpt } = matter(readFile);
      const commonReturn = {
        index,
        frontmatter: data,
        excerpt,
        birthTime: birthtimeMs,
        modifiedTime: Math.max([mtimeMs, ctimeMs, atimeMs]),
      };
      if (preview) {
        if (data.special) {
          return commonReturn;
        }
      } else return { content, ...commonReturn };
    })
    .filter(Boolean)
    .sort((first, second) => first.modifiedTime > second.modifiedTime);
};
