// `@layer` order — must precede package stylesheets (first-encounter wins).
import "./styles.css";

import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import type { Preview } from "@storybook/react-vite";
import { useLayoutEffect } from "react";

import { LinkingProvider } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme/css";
import "@thunderstore/cyberstorm-theme/fonts.css";
import "@thunderstore/cyberstorm/css";

import { LinkLibrary } from "../LinkLibrary";
import { allModes } from "./modes";

function applyCsTheme(enabled: boolean) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.csTheme = enabled ? "on" : "off";
}

const preview: Preview = {
  globalTypes: {
    csTheme: {
      description: "Toggle @thunderstore/cyberstorm-theme on/off",
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
  },
  initialGlobals: {
    csTheme: "on",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chromatic: {
      modes: {
        themed: allModes.themed,
        barebones: allModes.barebones,
      },
    },
  },
  decorators: [
    function ThemeDecorator(Story, context) {
      const enabled = context.globals.csTheme !== "off";
      applyCsTheme(enabled);
      useLayoutEffect(() => {
        applyCsTheme(enabled);
      }, [enabled]);
      return (
        <LinkingProvider value={LinkLibrary}>
          <RadixTooltip delayDuration={80}>
            <Story />
          </RadixTooltip>
        </LinkingProvider>
      );
    },
  ],
};

export default preview;
