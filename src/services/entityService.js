const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");
const { groupBy }= require("lodash");

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
}