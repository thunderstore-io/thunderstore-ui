// `@layer` order — must precede package stylesheets (first-encounter wins).
import "./styles.css";

import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
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

// Composition stories do not import the package barrel, which is what normally
// turns this off. Font Awesome's injected rules size every icon to 1em by
// 1.25em and beat the component sizes.
fontAwesomeConfig.autoAddCss = false;

const preview: Preview = {
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
      const story = sideBySide ? (
        <Story />
      ) : (
        <div className="cs-story-frame" data-cs-theme="on">
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
