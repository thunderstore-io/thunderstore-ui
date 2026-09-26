// `@layer` order — must precede package stylesheets (first-encounter wins).
import "./styles.css";

import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import type { Preview } from "@storybook/react-vite";

// Source stylesheets, not the built dist bundles. A theme change is then a
// preview dependency (every captured story), and a single component stylesheet
// is only pulled in by the composition that imports that module.
import "../../../packages/cyberstorm-theme/src/index.css";
import "../../../packages/cyberstorm-theme/src/styles/fonts.css";
import { LinkingProvider } from "../../../packages/cyberstorm/src/components/Links/LinkingProvider";
import "../../../packages/cyberstorm/src/defaults.css";
import { LinkLibrary } from "../LinkLibrary";

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
  },
  decorators: [
    function ThemeDecorator(Story, context) {
      const sideBySide = Boolean(
        (context.parameters as { csSideBySide?: boolean }).csSideBySide
      );
      const enabled = context.globals.csTheme !== "off";
      const story = sideBySide ? (
        <Story />
      ) : (
        <div className="cs-story-frame" data-cs-theme={enabled ? "on" : "off"}>
          <Story />
        </div>
      );
      return (
        <LinkingProvider value={LinkLibrary}>
          <RadixTooltip delayDuration={80}>{story}</RadixTooltip>
        </LinkingProvider>
      );
    },
  ],
};

export default preview;
