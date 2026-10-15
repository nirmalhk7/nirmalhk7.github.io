# Tailwind styling

Component CSS modules use Tailwind 3 utilities through `@apply`. Scoped selectors, specificity, media queries, state selectors, and important overrides remain intact to preserve the existing UI. JSX keeps the same module keys. Global legacy styles are flattened into `src/assets/css/tailwind.css`; no Sass is needed to compile the application styles.

Use the portfolio color and font utilities from `tailwind.config.js` (for example `text-portfolio-ink`, `font-body`, `font-display`, and `max-w-content`). Portfolio CSS variables stay scoped to the shell because portals also use that shell. Existing spacing is in pixels on a 10px root; arbitrary pixel values preserve dimensions where Tailwind's rem scale differs.

Keep native CSS for font faces, runtime custom properties, exact transform/animation composition, gradients, border/background shorthands, and browser-specific rules. Replacing those with superficially similar utilities can change resets or animation ownership. Responsive conditions remain exact, including overlapping width/height cinematic conditions.

## Verification

Run `npm run check-style-parity -- 2621bf2ebe81889b055442606c66fd918d2599f8` to compare against the migration baseline. The check reconstructs baseline SCSS in a temporary directory, then compares compiled Tailwind/PostCSS output. It checks every selector and condition in order, declaration values and importance, and ordering within shorthand families. It permits only independent declaration reordering and equivalent leading-zero formatting. Sass remains installed to compile this historical baseline.

Run `npm test -- --runInBand`, `npm run lint`, and `npx next build` for application checks. This refactor uses `next build` directly to avoid network-backed content synchronization in the repository's build wrapper.
