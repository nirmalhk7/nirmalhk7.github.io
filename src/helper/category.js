import React from "react";

export const CategoryList = ({ categories }) => (
  <>
    {categories.map((c, i) => (
      <>
        <a key={i} href={"/blog#" + c}>
          {c}
        </a>
        {categories.length!==i+1?", ":null}
      </>
    ))}
  </>
);
