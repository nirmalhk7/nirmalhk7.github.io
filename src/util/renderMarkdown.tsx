import React from "react";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { markdownHeadings } from "./markdownHeadings";

export const renderProjectMarkdown = (markdown: string | null) => {
  if (!markdown) return "";

  return renderToStaticMarkup(<ReactMarkdown components={markdownHeadings}>{markdown}</ReactMarkdown>);
};
