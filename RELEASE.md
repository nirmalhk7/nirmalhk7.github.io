# Blog Release Detection Strategy

This document outlines the strategy for automatically detecting when a new blog article is released.

## Definition of "Released"
A blog article is considered released when its markdown file (`.md`) is pushed to the `main` branch under the `content/blog/` directory.

## Implementation Strategy: Path Filtering
The most effective way to detect this is using GitHub Actions' native **path filtering**. 

### Proposed Workflow File: `.github/workflows/blog-release.yml`

```yaml
name: New Blog Release Detection

on:
  push:
    branches:
      - main
    paths:
      - 'content/blog/**.md'

jobs:
  on-blog-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Confirm Blog Release
        run: echo "A new blog post has been released on the main branch."
      
      # Future automation (e.g., newsletters, cross-posting) can be added here
```

## Benefits
- **Clean Separation**: Keeps deployment logic (`deploy.yml`) separate from post-release notification/automation logic.
- **Efficiency**: The workflow only runs when relevant files are changed, saving GitHub Actions minutes.
- **Native Support**: Uses built-in Git and GitHub features without external dependencies.
