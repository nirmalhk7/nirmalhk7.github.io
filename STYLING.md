# Tailwind component styling

Component presentation lives in static Tailwind class strings in `*.styles.ts`. Shared maps keep the existing component keys and reusable editorial patterns while removing all six custom component stylesheets. Every utility is a complete literal so Tailwind's content scanner can discover it, including the dynamically selected `tonepaper`, `tonemuted`, and `toneink` entries.

The migration reduces source CSS/SCSS from **3,022 lines in 11 files to 1,094 lines in two files (63.8% fewer)**. The class maps add about 1,000 TypeScript lines; this is a conversion to Tailwind utilities rather than a claim that all styling code disappeared. No formatting-only reduction is included in that CSS count.

Use shared theme utilities such as `text-portfolio-ink`, `bg-portfolio-paper`, `font-body`, `font-display`, and `max-w-content`. Existing typography uses a 10px root, so arbitrary pixel utilities preserve dimensions where Tailwind's default rem scale differs. Named class hooks support descendant and state variants for generated Markdown, portals, and shared component patterns. Exact width/height conditions remain in arbitrary media variants. A pair of media variants represents the cinematic layout's original OR condition.

The remaining CSS holds global/base styles, font registration, runtime theme variables shared by the shell and portals, document-level typography defaults in Tailwind's component layer, and animation/browser rules. Keep a CSS shorthand as an arbitrary property when a narrower utility would lose a reset: for example, `[text-decoration:none]` resets decoration style as well as its line. A trailing `[&]` identity variant is used only where a specific override must follow its matching shorthand reset without increasing specificity.

## Verification

- `npm run check-style-budget` compares all source CSS/SCSS lines with pre-migration revision `2621bf2ebe81889b055442606c66fd918d2599f8` and requires at least a 50% reduction. This check prevents declaration-only rewrites that retain or grow custom stylesheets.
- `npm test -- --runInBand --coverage=false` runs the existing behavior tests.
- `npx next build --no-lint` checks production compilation and page generation without invoking network-backed content synchronization. Full lint currently reports the unchanged `NextApiResponse<any>` in `src/pages/api/.well-known/webfinger.ts:7`.
- `npm run check-ui-parity -- http://localhost:3105 http://localhost:3106` compares independently served original and current production builds. Install Playwright in the verification environment or set `PLAYWRIGHT_MODULE` to an existing Playwright module directory. The checker uses Chrome, blocks third-party network requests, and compares DOM structure plus computed element and pseudo-element styles after animations settle. Animation/transition declarations and custom properties are excluded; their resolved visual values are compared.

The UI matrix includes desktop, tablet, and mobile routes, privacy controls, command search, navigation, project expansion and empty results, article hover, and desktop cinematic/short-screen layouts. It writes `output/playwright/ui-parity-report.json` and desktop/mobile screenshots. Build the baseline from an isolated archive of the revision above with its own dependencies; do not reuse the current build output.

Tradeoff: scoped descendant variants preserve the existing cascade but increase generated CSS and serialized class strings. The current production build's shared first-load total is about 194 kB versus 177 kB for the original. This migration optimizes custom stylesheet maintenance, not bundle size.
