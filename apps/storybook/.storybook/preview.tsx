import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import type { Preview } from "@storybook/react-vite";
import { type PropsWithChildren, useEffect } from "react";

import { LinkingProvider } from "@thunderstore/cyberstorm";
// The theme is loaded as a *toggleable* stylesheet (see the "Theme" toolbar
// control) rather than a static import, so stories can be viewed with the
// theme on (production look) or off (barebones @thunderstore/cyberstorm only).
import themeHref from "@thunderstore/cyberstorm-theme/css?url";
import "@thunderstore/cyberstorm-theme/fonts.css";
import "@thunderstore/cyberstorm/css";

import { LinkLibrary } from "../LinkLibrary";
import { allModes } from "./modes";
import "./styles.css";

const THEME_LINK_ID = "cs-theme";

/**
 * Inject a single <link> for the cyberstorm-theme stylesheet and flip its
 * `disabled` flag from the toolbar global. Disabling the link drops every
 * `@layer cyberstorm-theme` rule, leaving only `@layer cyberstorm` (the
 * barebones component library) in effect.
 */
function ThemeToggle({
  enabled,
  children,
}: PropsWithChildren<{ enabled: boolean }>) {
  useEffect(() => {
    let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = THEME_LINK_ID;
      link.rel = "stylesheet";
      link.href = themeHref;
      document.head.appendChild(link);
    }
    link.disabled = !enabled;
  }, [enabled]);

  return <>{children}</>;
}

export const globalTypes = {
  theme: {
    description: "Toggle @thunderstore/cyberstorm-theme on/off",
    defaultValue: "on",
    toolbar: {
      title: "Theme",
      icon: "paintbrush",
      items: [
        { value: "on", title: "Theme on" },
        { value: "off", title: "Theme off (barebones)" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Snapshot every story in both theme states so Chromatic gates the themed
    // (production) look AND the barebones no-theme render. See modes.ts.
    chromatic: {
      modes: {
        themed: allModes.themed,
        barebones: allModes.barebones,
      },
    },
  },
  decorators: [
    function ThemeDecorator(Story, context) {
      return (
        <ThemeToggle enabled={context.globals.theme !== "off"}>
          <LinkingProvider value={LinkLibrary}>
            <RadixTooltip delayDuration={80}>
              <Story />
            </RadixTooltip>
          </LinkingProvider>
        </ThemeToggle>
      );
    },
  ],
};

export default preview;
