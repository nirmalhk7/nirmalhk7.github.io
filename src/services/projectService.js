/* eslint-disable sonarjs/no-duplicate-string */
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { EntityService } from './entityService';

const fs = require("fs");
const matter = require("gray-matter");
const fetch = require("node-fetch");
const { groupBy }= require("lodash");
const readingTime=require("@danieldietrich/reading-time");

export class ProjectsService extends EntityService{

  constructor(){
    super();
    this._directory = `content/projects`;
  }



  
  _output = (sortByKey="modifiedTime", groupByKey=null) => {
    // eslint-disable-next-line no-undef
    this._result= this._result.filter(Boolean);
    if(sortByKey){
      this._result= this._result.sort((first, second) => first[sortByKey] > second[sortByKey]);
    }
    return this._result;
  }

  groupBy = (groupByKey) => {

    this._result= groupBy(this._result,(item)=>item["frontmatter"][groupByKey]);
    return this._result;
  }

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
        const readStats=readingTime(content);
        if(readStats.words>=50){
          return {
            ...commonReturn,
            
            detailedPage: `/project/${data.tags}_${data.title}`
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
