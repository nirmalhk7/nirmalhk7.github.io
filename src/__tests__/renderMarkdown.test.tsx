import React from "react";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <article data-markdown="true">{children}</article>,
}));

import { renderProjectMarkdown } from "@/util/renderMarkdown";

describe("renderProjectMarkdown", () => {
  it("renders project markdown to static HTML at build time", () => {
    expect(renderProjectMarkdown("# Atlas\n\nA **fast** project.")).toBe(
      '<article data-markdown="true"># Atlas\n\nA **fast** project.</article>'
    );
  });

  it("returns empty HTML when a project has no body content", () => {
    expect(renderProjectMarkdown(null)).toBe("");
  });
});
