# Cyberstorm UI library

## Storybook

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
provides a sandbox to build UI components in isolation, without having to start
up the whole service stack. Additionally it showcases the existing components,
promoting reusability.

To start Cyberstorm Storybook, run `yarn workspace @thunderstore/cyberstorm-storybook storybook`.

Storybook can then be accessed at [http://localhost:6006/].

## Naming conventions

### Basic information

CSS ClassNames should follow camelCase format, e.g.:

- `.root`
- `.label`
- `.categoryWrapper`

Variation declarations should be separated from the class by two underscores, e.g.:

- `.packageCard__default`
- `.metaItem__last`
- `.button__specialGreen`

Component's root element should have the class name of `.root`


Variations are passed as props in the format of:
- `tagStyle: "default"`
- `metaItemStyle: "tertiary"`
- `buttonStyle: "specialGreen"`

and selected from the css-module via the `getStyle()` function, such as:
```typescript
function getStyle(style: string) {
  switch (style) {
    case "tertiary":
      return styles.metaItem__tertiary;
    case "default":
    default:
      return styles.metaItem__default;
  }
}
```

Prop names follow pascalCase:
- `icon`
- `metaItemStyle`
- `downloadCount`

```typescript
export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  metaItemStyle: "default" | "tertiary";
}
```


### Global CSS classes
examples of global CSS variable names:
- `--color-gradient-blue-green--darker`
- `--font-weight-bold`
- `--color-cyber-green--70`
- `--padding-m`

When reasonable, don't use the `--size` variables directly, instead proxy them like this:
- `--padding-s: var(--size--s);`
- `--border-width-m: var(--size--xxxxxxs);`

Use variables for every value, when reasonable!
