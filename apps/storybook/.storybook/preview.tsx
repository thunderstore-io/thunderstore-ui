import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import type { Preview } from "@storybook/react-vite";

import { LinkingProvider } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";

import { LinkLibrary } from "../LinkLibrary";
import "./styles.css";

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
    function (Story) {
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
