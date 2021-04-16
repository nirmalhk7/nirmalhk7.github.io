import React from "react";

export const CategoryList = ({ categories }) => (
  <>
    {categories.map((c, i) => (
      <React.Fragment key={i}>
        <a href={"/blog#" + c}>{c}</a>
        {categories.length !== i + 1 ? ", " : null}
      </React.Fragment>
    ))}
  </>
);
