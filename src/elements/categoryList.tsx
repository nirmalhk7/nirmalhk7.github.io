import React from "react";

export const CategoryList = ({ categories }: { categories: string[] }) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories.map(({ category, index }: any) => (
    <React.Fragment key={index}>
      <a href={`/blog#${category}`}>{category}</a>
      {categories.length !== index + 1 ? ", " : null}
    </React.Fragment>
  ))
);
