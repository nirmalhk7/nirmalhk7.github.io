import fs from "node:fs";

function unquote(value) {
  const quotes = new Set(['"', "'"]);
  return quotes.has(value[0]) && value[0] === value.at(-1) ? value.slice(1, -1) : value;
}

function readAssignment(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return undefined;
  const separator = trimmed.indexOf("=");
  if (separator === -1) return undefined;
  const key = trimmed.slice(0, separator).replace(/^export\s+/, "").trim();
  if (!key || process.env[key]) return undefined;
  return { key, value: unquote(trimmed.slice(separator + 1).trim()) };
}

export function loadEnvironmentFiles(paths) {
  for (const path of paths) {
    if (!fs.existsSync(path)) continue;
    for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
      const assignment = readAssignment(line);
      if (assignment) process.env[assignment.key] = assignment.value;
    }
  }
}
