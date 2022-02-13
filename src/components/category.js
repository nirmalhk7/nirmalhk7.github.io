import React from "react";

export const CategoryList = ({ categories }) => (
  <>
    {categories.map((category, index) => (
      <React.Fragment key={index}>
        <a href={`/blog#${  category}`}>{category}</a>
        {categories.length !== index + 1 ? ", " : null}
      </React.Fragment>
    ))}
  </>
);
