import { execFileSync } from "node:child_process";
import path from "node:path";

// Exercise the real ESM Markdown parser in Node, outside Jest's CommonJS loader.
const renderProjectMarkdown = (markdown: string | null) => execFileSync(process.execPath, ["-e", `
  const fs = require('node:fs');
  const ts = require('typescript');
  require.extensions['.tsx'] = (module, filename) => {
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true }
    }).outputText;
    module._compile(source, filename);
  };
  const { renderProjectMarkdown } = require(process.argv[1]);
  process.stdout.write(renderProjectMarkdown(JSON.parse(process.argv[2])));
`, path.join(process.cwd(), "src/util/renderMarkdown.tsx"), JSON.stringify(markdown)], { encoding: "utf8", cwd: process.cwd() });

describe("renderProjectMarkdown", () => {
  it("renders project prose without competing with the page heading", () => {
    const html = renderProjectMarkdown("# Atlas\n\nA **fast** project.");
    expect(html).toContain("<h2>Atlas</h2>");
    expect(html).toContain("<p>A <strong>fast</strong> project.</p>");
    expect(html).not.toContain("<h1>");
  });

  it("downlevels nested headings and caps the deepest level at h6", () => {
    const html = renderProjectMarkdown("# One\n\n## Two\n\n### Three\n\n#### Four\n\n##### Five\n\n###### Six");
    for (const [tag, text] of [["h2", "One"], ["h3", "Two"], ["h4", "Three"], ["h5", "Four"], ["h6", "Five"], ["h6", "Six"]]) {
      expect(html).toContain(`<${tag}>${text}</${tag}>`);
    }
  });

  it("returns empty HTML when a project has no body content", () => {
    expect(renderProjectMarkdown(null)).toBe("");
  });
});
