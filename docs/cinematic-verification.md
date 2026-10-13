# Cinematic portfolio verification

Branch: `codex/cinematic-portfolio`. The homepage and shared portfolio system were reviewed; no merge or deployment was performed. Navigation, typography, contact band, and footer now share the same visual language on project, blog, article, resume, utility, and error pages.

## Visual review

The before images came from an unmodified `main` archive. Current after images were captured from the live branch at the same viewport sizes.

| View | Before | After |
| --- | --- | --- |
| Desktop, 1440 × 900 | [Before](screenshots/before-desktop.png) | [After](screenshots/cinematic-desktop.png) |
| Mobile, 390 × 844 | [Before](screenshots/before-mobile.png) | [After](screenshots/cinematic-mobile.png) |

The sequence also has captures for the [portrait-to-engineering transition](screenshots/cinematic-transition.png) and a settled [engineering chapter](screenshots/cinematic-engineering.png).

## Behavior reviewed

- Reviewed at 390, 768, 1024, and 1440 px widths, plus a 1280 × 680 short laptop viewport. The hero keeps Nirmal’s face, name, backend/infrastructure positioning, proof, and hiring links visible without waiting for JavaScript. No horizontal overflow at 390, 768, or 1024 px.
- Scrolled the large-screen image handoff and all four chapters. Smaller and short viewports retain a normal static story. Reduced-motion styles keep content visible and disable scroll choreography.
- Checked project archive and detail expansion, blog list and article, résumé, About anchor from `/projects`, and browser Back. Route changes use a single short clip wipe; hash navigation bypasses it and lands at the requested section.
- Verified NITK Surathkal undergraduate education appears in About and Person JSON-LD. “After hours, still building.” is replaced by a factual homelab introduction. The homepage renders one contact form; success and error paths remain covered by tests.
- The navbar focus trap, Escape close, focus return, and selection close are covered by `navbar.test.tsx`. JavaScript-disabled, 200% zoom, reduced-motion override, and slow-network browser emulation were unavailable in this pass; server-rendered tests confirm the story text is present before animation.

## Checks

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, no warnings |
| `npx tsc --noEmit --incremental false` | Passed |
| `npx jest --runInBand --reporters=default --coverage=false` | 12 suites, 29 tests passed |
| `npx next build` | Passed |
| `npm run check-performance` | `_app` 173.2 KiB gzip / 175 KiB; `/` 186.9 / 200 KiB; `/projects` 184.6 / 200 KiB; `/blog` 184.2 / 195 KiB; `/blog/[blogId]` 240.8 / 245 KiB |
| `npm run check-project-markdown` | 32 projects passed |
| `git diff --check` | Passed |
| Impeccable `detect` on changed UI files | No current findings; no suppressions added |

The shared `_app` route remains 1.8 KiB under its gzip budget. Blog article routes have 4.2 KiB remaining. Added route choreography is loaded with the portfolio UI; GSAP/ScrollTrigger remains lazy-loaded only for the large-screen homepage sequence. Local portrait font files and optimized hero image are separate from route JS/CSS budget.
