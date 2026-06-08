import matter from "gray-matter";
import { buildProjectMarkdown, extractExcerpt, shouldIncludeRepo } from "../../scripts/githubProjectSync";

describe("githubProjectSync", () => {
  it("builds markdown from README frontmatter with topic tags", () => {
    const repo = {
      name: "demo-repo",
      html_url: "https://github.com/nirmalhk7/demo-repo",
      homepage: "https://demo.example.com",
      description: "Demo repository description",
    };

    const readme = matter(`---
title: README Title
special: true
homepage: https://frontmatter.example.com
summary: README summary
---
# Demo Repo

The README body.
`);

    const project = buildProjectMarkdown(repo, readme.data, readme.content, [
      "nextjs",
      "typescript",
    ]);

    expect(project.frontmatter).toMatchObject({
      title: "README Title",
      tags: ["nextjs", "typescript"],
      special: true,
      summary: "README summary",
      homepage: "https://frontmatter.example.com",
      source: "github",
    });
    expect(project.body).toBe("# Demo Repo\n\nThe README body.");
    expect(project.markdown).toContain("title: README Title");
    expect(project.markdown).toContain("source: github");
  });

  it("falls back to repository metadata when README data is missing", () => {
    const repo = {
      name: "fallback-repo",
      html_url: "https://github.com/nirmalhk7/fallback-repo",
      homepage: "",
      description: "Fallback repository description",
    };

    const project = buildProjectMarkdown(repo, {}, "", ["github-actions"]);

    expect(project.frontmatter).toMatchObject({
      title: "fallback-repo",
      tags: ["github-actions"],
      special: false,
      url: "https://github.com/nirmalhk7/fallback-repo",
      source: "github",
    });
    expect(project.body).toBe("Fallback repository description");
  });

  it("extracts an excerpt from the first meaningful paragraph", () => {
    expect(extractExcerpt("# Heading\n\nUseful summary here.")).toBe(
      "Useful summary here."
    );
    expect(extractExcerpt("## Another heading\n\nMore detail follows.")).toBe(
      "More detail follows."
    );
  });

  it("excludes repos tagged with nirmalhk7", () => {
    expect(shouldIncludeRepo(["nirmalhk7", "typescript"])).toBe(false);
    expect(shouldIncludeRepo(["typescript", "nextjs"])).toBe(true);
  });
});
