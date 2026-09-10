import path from "path";

import sampleSize from "lodash/sampleSize";

import loadYaml from "@/util/loadYaml";

const quotesPath = path.join(process.cwd(), "content", "yml", "quotes.yaml");

export const loadRandomQuote = <T>(filePath = quotesPath): T =>
  sampleSize(loadYaml<T[]>(filePath))[0];
