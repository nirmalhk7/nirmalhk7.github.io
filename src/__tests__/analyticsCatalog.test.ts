import fs from 'fs';
import path from 'path';
import {blogIds,projectIds} from '@/util/analyticsCatalog';

test.each([['blog',blogIds],['projects',projectIds]] as const)('tracking catalog covers published %s content', (directory,ids)=>{
  const published=fs.readdirSync(path.join(process.cwd(),'content',directory)).filter(file=>file.endsWith('.md')).map(file=>file.slice(0,-3)).sort();
  expect([...ids].sort()).toEqual(published);
});
