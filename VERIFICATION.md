# Hiring-focused portfolio verification

## Workspace

Branch: `codex/hiring-portfolio-red`.
Worktree: `/private/tmp/hiring-portfolio-red`.
Base: `375fce89`, with the earlier uncommitted Whirlwind/latest-blog changes copied into this checkout. The original checkout remains intact.

The managed-worktree tool failed both with an explicit source path and with the chat default: it could not identify the repository. A standard Git worktree was created using `git worktree add -b codex/hiring-portfolio-red /private/tmp/hiring-portfolio-red HEAD`. This worktree is not registered as an app-managed attachment.

## Test-first evidence

Before implementation, `npm test -- --runInBand --coverage=false src/__tests__/homeWriting.test.tsx src/__tests__/cinematicStory.test.tsx src/__tests__/seoPages.test.ts` produced 6 expected failures and 9 passes: Whirlwind was absent, the hero repeated its positioning, article presentation lacked the new structure, and the old section order remained.

After implementation, the same command passed all 15 tests. Logs are under `.impeccable/verification/tdd-red.log` and `tdd-green.log`.

The responsive browser check initially returned `mobileOverflowPass: false` (424px content in a 390px viewport). After constraining the About image, it returned true with a 346px image inside the 390px viewport.

## Final checks

| Command / check | Result |
| --- | --- |
| `npm test -- --runInBand` | 28 suites, 134 tests passed |
| `npm run lint` | No warnings or errors |
| `npm run build` | Passed; all 21 static pages generated |
| `npm run check-performance` | All five budgets passed; homepage 187.5 KiB gzip against 200 KiB budget |
| `npm run check-project-markdown` | Verified all 32 projects |
| `git diff --check` | Passed |
| Impeccable `detect --json` over the homepage components/styles | Empty findings array; run once before the responsive correction batch |
| Built-page Node assertions | Passed section order, five-project order, unique Whirlwind destination, newest two articles, diagram accessibility, and Whirlwind naming |

A menu-focus test exceeded its 5-second timeout while a build ran concurrently. Its isolated rerun passed all 7 navigation tests, and the final full-suite rerun passed all 134 tests. No timeout or assertion was relaxed.

Build output retains existing Browserslist staleness warnings. GitHub project synchronization skipped because this checkout has no token configured; checked-in project content was used.

## Acceptance coverage

- Preserved red #c43b31, paper #f5f2eb, ink #202321, existing fonts, beach photograph, and trees photograph.
- Static hero test checks positioning, original employer/education evidence, and work/résumé/contact destinations. Experience immediately follows hero. Pinned cinematic and rotating-topic components are removed.
- Homepage loader test checks Whirlwind followed by Autoscaler, ATSKit, ScholarHub, and MedicalVR. The featured project appears once. Diagram has an accessible title/description and a simplified-workflow caption.
- Real browser navigation to `/projects?id=whirlwind` opens Whirlwind's details panel.
- Writing tests cover newest-first selection, two-post limit, dates, descriptions, excerpt fallback, empty collections, one undated article, and a long full title. Actual built articles are Sentry (2026-11-13) and LiveKit (2026-10-26).
- Biography, source experience descriptions, professional links, and disclosure contents are preserved. Browser keyboard interaction expands Languages and tools. Existing contact form tests remain passing; no message was sent.
- Browser checks at 1440×960, 834×1112, and 390×844 showed no horizontal overflow after correction. Navigation/content gutters are 120px at 1440, 32px at 834, and 22px at 390. Section spacing is 88px desktop and 56px mobile; desktop section headings are 56px.
- Keyboard Tab reaches Résumé from View work with a red focus outline. Mobile keyboard menu navigation closes the menu and reaches Projects at approximately 72px below the viewport top.
- Reduced-motion behavior was checked through the compiled CSSOM: homepage reveals use no animation and link transitions are disabled. Static HTML remains readable without motion. Browser tooling did not expose reduced-motion emulation, so OS-preference emulation was not performed.
- Desktop, tablet, and mobile screenshots were captured in one inspection round plus one confirmation round. Screenshots and logs are stored locally under `.impeccable/verification/` (gitignored).

## Delivery limits

No PR, push, or deployment. Worktree changes are uncommitted. Original checkout was not modified by this implementation. The local production server used for inspection is stopped after verification.
