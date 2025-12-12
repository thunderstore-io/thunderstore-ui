# @thunderstore/cyberstorm-theme

Defines the design tokens, global styles, and theme provider for the Cyberstorm design system.

## Contents

-   **Design Tokens**: Colors, typography, spacing, etc.
-   **Global Styles**: CSS resets and global defaults.
-   **ThemeProvider**: React context provider for theming.

## Usage

Wrap your application in the `ThemeProvider` to apply the Cyberstorm theme.

```tsx
import { ThemeProvider } from "@thunderstore/cyberstorm-theme";

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app code */}
    </ThemeProvider>
  );
}
```
