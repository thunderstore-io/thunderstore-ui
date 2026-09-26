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

From bottom to top:

1. **Browser defaults** — what buttons and inputs look like with no CSS.
2. **`cyberstorm.theme-reset`** — this package's only reset
   (`src/styles/nativeReset.css`). It clears that browser chrome.
3. **`cyberstorm`** — component layout, such as a button's padding and border.
4. **`cyberstorm-theme`** — colors, sizes, and the rest of this skin.

The reset is nested inside `cyberstorm`, under the component rules, so a
button's own padding still wins. The component package does not mention it.
`nimbus` is for app overrides and sits above the skin.

Apps declare the top-level layers, then load Cyberstorm, then this skin:

```css
@layer cyberstorm, cyberstorm-theme, nimbus;
```

```ts
import "@thunderstore/cyberstorm/css";
import "@thunderstore/cyberstorm-theme/css";
import "@thunderstore/cyberstorm-theme/fonts.css";
```

Skip the two theme imports for the barebones render: system font, no colors,
and ordinary browser styling on buttons and inputs. Storybook shows that
render as the right-hand column of each composition.

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
