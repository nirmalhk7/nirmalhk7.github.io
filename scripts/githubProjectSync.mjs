import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { loadEnvironmentFiles } from "./projectSyncEnvironment.mjs";
import { buildProjectMarkdown, extractExcerpt, resolveProjectFrontmatter, shouldIncludeRepo } from "./projectMarkdown.mjs";

const OWNER = "nirmalhk7";
const API_BASE = "https://api.github.com";
const CONTENT_DIR = path.join(import.meta.dirname, "../content/projects");
const SYNC_MANIFEST_PATH = path.join(CONTENT_DIR, ".github-sync.json");
const ENV_FILES = [
  path.join(import.meta.dirname, "../.env.local"),
  path.join(import.meta.dirname, "../.env"),
];

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
  loadEnvironmentFiles(ENV_FILES);
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

export {
  syncGithubProjects,
  buildProjectMarkdown,
  resolveProjectFrontmatter,
  extractExcerpt,
  shouldIncludeRepo,
  removePreviouslyGeneratedProjects,
  SYNC_MANIFEST_PATH,
  CONTENT_DIR,
};
