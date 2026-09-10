const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const BUILD_DIRECTORY = path.join(process.cwd(), ".next");
const MANIFEST_PATH = path.join(BUILD_DIRECTORY, "build-manifest.json");
const BUDGETS_KIB = {
  "/_app": 175,
  "/": 200,
  "/projects": 200,
  "/blog": 195,
  "/blog/[blogId]": 245,
};

if (!fs.existsSync(MANIFEST_PATH)) {
  throw new Error("Missing .next/build-manifest.json. Run next build before checking performance budgets.");
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

const initialFilesFor = (route) => {
  const pageFiles = manifest.pages[route];
  if (!pageFiles) {
    throw new Error(`Route ${route} is missing from the build manifest.`);
  }

  const appFiles = route === "/_app" ? [] : manifest.pages["/_app"] || [];
  return [...new Set([...appFiles, ...pageFiles])].filter((file) => /\.(?:js|css)$/.test(file));
};

const gzipSize = (file) => zlib.gzipSync(fs.readFileSync(path.join(BUILD_DIRECTORY, file))).length;

const failures = [];
for (const [route, budgetKib] of Object.entries(BUDGETS_KIB)) {
  const bytes = initialFilesFor(route).reduce((total, file) => total + gzipSize(file), 0);
  const sizeKib = bytes / 1024;
  const result = `${route}: ${sizeKib.toFixed(1)} KiB gzip (budget ${budgetKib} KiB)`;

  if (sizeKib > budgetKib) {
    failures.push(result);
  }

  console.log(result);
}

const removedMedia = ["f1car", "MilkyWay"];
const mediaDirectory = path.join(BUILD_DIRECTORY, "static", "media");
const shippedRemovedMedia = fs.existsSync(mediaDirectory)
  ? fs.readdirSync(mediaDirectory).filter((file) => removedMedia.some((asset) => file.startsWith(`${asset}.`)))
  : [];

if (shippedRemovedMedia.length > 0) {
  failures.push(`Unused media shipped: ${shippedRemovedMedia.join(", ")}`);
}

if (failures.length > 0) {
  throw new Error(`Performance budget exceeded:\n${failures.join("\n")}`);
}
