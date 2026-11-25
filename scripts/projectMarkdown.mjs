import matter from "gray-matter";

const isString = (value) => typeof value === "string" && value.trim().length > 0;

const asString = (value, fallback = "") => (isString(value) ? value.trim() : fallback);

const asBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }

  return fallback;
};

const asStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isString).map((item) => item.trim());
};

const shouldIncludeRepo = (topics) => !asStringArray(topics).includes("nirmalhk7");

const cleanExcerptText = (value) =>
  value
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const extractExcerpt = (content) => {
  if (!isString(content)) {
    return "";
  }

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    if (/^#{1,6}\s+.+$/.test(paragraph) && !paragraph.includes("\n")) {
      continue;
    }

    const cleaned = cleanExcerptText(paragraph);
    if (cleaned) {
      return cleaned;
    }
  }

  return "";
};

const resolveProjectFrontmatter = (repo, readmeFrontmatter, topics) => {
  const title = asString(readmeFrontmatter.title, repo.name);
  const summary = asString(readmeFrontmatter.summary);
  const special = asBoolean(readmeFrontmatter.special, false);
  const url = asString(readmeFrontmatter.url);
  const homepage = asString(readmeFrontmatter.homepage);

  const frontmatter = {
    title,
    tags: asStringArray(topics),
    special,
    source: "github",
  };

  if (summary) {
    frontmatter.summary = summary;
  }

  if (url) {
    frontmatter.url = url;
  } else if (homepage) {
    frontmatter.homepage = homepage;
  } else if (isString(repo.homepage)) {
    frontmatter.homepage = repo.homepage.trim();
  } else {
    frontmatter.url = repo.html_url;
  }

  return frontmatter;
};

const buildProjectMarkdown = (repo, readmeFrontmatter, readmeBody, topics) => {
  const frontmatter = resolveProjectFrontmatter(repo, readmeFrontmatter, topics);
  const body = isString(readmeBody) && readmeBody.trim().length > 0
    ? readmeBody.trim()
    : (isString(repo.description) ? repo.description.trim() : "");

  const markdown = matter.stringify(body, frontmatter).trimEnd() + "\n";

  return {
    fileName: `${repo.name}.md`,
    frontmatter,
    body,
    markdown,
    excerpt: extractExcerpt(body),
  };
};

export { buildProjectMarkdown, extractExcerpt, resolveProjectFrontmatter, shouldIncludeRepo };
