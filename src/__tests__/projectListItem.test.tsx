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
  it("shows original notes immediately for selected projects without a second disclosure", () => {
    render(
      <ProjectListItem
        project={{ ...project, slug: "k8-autoscaler", contentHtml: "<p>Original autoscaler implementation notes.</p>" } as never}
        isExpanded
        onToggle={jest.fn()}
        index={0}
      />
    );

    expect(screen.getByText("Original autoscaler implementation notes.")).toBeVisible();
    expect(screen.queryByText("Infrastructure · Capacity planning")).not.toBeInTheDocument();
    expect(screen.queryByText("Original project notes")).not.toBeInTheDocument();
  });

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

test("connects the toggle to its detail panel and hides closing content from assistive technology", () => {
  const { rerender } = render(<ProjectListItem project={project as never} isExpanded onToggle={jest.fn()} index={0} />);
  const toggle = screen.getByRole("button", { name: /Collapse Atlas/ });
  const panel = screen.getByRole("region", { name: /Collapse Atlas/ });
  expect(toggle).toHaveAttribute("aria-controls", panel.id);
  rerender(<ProjectListItem project={project as never} isExpanded={false} onToggle={jest.fn()} index={0} />);
  expect(screen.queryByRole("region")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Expand Atlas/ })).toHaveAttribute("aria-expanded", "false");
});
