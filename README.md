# Nirmal Khedkar | Professional Portfolio & Blog

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-performance, SEO-optimized personal website and technical blog ("The Blue Green Manual") built with Next.js. This project showcases my engineering journey, professional projects, and deep dives into production-grade software reliability.

## 🚀 Key Features

- **The Blue Green Manual:** A technical blog focused on software reliability, distributed systems, and DevOps patterns.
- **Project Showcase:** A dynamic portfolio of engineering projects with markdown-based case studies.
- **Optimized Performance:** Leverages Next.js Static Site Generation (SSG) for near-instant load times and high Core Web Vitals.
- **Advanced Analytics:** Custom surveillance engine tracking scroll depth, engagement personas (Recruiter vs. Reader), and outbound link latency.
- **LLM Ready:** Automated generation of `llms.txt` to help AI agents understand my professional background accurately.
- **Technical SEO:** Fully optimized with JSON-LD schemas (Person, Article, Breadcrumbs), OpenGraph tags, and a dynamic RSS feed.
- **Hacker Aesthetic:** Custom-built "split-flap" terminal-style loader and high-fidelity animations using Framer Motion.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (Pages Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [SASS Modules](https://sass-lang.com/)
- **Content:** Markdown ([Gray-matter](https://github.com/jonschlinkert/gray-matter) + [React-Markdown](https://github.com/remarkjs/react-markdown)) & YAML
- **Animations:** [Framer Motion 12](https://www.framer.com/motion/)
- **Icons:** [FontAwesome 6](https://fontawesome.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Deployment:** [Vercel](https://vercel.com/)

## 📦 Project Structure

```text
├── content/           # Content source files
│   ├── blog/          # Markdown posts for "The Blue Green Manual"
│   ├── projects/      # Markdown case studies for engineering projects
│   └── yml/           # YAML data for skills, experience, and profile
├── public/            # Static assets and generated feeds
├── scripts/           # Build-time automation scripts
├── src/
│   ├── components/    # React components (Blog, Project, Loader)
│   ├── elements/      # Reusable UI elements (Navbar, Jumbotron)
│   ├── hooks/         # Custom React hooks (useAnalytics)
│   ├── interfaces/    # Centralized TypeScript definitions
│   ├── pages/         # Next.js routes and API handlers
│   │   └── api/       # Serverless functions (RSS, Newsletter, etc.)
│   └── util/          # Core utilities (Markdown loaders, Analytics engine)
```

## 🛠️ Getting Started

### Prerequisites
- **Node.js:** >= 22.0.0 < 23.0.0
- **npm:** Standard version

### Installation
```bash
git clone https://github.com/nirmalhk7/nirmalhk7.github.io.git
cd nirmalhk7.github.io
npm install --legacy-peer-deps
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
The build pipeline automatically:
1. Generates a fresh `sitemap.xml`.
2. Generates a sanitized `llms.txt` for AI consumption.
3. Compiles the static Next.js application with full type-checking.

## 📜 Project Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Executes the full production build pipeline.
- `npm run lint`: Runs ESLint to ensure code quality and standard compliance.
- `npm run test`: Executes the Jest test suite.
- `npm run gen-llms`: Manually generates the `llms.txt` file from project content.
- `npm run gen-sitemap`: Manually generates the `sitemap.xml`.
- `npm run check-links`: Runs a broken link checker against the local production build.
- `npm run get-resume`: Fetches the latest Resume PDF from a remote source.

## ✍️ Content Management

### Adding a Blog Post
1. Create a new `.md` file in `content/blog/`.
2. Add the required frontmatter:
   ```markdown
   ---
   title: "Post Title"
   description: "Brief summary"
   date: "YYYY-MM-DD"
   category: ["DevOps", "Reliability"]
   image: "/assets/image.png"
   ---
   ```

### Adding a Project
1. Create a new `.md` file in `content/projects/`.
2. Define the project details in the frontmatter and the case study in the body.

## 🛡️ CI/CD & Reliability

The project employs a robust CI/CD pipeline via GitHub Actions:
- **Jest Tests:** Automated unit and component testing on every push.
- **Link Checker:** Weekly scheduled checks to identify and fix broken external links.
- **Vercel Deployment:** Automated production deployments with preview environments for PRs.

## 📈 Surveillance & Analytics

This site uses a custom tracking hook `useAnalytics` that integrates with Google Analytics 4 (GA4) to monitor:
- **Scroll Depth:** Milestone tracking at 25%, 50%, 75%, and 90%.
- **Persona Tagging:** Automatically identifies "Recruiters" (resume downloads) and "Engaged Readers" (75%+ scroll depth).
- **Engagement Metrics:** Tracks outbound link latency, session duration, and document visibility changes.
- **Error Capturing:** Global error boundary for tracking client-side exceptions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by [Nirmal Khedkar](https://nirmalhk7.com)*
