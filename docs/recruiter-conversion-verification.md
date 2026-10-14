# Recruiter conversion pass

Branch: `codex/cinematic-portfolio`. No merge or deployment.

Update: `/resume` hosts an embedded PDF immediately. All site résumé navigation points to `/resume`; `/Resume.pdf` remains the underlying embedded asset. Earlier HTML summary evidence below describes the previous implementation.

## Changes

- Inner-route navigation now opens `/projects` and `/blog`, with current-page semantics. Home retains its section anchors. Résumé navigation stays in the same tab.
- Projects leads with eight curated projects, starting with the Kubernetes autoscaler, ATSKit, and Khan. Search and area filters cover all 32 projects; detailed technology filters are disclosed on demand. Technology aliases are normalized.
- Selected project expansion explains verified contribution and technical details, with original project notes retained behind a disclosure. Deep links and browser Back retain predictable expansion behavior.
- Résumé renders sourced experience, NITK Surathkal undergraduate studies, CU Boulder MS, and systems skills as HTML. Open/download PDF actions work independently of the optional desktop preview. A permanent fallback explains browser PDF limitations; mobile omits the embed.
- Mobile blog excerpts use four lines. Article sharing prioritizes Copy link, LinkedIn, email, and Twitter. Design examples are noninteractive and excluded from indexing.

## Recruiter success test

Independent review passed five of five information-findability signals: backend/infrastructure specialty, Visa/ZOLL experience, strongest infrastructure project, NITK/CU Boulder education, and contact path. Proxy: first-viewport scan, one obvious navigation action, and at most one short scroll. This is source/screenshot evidence, not a timed human study or measured conversion lift.

The hero supplies specialty, employer proof, education, and work/résumé/contact links together. `/projects` leads with capacity planning. `/resume` provides readable experience immediately. Contact links reach the form and direct email.

## Visual and interaction evidence

One combined review at 390 × 844, 768 × 900, 1440 × 900, and a 1280 × 680 short laptop viewport; one confirmation after fixes. Checked project deep links, Back, empty search recovery, mobile navigation selection, Escape/focus return, and optional PDF preview/fallback. No horizontal overflow observed in the measured home/mobile project views.

- [Desktop hero](screenshots/conversion-home-desktop.png)
- [Mobile hero](screenshots/conversion-home-mobile.png)
- [Desktop projects](screenshots/conversion-projects-desktop.png)
- [Mobile selected work](screenshots/conversion-projects-mobile.png)
- [Mobile résumé](screenshots/conversion-resume-mobile.png)
- [Mobile writing feature](screenshots/conversion-blog-mobile.png)

## Verification

| Check | Result |
| --- | --- |
| Lint | Passed, no warnings |
| TypeScript | Passed |
| Jest | 14 suites, 34 tests passed; default reporter only |
| Direct Next build | Passed |
| Build-rendered Markdown | All 32 projects passed |
| Git whitespace check | Passed |
| Impeccable detector | No findings; no suppressions added |

| Route JS/CSS gzip | Before this pass | After | Budget |
| --- | --- | --- | --- |
| Shared app | 173.2 KiB | 173.2 KiB | 175 KiB |
| Home | 186.9 KiB | 186.9 KiB | 200 KiB |
| Projects | 184.6 KiB | 186.9 KiB | 200 KiB |
| Blog | 184.2 KiB | 184.5 KiB | 195 KiB |
| Article | 240.8 KiB | 241.3 KiB | 245 KiB |

No new fonts, images, dependencies, or motion engines added in this pass. Existing lazy-loaded cinematic motion remains. These are build asset budgets, not runtime LCP/CLS measurements. Slow-network, browser-level reduced-motion, JavaScript-disabled, and 200% zoom emulation were unavailable through this browser backend. Static-content tests remain passing; no new scroll-driven React state was introduced.

Original critique archive remains in `.impeccable/critique`. The latest-snapshot lookup returned exit 2 for the directory target, so no explicit snapshot closure was attempted. No new critique score is claimed.

Unrelated staged `reports/jest-junit.xml` and untracked `renovate.json` preserved. Dev preview runs at `http://127.0.0.1:3000/`.

Remaining limits: experience metrics must come from verified evidence; no invented scale added. PDF iframe load events cannot prove that a browser painted the PDF, which is why the fallback remains visible. Actual recruiter behavior and contact conversion require a human test or production analytics.
