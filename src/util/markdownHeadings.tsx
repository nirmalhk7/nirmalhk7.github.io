import React from "react";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

// Reserve the page title for h1; Markdown keeps its relative hierarchy below it.
export const markdownHeadings = {
  h1: ({ children }: HeadingProps) => <h2>{children}</h2>,
  h2: ({ children }: HeadingProps) => <h3>{children}</h3>,
  h3: ({ children }: HeadingProps) => <h4>{children}</h4>,
  h4: ({ children }: HeadingProps) => <h5>{children}</h5>,
  h5: ({ children }: HeadingProps) => <h6>{children}</h6>,
  h6: ({ children }: HeadingProps) => <h6>{children}</h6>,
};
