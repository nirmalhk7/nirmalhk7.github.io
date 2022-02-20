/* eslint-disable sonarjs/no-duplicate-string */
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { EntityService } from './entityService';

const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");
const { groupBy } = require("lodash");
const readingTime = require("@danieldietrich/reading-time");

export class ProjectsService extends EntityService {

  constructor() {
    super();
    this._directory = `content/projects`;
  }





  brief = async () => {
    // eslint-disable-next-line no-undef
    this._result = await Promise.all(this._getFileMetadata().map(async ({ modifiedTime, birthTime, info }, index) => {
      const { excerpt, data } = info;
      return data.special && {
        excerpt,
        frontmatter: {...data, birthTime, modifiedTime},
        index,
      };
    }));
    return this._output();
  };

  single = async (filename) => {
    const filepath=`${this._directory}/${filename}.md`;
    try {
      if (fs.existsSync(filepath)) {
        const { mtimeMs, atimeMs, ctimeMs, birthtimeMs } = fs.statSync(filepath);
        const fileInfo =matter(fs.readFileSync(filepath, "utf-8"));
        let content= fileInfo.content;
        const { data, excerpt, language }=fileInfo;

        if (data.githubPublicUrl) {
          const res = await fetch(`${data.githubPublicUrl}/master/README.md`);
          content = matter(await res.text()).content;
        }
        const readStats = readingTime(content);
        return {
          birthTime: birthtimeMs,
          modifiedTime: Math.max([mtimeMs, atimeMs, ctimeMs]),
          excerpt,
          frontmatter: data,
          filename,
          ...readStats
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  detailed = async () => {
    // eslint-disable-next-line no-undef
    this._result = await Promise.all(this._getFileMetadata().map(
      async ({ info, birthTime, modifiedTime }, index) => {
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
          const res = await fetch(`${data.githubPublicUrl}/master/README.md`);
          content = matter(await res.text()).content;
        }
        const readStats = readingTime(content);
        if (readStats.words >= 50) {
          return {
            ...commonReturn,

            detailedPage: `/project/${data.title}`
          };
        }
        // Get length of content, and make a new page accordingly.
        return {
          ...commonReturn,
          ...readStats,
          content,
        };
      }
    ));
    return this._output();
  };
}
