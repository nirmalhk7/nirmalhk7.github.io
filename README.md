# Nirmal Khedkar | Professional Portfolio & Blog

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-performance, SEO-optimized personal website and technical blog ("The Blue Green Manual") built with Next.js. This project showcases my engineering journey, professional projects, and deep dives into production-grade software reliability.

## 🚀 Key Features

- **The Blue Green Manual:** A technical blog focused on software reliability, distributed systems, and DevOps patterns.
- **Project Showcase:** A dynamic portfolio of engineering projects with markdown-based case studies.
- **Optimized Performance:** Leverages Next.js Static Site Generation (SSG) for near-instant load times.
- **Advanced Analytics:** Custom surveillance engine tracking scroll depth, engagement personas, and outbound clicks.
- **LLM Ready:** Automated generation of `llms.txt` to help AI agents understand my professional background accurately.
- **Technical SEO:** Fully optimized with JSON-LD schemas (Person, Article, Breadcrumbs), OpenGraph tags, and RSS feeds.
- **Hacker Aesthetic:** Custom-built terminal-style loader and high-fidelity animations using Framer Motion.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (Pages Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Consolidated from SASS)
- **Content:** Markdown (Gray-matter + React-Markdown) & YAML
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [FontAwesome 6](https://fontawesome.com/)
- **Testing:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Deployment:** [Vercel](https://vercel.com/)

## 📦 Project Structure

```text
├── content/           # Markdown (Blog/Projects) and YAML data
├── public/            # Static assets and generated feeds
├── scripts/           # Build-time scripts (Sitemap, RSS, llms.txt)
├── src/
│   ├── components/    # React components (Layout, Blog, Project)
│   ├── elements/      # Reusable UI elements (Navbar, Jumbotron)
│   ├── hooks/         # Custom React hooks (useAnalytics)
│   ├── interfaces/    # Centralized TypeScript definitions
│   ├── pages/         # Next.js routes and API handlers
│   └── util/          # Helper functions (Markdown/YAML loaders)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 22.0.0
- npm

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

### Build
```bash
npm run build
```
This script will:
1. Generate a fresh `sitemap.xml`.
2. Generate an anonymized `llms.txt`.
3. Build the static Next.js application.

## 📈 Surveillance & Analytics

This site uses a custom tracking hook `useAnalytics` that monitors:
- **Scroll Depth:** Milestone tracking at 25%, 50%, 75%, and 90%.
- **Persona Tagging:** Automatically identifies "Recruiters" (resume downloads) and "Engaged Readers" (deep scroll).
- **Engagement Metrics:** Outbound link latency and session duration.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by [Nirmal Khedkar](https://nirmalhk7.com)*
