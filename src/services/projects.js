/* eslint-disable sonarjs/no-duplicate-string */
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");
const { groupBy }= require("lodash");
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

  _output = async (sortByKey="modifiedTime", groupByKey=null) => {
    // eslint-disable-next-line no-undef
    this._result= (await Promise.all(this._result))
      .filter(Boolean);
    if(sortByKey){
      this._result= this._result.sort((first, second) => first[sortByKey] > second[sortByKey]);
    }
    if(groupBy){
      this._result= groupBy(this._result,(item)=>item[groupByKey]);
    }
    return this._result;
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

  detailed = (sortByKey="modifiedTime", groupByKey=null) => {
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
