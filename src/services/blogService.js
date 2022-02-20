import update from "lodash/update";
import { EntityService } from "./entityService";

/* eslint-disable sonarjs/no-duplicate-string */
const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");

export class BlogsService extends EntityService {
  _result;

  constructor() {
    super();
    this._directory = `content/blog`;
  }

  _getFileMetadata = () => {
    return fs.readdirSync(this._directory).map((filepath) => {
      filepath = `${this._directory}/${filepath}/index.md`;
      const { mtimeMs, atimeMs, ctimeMs, birthtimeMs } = fs.statSync(filepath);
      return {
        birthTime: birthtimeMs,
        modifiedTime: Math.max([mtimeMs, atimeMs, ctimeMs]),
        info: matter(fs.readFileSync(filepath, "utf-8")),
      };
    });
  };

  _postCleanup =()=>{
    this._result.map(e=>update(e,"frontmatter.img",(element)=>`/images/blog${element}`))
    
    console.log(this._result)
    return this._result;
  }

  brief = (includeDraft=false) => {
    this._result = this._getFileMetadata().map(
      ({ info, birthTime, modifiedTime }, index) => {
        const { excerpt, data } = info;
        return  {
            excerpt,
            frontmatter: {...data, birthTime, modifiedTime},
            index,
          }
        ;
      }
    );
    return this._output("date");
  };


  detailed = () => {
    this._result = this._getFileMetadata().map(
      async ({ birthTime, modifiedTime, info }, index) => {
        const { excerpt, data } = info;
        let content = info.content;
        const commonReturn = {
          birthTime,
          modifiedTime,
          excerpt,
          frontmatter: data,
          index,
        };
        if (data.githubPublicUrl) {
          let res = await fetch(`${data.githubPublicUrl}/master/README.md`);
          res = await res.text();
          content = matter(await res.text()).content;
        }
        return {
          ...commonReturn,
          content,
        };
      }
    );
    return this._output();
  };
}

export const fetchBlogs = (preview = false) => {
  const blogs = fs.readdirSync("content/blog");
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
