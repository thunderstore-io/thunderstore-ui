/**
 * Chromatic capture "modes".
 *
 * Each mode is a set of Storybook `globals` overrides that Chromatic applies
 * when snapshotting. We drive `csTheme` (not `theme` — that name collides with
 * Storybook/Chromatic built-ins) so the preview decorator can set
 * `html[data-cs-theme]`. Theme CSS is scoped to `html[data-cs-theme="on"]`
 * (see prefixCyberstormThemeCss.ts), so this attribute is the actual visual
 * switch:
 *
 *   - `themed`    — production look (@thunderstore/cyberstorm-theme).
 *   - `barebones` — theme rules do not match; only @layer cyberstorm.
 */
export const allModes = {
  themed: { csTheme: "on" },
  barebones: { csTheme: "off" },
} as const;
