# Cinematic homepage verification

Branch: `codex/cinematic-portfolio`. The homepage and shared navigation/footer are the intended scope. No merge or deployment was performed.

## Visual comparison

The before images were captured from a temporary, unmodified `main` archive at the same viewport sizes as the after images. The live page on this branch supplied the after and scroll-stage captures.

| View | Before | After |
| --- | --- | --- |
| Desktop, 1440 × 900 | [Before](screenshots/before-desktop.png) | [After](screenshots/cinematic-desktop.png) |
| Mobile, 390 × 844 | [Before](screenshots/before-mobile.png) | [After](screenshots/cinematic-mobile.png) |

The scroll sequence is shown at its [portrait handoff](screenshots/cinematic-transition.png) and [engineering scene](screenshots/cinematic-engineering.png).

## Behavior reviewed

- Checked the live homepage at 390, 768, 1024, 1280, and 1440 px widths, including a 1280 × 680 short viewport. The face, positioning, proof, and primary links remain visible in the initial viewport. No horizontal body overflow was found at 390, 768, or 1024 px.
- Scrolled through the desktop photo-to-portrait transition and all four engineering stages. The compact navbar and mobile menu were reviewed visually. Mobile menu selection closes it; its focus trap, Escape behavior, and scroll lock have focused tests.
- Verified `/projects?id=atskit` loads and browser Back returns to `/#project`. Checked that the homepage renders one contact form and that its success/error behavior is covered by tests.
- Static server-rendered markup contains the hero copy and all engineering stages without waiting for animation. Reduced-motion and smaller/shorter viewport paths use the static layout in code. Browser-level JavaScript-disabled, reduced-motion, 200% zoom, and slow-network emulation were not available in the browser tooling used for this pass.

## Checks

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npx tsc --noEmit --incremental false` | Passed |
| `npx jest --runInBand --reporters=default` | 12 suites, 29 tests passed |
| `npx next build` | Passed |
| `npm run check-performance` | Homepage 187.5 KiB gzip against 200 KiB budget; `_app` 174.2 KiB against 175 KiB budget |
| `npm run check-project-markdown` | 32 projects passed |
| `git diff --check` | Passed |
| Impeccable `detect` on changed home/contact/navbar files | No current findings; no suppressions added |

An unmodified `main` archive was built separately with the same local dependency installation for comparison. Its homepage measured 191.8 KiB gzip in `check-performance`; this branch measured 187.5 KiB, a 4.3 KiB reduction. The shared `_app` route increased from 170.6 to 174.2 KiB gzip, leaving 0.8 KiB under its 175 KiB budget. Next.js reported homepage First Load JS of 181 kB on `main` and 178 kB on this branch.

Local font files total 47,000 bytes (Outfit 32,292; IBM Plex Mono 14,708). The optimized hero AVIF observed in the local browser was 89,958 bytes. These assets are counted separately from the route JavaScript/CSS budget.

Numeric LCP and CLS were not captured: the available browser instrumentation exposed FCP and TTFB but not those metrics. Review route size after further shared-shell changes.
