const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const OWNER = "nirmalhk7";
const API_BASE = "https://api.github.com";
const CONTENT_DIR = path.join(__dirname, "../content/projects");
const SYNC_MANIFEST_PATH = path.join(CONTENT_DIR, ".github-sync.json");
const ENV_FILES = [
  path.join(__dirname, "../.env.local"),
  path.join(__dirname, "../.env"),
];

const loadLocalEnv = () => {
  for (const envFile of ENV_FILES) {
    if (!fs.existsSync(envFile)) {
      continue;
    }

    const parsed = fs.readFileSync(envFile, "utf8").split(/\r?\n/);

    for (const line of parsed) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).replace(/^export\s+/, "").trim();
      if (!key || process.env[key]) {
        continue;
      }

      let value = trimmed.slice(equalsIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  }
};

const defaultHeaders = (token) => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nirmalhk7.github.io-project-sync",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

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

const fetchMaybeJson = async (url, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = new Error(`GitHub API request failed for ${url}: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

const readNextPageUrl = (linkHeader) => {
  if (!linkHeader) {
    return null;
  }

  const nextLink = linkHeader
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.includes('rel="next"'));

  if (!nextLink) {
    return null;
  }

  const match = nextLink.match(/<([^>]+)>/);
  return match ? match[1] : null;
};

const listPublicRepos = async (token) => {
  const repos = [];
  let nextUrl = `${API_BASE}/users/${OWNER}/repos?per_page=100&type=public&sort=updated`;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: defaultHeaders(token),
    });

    if (!response.ok) {
      const error = new Error(`GitHub repo listing failed: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const pageRepos = await response.json();
    repos.push(...pageRepos.filter((repo) => !repo.fork));
    nextUrl = readNextPageUrl(response.headers.get("link"));
  }

  return repos;
};

const fetchReadme = async (owner, repoName, token) => {
  const payload = await fetchMaybeJson(
    `${API_BASE}/repos/${owner}/${repoName}/readme`,
    token
  );

  if (!payload) {
    return { frontmatter: {}, body: "" };
  }

  const raw = Buffer.from(payload.content || "", "base64").toString("utf8");
  const parsed = matter(raw);

  return {
    frontmatter: parsed.data || {},
    body: parsed.content || "",
  };
};

const fetchTopics = async (owner, repoName, token) => {
  const payload = await fetchMaybeJson(
    `${API_BASE}/repos/${owner}/${repoName}/topics`,
    token
  );

  return payload?.names || [];
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

const removePreviouslyGeneratedProjects = () => {
  if (!fs.existsSync(CONTENT_DIR)) {
    return;
  }

  for (const fileName of fs.readdirSync(CONTENT_DIR)) {
    if (!fileName.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(CONTENT_DIR, fileName);
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    if (parsed.data?.source === "github") {
      fs.unlinkSync(filePath);
    }
  }

  if (fs.existsSync(SYNC_MANIFEST_PATH)) {
    fs.unlinkSync(SYNC_MANIFEST_PATH);
  }
};

const writeProjectFile = (project) => {
  const filePath = path.join(CONTENT_DIR, project.fileName);
  fs.writeFileSync(filePath, project.markdown, "utf8");
};

const syncGithubProjects = async () => {
  loadLocalEnv();
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_READ_TOKEN ||
    "";

  try {
    if (!token) {
      console.log("GitHub project sync skipped; no token configured.");
      return { ok: true, count: 0, skipped: true };
    }

    const repos = await listPublicRepos(token);
    const generated = [];

    for (const repo of repos) {
      const [readme, topics] = await Promise.all([
        fetchReadme(OWNER, repo.name, token),
        fetchTopics(OWNER, repo.name, token),
      ]);

      if (!shouldIncludeRepo(topics)) {
        continue;
      }

      const project = buildProjectMarkdown(repo, readme.frontmatter, readme.body, topics);
      generated.push(project);
    }

    removePreviouslyGeneratedProjects();

    for (const project of generated) {
      writeProjectFile(project);
    }

    const manifest = {
      status: "complete",
      owner: OWNER,
      generatedAt: new Date().toISOString(),
      repoCount: generated.length,
    };

    fs.writeFileSync(SYNC_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    console.log(`Synced ${generated.length} GitHub projects.`);
    return { ok: true, count: generated.length };
  } catch (error) {
    console.error("GitHub project sync failed; keeping existing project markdown files.", error.message || error);
    return { ok: false, count: 0, error };
  }
};

module.exports = {
  syncGithubProjects,
  buildProjectMarkdown,
  resolveProjectFrontmatter,
  extractExcerpt,
  shouldIncludeRepo,
  removePreviouslyGeneratedProjects,
  SYNC_MANIFEST_PATH,
  CONTENT_DIR,
};
