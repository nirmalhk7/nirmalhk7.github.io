const { syncGithubProjects } = require("./githubProjectSync");

syncGithubProjects().then((result) => {
  if (!result.ok) {
    process.exitCode = 0;
  }
});
