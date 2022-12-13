# Cyberstorm UI library

## Storybook

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
provides a sandbox to build UI components in isolation, without having to start
up the whole service stack. Additionally, it showcases the existing components,
promoting reusability.

To start Cyberstorm Storybook, run `yarn workspace @thunderstore/cyberstorm-storybook storybook`.

Storybook can then be accessed at http://localhost:6006/.

## Naming conventions

### Basic information

1. Every element targeted by CSS has to have a CSS class.
   - Every element NOT targeted by CSS does not HAVE to have a CSS class (but can).
   - This makes the selectors stay flat
2. CSS ClassNames should follow camelCase format, e.g.:
   - `.root`
   - `.label`
   - `.categoryWrapper`
   - `.author_prefix`

3. Avoid nesting of elements/classes (it might be better to split nested stuff into its own component). If, however, nesting is required/reasonable to use, class names should follow BEM-style naming, e.g.:
   - `.author` (main element)
   - `.author_prefix`
   - `.author_label`

4. Do not prefix any class names with the component's name (except the color scheme variations).

5. Component's root element should have the class name of `.root`

6. Color scheme Variation declarations should be separated from the class by two underscores, e.g.:
   - `.packageCard__default`
   - `.metaItem__last`
   - `.button__specialGreen`

7. Prop names follow camelCase:
   - `icon`
   - `colorScheme`
   - `downloadCount`

8. color scheme is passed as a prop in the format of:
   - `colorScheme: "default"`
   - `colorScheme: "tertiary"`

9. Style class is selected (based on colorScheme) from the css-module via the `getStyle()` function, like this:
   ```typescript
   const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
        return {
            tertiary: styles.metaItem__tertiary,
            default: styles.metaItem__default,
        }[scheme];
    };
   ```

10. A component should have an interface for the props, like this:
    ```typescript
    export interface MetaItemProps {
      label?: string;
      icon?: ReactNode;
      colorScheme: "default" | "tertiary";
    }
    ```

### Global CSS usage
1. examples of global CSS variable names:
   - `--color-gradient-blue-green--darker`
   - `--font-weight-bold`
   - `--color-cyber-green--70`
   - `--padding-m`

2. When reasonable, don't use the `--size` variables directly, instead proxy them like this:
   - `--padding-s: var(--size-s);`
   - `--border-width-m: var(--size--6xs);`

    Use variables for every value, when reasonable!
