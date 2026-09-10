# Cyberstorm UI library

`@thunderstore/cyberstorm` is the **self-contained** React component library for
Thunderstore. It owns the component code, the component **API types**
(variant/size/modifier lists such as `ButtonVariantsList`), and **structural CSS
only** (layout, sizing, and placeholder token defaults). It renders
functional-but-ugly on its own, with **zero dependency** on the theme;
[`@thunderstore/cyberstorm-theme`](../cyberstorm-theme/README.md) is a pure-CSS
skin layered on top for the production look.

## Architecture

### Package responsibilities

- **This package (`cyberstorm`)** — components, their API types, and structural
  CSS. Ships **no colors of its own**; it references themeable custom properties
  (`var(--button-background-color)`, …) and provides barebones **structural**
  fallbacks for them.
- **`cyberstorm-theme`** — pure CSS: colors, component sizes, misc tokens, and
  fonts. No TypeScript/runtime exports.

The dependency direction is one-way: `cyberstorm` does **not** depend on
`cyberstorm-theme`. Consumers import Cyberstorm and then, optionally, add the
theme on top.

### `defaults.css` (barebones tokens)

`src/defaults.css` defines placeholder values for the **structural** design
tokens the components rely on — spacing, radii, gaps, border widths, the
typography scale, and animation lengths. It deliberately ships **no color
tokens**: unset colors are the "ugly" part of the barebones state. These defaults
live in `@layer cyberstorm` (the lowest layer), so whenever the theme is loaded
it overrides all of them — `defaults.css` is a no-op for themed output and only
takes effect when Cyberstorm is used without the theme.

### CSS layers

Styling is organized into three cascade layers, later overriding earlier:

```css
@layer cyberstorm, cyberstorm-theme, nimbus;
```

- `cyberstorm` — this package's structural CSS + `defaults.css`.
- `cyberstorm-theme` — the skin (see the theme package).
- `nimbus` — app-level (remix) overrides.

The order is declared explicitly by consumers so precedence never depends on
import order.

### Usage

```ts
// Barebones (functional, unstyled, system fonts):
import "@thunderstore/cyberstorm/css";

// Production look — add the theme on top:
import "@thunderstore/cyberstorm-theme/css";
import "@thunderstore/cyberstorm-theme/fonts.css";

// Components and their API types both come from this package:
import { NewButton, ButtonVariantsList } from "@thunderstore/cyberstorm";
```

## Storybook

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
provides a sandbox to build UI components in isolation, without having to start
up the whole service stack. Additionally it showcases the existing components,
promoting reusability.

To start Cyberstorm Storybook, run `pnpm --filter @thunderstore/storybook run storybook`.

Storybook can then be accessed at [http://localhost:6006/](http://localhost:6006/).

## Naming conventions

### Basic information

1. Every element targeted by CSS has to have a CSS class.
   - Every element NOT targeted by CSS does not HAVE to have a CSS class (but can).
   - This makes the selectors stay flat

2. CSS ClassNames should follow lowerCamelCase format, e.g.:
   - `.root`
   - `.label`
   - `.categoryWrapper`
3. Do not prefix any class names with the component's name (except the color scheme variations).

4. Component's root element should have the class name of `.root`

5. Color scheme Variation declarations should be separated from the class by two underscores, e.g.:
   - `.packageCard__default`
   - `.metaItem__last`
   - `.button__specialGreen`

6. Prop names follow lowerCamelCase:
   - `icon`
   - `colorScheme`
   - `downloadCount`

7. color scheme is passed as a prop in the format of:
   - `colorScheme: "default"`
   - `colorScheme: "tertiary"`

8. Style class is selected (based on colorScheme) from the css-module via the `getStyle()` function, like this:
   ```typescript
   const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
        return {
            tertiary: styles.metaItem__tertiary,
            default: styles.metaItem__default,
        }[scheme];
    };
   ```

9. A component should have an interface for the props, like this:
    ```typescript
    export interface MetaItemProps {
      label?: string;
      icon?: ReactNode;
      colorScheme: "default" | "tertiary";
    }
    ```

//TODO: update this section
### Global CSS usage
1. examples of global CSS variable names:
   - `--color-gradient-blue-green--darker`
   - `--font-weight-bold`
   - `--old--color-cyber-green-70`
   - `--padding-m`

2. When reasonable, don't use the `--size` variables directly, instead proxy them like this:
   - `--padding-s: var(--size-s);`
   - `--border-width-m: var(--size--6xs);`

    Use variables for every value, when reasonable!
