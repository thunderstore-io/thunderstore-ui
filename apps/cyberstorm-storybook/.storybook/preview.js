import { LinkingProvider } from "@thunderstore/components";
import { LinkLibrary } from "../LinkLibrary";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "thunderstore",
    values: [
      { name: "thunderstore", value: "#231F36" },
    ],
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
      <Story />
    </LinkingProvider>
  ),
];
