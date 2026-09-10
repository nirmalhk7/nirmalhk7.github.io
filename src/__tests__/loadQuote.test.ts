import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { loadRandomQuote } from "@/util/loadQuote";

describe("loadRandomQuote", () => {
  it("returns a quote from the supplied YAML file", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "quotes-"));
    const filePath = path.join(tempDir, "quotes.yaml");
    fs.writeFileSync(filePath, "- quote: First\n- quote: Second\n");

    expect(["First", "Second"]).toContain(loadRandomQuote<{ quote: string }>(filePath).quote);
  });
});
