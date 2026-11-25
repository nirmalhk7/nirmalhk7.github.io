import { syncGithubProjects } from "./githubProjectSync.mjs";

syncGithubProjects().then((result) => {
  if (!result.ok) {
    process.exitCode = 0;
  }
});
