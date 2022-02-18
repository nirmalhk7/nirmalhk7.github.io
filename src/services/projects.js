/* eslint-disable sonarjs/no-duplicate-string */
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");

export class ProjectsService {
  _result;
  _directory = `content/projects`;

  _getFileMetadata = () => {
    return fs.readdirSync(this._directory).map((filepath) => {
      filepath = `${this._directory}/${filepath}`;
      const { mtimeMs, atimeMs, ctimeMs, birthtimeMs } = fs.statSync(filepath);
      return {
        birthTime: birthtimeMs,
        modifiedTime: Math.max([mtimeMs, atimeMs, ctimeMs]),
        info: matter(fs.readFileSync(filepath, "utf-8")),
      };
    });
  };

  _output = async (flags) => {
    // eslint-disable-next-line no-undef
    return (await Promise.all(this._result))
      .filter(Boolean)
      .sort((first, second) => first.modifiedTime > second.modifiedTime);
  };

  brief = async () => {
    this._result = this._getFileMetadata().map(async ({ modifiedTime, birthTime, info }, index) => {
      const { excerpt, data } = info;

       ////// const content = String(await remark().use(remarkgfm).process(info.content));
      return data.special && {
        birthTime,
        modifiedTime,
        excerpt,
        frontmatter: data,
        index,
      };
    });
    return this._output();
  };

  detailed = () => {
    this._result = this._getFileMetadata().map(
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
        // Get length of content, and make a new page accordingly.
        return {
          ...commonReturn,
          content,
        };
      }
    );
    return this._output();
  };
}
