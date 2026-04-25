import fs from 'fs';
import yaml from 'js-yaml';

export default function loadYaml<T = unknown>(filePath: string): T {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as T;
}