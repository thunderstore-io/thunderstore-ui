import { LinkingProvider, RootWrapper, theme } from "@thunderstore/components";
import { LinkLibrary } from "../LinkLibrary";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "thunderstore",
    values: [
      { name: "thunderstore", value: "#242e48" },
      { name: "light", value: "#f8f8f8" },
      { name: "dark", value: "#333" },
    ],
  },
};

export const decorators = [
  (Story) => (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl:
          process.env.NEXT_PUBLIC_API_URL || "https://thunderstore.io/api/",
        useNextJS: false,
      }}
    >
      <LinkingProvider value={LinkLibrary}>
        <Story />
      </LinkingProvider>
    </RootWrapper>
  ),
];
