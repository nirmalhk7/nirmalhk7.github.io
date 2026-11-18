# Cinematic portfolio verification

Branch: `codex/hiring-portfolio-red`, worktree `/private/tmp/hiring-portfolio-red`.

This iteration replaces the rejected background-photo banner with the user-confirmed portrait-led opening and restores the Apple-product-like engineering story. It retains the previous Whirlwind feature, five selected projects, newest-two-blog listing, biography, photography, contact form, SEO, and analytics. Source checkout remains separate.

## Test-first evidence

- `npm test -- --runInBand --coverage=false src/__tests__/cinematicStory.test.tsx src/__tests__/homeWriting.test.tsx`: 3 expected failures before implementation (missing four-chapter story, old hero identity, and old section sequence).
- `npm test -- --runInBand --coverage=false src/__tests__/cinematicMotion.test.ts src/__tests__/navbar.test.tsx`: 10 expected failures against the empty motion skeleton and old navigation theme; 7 existing tests passed.
- Home/brand regression: browser Home activation left the page in the engineering phase after a section jump. Both new header regression cases failed with zero scroll requests before the explicit same-page scroll behavior was added.
- Logs are preserved under `.impeccable/verification/cinematic-*-red.log`.

## Final commands

| Command | Result |
| --- | --- |
| `npm test -- --runInBand` | 29 suites, 148 tests passed |
| `npm run lint` | No warnings or errors |
| `npm run build` | Passed; 21 static pages generated |
| `npm run check-performance` | All five route budgets passed; homepage 189.8 KiB gzip / 200 KiB budget |
| `npm run check-project-markdown` | All 32 projects verified |
| `git diff --check` | Passed |
| Impeccable detector on changed frontend targets | Empty findings array; run once |

Build retains existing Browserslist staleness warnings. GitHub content sync skips without a local token, using checked-in content. Jest's static navigation rendering produces React layout-effect warnings from browser motion dependencies; interactive and production rendering were checked separately.

## Acceptance coverage

- One visible primary name heading, concise role/evidence, original photo, red action, résumé/contact destinations: static hero tests plus desktop and mobile captures.
- Product, Infrastructure, Security, and AI chapters with real ScholarHub/Visa/Whirlwind evidence: static content tests. Content is readable before enhancement.
- Pure scroll-frame tests cover clamping, invalid input, transition boundaries, and all four chapters. Real DOM controller tests cover forward/backward scroll, inert states, event cleanup, and restoration to static content.
- Desktop browser: sticky frame at top 0, phases change from intro to engineering, chapters 1 and 3 were observed, exactly one visible/interactive chapter, red path progression, and readable light/dark navigation.
- Direct Continue-to-experience lands at approximately 72px below viewport top. Home from an active chapter, brand from a section jump, and Home after resize return to scroll 0, phase intro, light navigation true. At the resized experience start, viewport was 1280×720, scroll 3240, and experience top 72px before Home.
- Same-page Home handler preserves modified clicks by only intercepting a plain left click. Reduced motion requests an instant return.
- Mobile 390×844 and tablet 834×1112 restore all four chapters to normal flow, with no cinematic state or inert chapters. No horizontal overflow at 390, 834, 1280, or 1440 widths.
- Reduced-motion browser emulation is unavailable in the current browser tool. The matchMedia gate, static CSS fallback, and teardown logic were checked in source/tests; native OS-preference emulation was not performed.
- Existing SEO, article ordering/metadata, project selection, navigation, contact form, and privacy/analytics suites pass. No contact message was sent.

## Review artifacts

Valid screenshots under `.impeccable/review/`: `desktop.jpg` (1440×960), `desktop-story.jpg`, `desktop-ai.jpg`, `user-1280.jpg` (1280×720), `mobile-hero.jpg` (390×844), full `mobile.jpg` and `tablet.jpg`. No new shipping raster assets; existing repository photography is unchanged.

Independent Impeccable review found the opening, type, material, palette, thesis, and story form match the confirmed direction. It required explicit Home/brand return and removal of contradictory old design documentation. The Home/brand fix was implemented and verified; documentation and final fix scoring are recorded by the finish handoffs. The review is against the scoped direction contract and craft floor; no separate comp or QUALITY BAR card was selected.

## Workspace and delivery

The original app-managed worktree tool could not identify this repository, so this is a standard Git worktree. The existing Vercel feature-branch preview was deployed from the preceding commit. Publishing this iteration updates only that same feature branch and preview; production promotion and PR creation are outside scope.
