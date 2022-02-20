const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");
const { groupBy, sortBy, orderBy }= require("lodash");

export class EntityService {
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

      _postCleanup=()=>{
        return this._result;
      }

      _output = (sortByKey = "modifiedTime") => {
        // eslint-disable-next-line no-undef
        this._result = this._result.filter(Boolean);
        if (sortByKey) {
          this._result = orderBy(this._result,(e)=>e.frontmatter[sortByKey],"desc");
        }
        return  this._postCleanup();
      }

      groupBy = (groupByKey) => {
        this._result = groupBy(this._result, (item) => item["frontmatter"][groupByKey]);
        return this._result;
      }
}