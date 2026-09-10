/**
 * Chromatic capture "modes".
 *
 * Each mode is a set of Storybook `globals` overrides that Chromatic applies
 * when snapshotting. We drive the `theme` global that the ThemeDecorator in
 * `preview.tsx` reads, so every story is captured twice:
 *
 *   - `themed`    — @thunderstore/cyberstorm-theme applied (production look).
 *                   This is the neutrality baseline; it must stay pixel-identical.
 *   - `barebones` — theme disabled, only @thunderstore/cyberstorm CSS in effect
 *                   (functional-but-ugly), so component breakage without the
 *                   theme is caught by the gate too.
 *
 * Requires the `@chromatic-com/storybook` addon (registered in main.ts).
 */
export const allModes = {
  themed: { theme: "on" },
  barebones: { theme: "off" },
} as const;
