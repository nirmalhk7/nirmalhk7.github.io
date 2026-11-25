import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const trace = resolve(root, ".next/server/pages/api/rss.js.nft.json");
const { files } = JSON.parse(readFileSync(trace, "utf8"));
const applicationFiles = files
  .map((file) => relative(root, resolve(dirname(trace), file)))
  .filter((file) => !file.startsWith(`.next${sep}`) && !file.startsWith(`node_modules${sep}`))
  .sort();
const blogFiles = readdirSync(resolve(root, "content/blog"), { withFileTypes: true })
  .filter((file) => file.isFile() && file.name.endsWith(".md"))
  .map((file) => ["content", "blog", file.name].join(sep));

assert.deepEqual(applicationFiles, [...blogFiles, "package.json"].sort(),
  "The RSS function trace must include every blog Markdown file and no unrelated application files");
console.log(`Verified ${blogFiles.length} blog Markdown files in the RSS function trace.`);
