import { LinkLibrary } from "../LinkLibrary";
import { LinkingProvider, CyberstormProviders } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "thunderstore",
    values: [{ name: "thunderstore", value: "var(--color-surface--0)" }],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <LinkingProvider value={LinkLibrary}>
      <CyberstormProviders>
        <Story />
      </CyberstormProviders>
    </LinkingProvider>
  ),
];
