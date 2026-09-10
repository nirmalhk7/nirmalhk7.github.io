const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const matter = require("gray-matter");

const PROJECTS_JSON_PATH = path.join(
  process.cwd(),
  ".next",
  "server",
  "pages",
  "en-US",
  "projects.json"
);

const main = async () => {
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    throw new Error("Missing static project data. Run next build before checking project Markdown.");
  }

  const { default: ReactMarkdown } = await import("react-markdown");
  const { pageProps } = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, "utf8"));

  for (const project of pageProps.projects) {
    const sourcePath = path.join(process.cwd(), "content", "projects", `${project.slug}.md`);
    const markdown = matter(fs.readFileSync(sourcePath, "utf8")).content;
    const expectedHtml = renderToStaticMarkup(React.createElement(ReactMarkdown, null, markdown));

    if (project.contentHtml !== expectedHtml) {
      throw new Error(`Pre-rendered Markdown differs from ReactMarkdown output for ${project.slug}.`);
    }
  }

  console.log(`Verified build-rendered Markdown for ${pageProps.projects.length} projects.`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
