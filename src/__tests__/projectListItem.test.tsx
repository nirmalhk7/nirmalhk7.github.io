import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectListItem } from "@/components/Project/projectListItem";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <>{children}</>,
}));

const project = {
  slug: "atlas",
  excerpt: "Fast project",
  contentHtml: "<p>Project highlights</p>",
  frontmatter: {
    title: "Atlas",
    tags: ["TypeScript"],
  },
};

describe("ProjectListItem", () => {
  it("shows build-rendered project content when expanded", () => {
    render(
      <ProjectListItem
        project={project as never}
        isExpanded={false}
        onToggle={jest.fn()}
        index={0}
      />
    );

    expect(screen.queryByText("Project highlights")).not.toBeInTheDocument();

    render(
      <ProjectListItem
        project={project as never}
        isExpanded
        onToggle={jest.fn()}
        index={0}
      />
    );

    expect(screen.getByText("Project highlights")).toBeInTheDocument();
  });

  it("keeps project toggle clickable", () => {
    const onToggle = jest.fn();
    render(
      <ProjectListItem
        project={project as never}
        isExpanded={false}
        onToggle={onToggle}
        index={0}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /atlas/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
