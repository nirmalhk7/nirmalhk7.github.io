import React from "react";

export const CategoryList = ({ categories }: { categories: string[] }) => (
  categories.map(({ category, index }: { category: string, index: number}) => (
    <React.Fragment key={index}>
      <a href={`/blog#${category}`}>{category}</a>
      {categories.length !== index + 1 ? ", " : null}
    </React.Fragment>
  ))
);
