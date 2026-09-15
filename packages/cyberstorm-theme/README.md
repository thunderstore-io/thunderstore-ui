# @thunderstore/cyberstorm-theme

The **pure-CSS skin** for [`@thunderstore/cyberstorm`](../cyberstorm/README.md). It
supplies the production look — colors, component sizes, miscellaneous design
tokens, and fonts — layered on top of Cyberstorm's barebones structural CSS.

> Historical note: the name "Cyberstorm" was originally meant to be the design
> system's name; this package is what carries that design system today.

## What lives here

- **Only CSS (and fonts).** This package has **no TypeScript / runtime exports**.
  Component API types (variant/size/modifier lists such as `ButtonVariantsList`)
  live in `@thunderstore/cyberstorm`, not here.
- Token values — `styles/` (colors, globals, layout, typography) and the
  `components*` token files (`componentsColors.css`, `componentsSizes.css`,
  `componentsMiscs.css`) — plus per-component skin rules.
- Font assets under `src/styles/fonts/*`.

## How it layers on top of Cyberstorm

Every rule in this package is authored inside a single CSS cascade layer:

```css
@layer cyberstorm-theme {
  /* colors, sizes, tokens, per-component skin rules */
}
```

The canonical layer order (declared by the consuming app) is:

```css
@layer cyberstorm, cyberstorm-theme, nimbus;
```

Because `cyberstorm-theme` sits **above** `cyberstorm`, loading this package
overrides Cyberstorm's barebones placeholder token defaults (see
`packages/cyberstorm/src/defaults.css`) and turns the ugly-but-functional
components into the production design — without any change to Cyberstorm's markup.

## Usage

Load Cyberstorm's structural CSS first, then this skin on top:

```ts
import "@thunderstore/cyberstorm/css";
import "@thunderstore/cyberstorm-theme/css";
import "@thunderstore/cyberstorm-theme/fonts.css";
```

Omit the two theme imports to get the barebones (unstyled, system-font) render —
that is exactly what the Storybook "Theme off" toggle does.

### Exports

| Entry | Points to |
| --- | --- |
| `@thunderstore/cyberstorm-theme/css` | the compiled stylesheet |
| `@thunderstore/cyberstorm-theme/fonts.css` | `@font-face` declarations |
| `@thunderstore/cyberstorm-theme/styles/fonts/*` | raw font assets |

## Build

```bash
pnpm --filter @thunderstore/cyberstorm-theme run build
```
