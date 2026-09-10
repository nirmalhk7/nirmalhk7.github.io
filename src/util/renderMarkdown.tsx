import React from "react";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";

export const renderProjectMarkdown = (markdown: string | null) => {
  if (!markdown) return "";

  return renderToStaticMarkup(<ReactMarkdown>{markdown}</ReactMarkdown>);
};
