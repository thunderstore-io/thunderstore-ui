import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { LinkLibrary } from "../LinkLibrary";
import { LinkingProvider, CyberstormProviders } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";
import { DapperProvider } from "@thunderstore/dapper/src";
import { SessionProvider } from "../SessionContext";
import { DummyDapper } from "@thunderstore/dapper/src/implementations/dummy/DummyDapper";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "thunderstore",
    values: [{ name: "thunderstore", value: "var(--color-background)" }],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: "fullscreen",
};

export const decorators = [
  function (Story) {
    const [client] = React.useState(
      new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
    );

    return (
      <LinkingProvider value={LinkLibrary}>
        <CyberstormProviders>
          <QueryClientProvider client={client}>
            <SessionProvider>
              <Substack>
                <Story />
              </Substack>
            </SessionProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </CyberstormProviders>
      </LinkingProvider>
    );
  },
];

function Substack({ children }) {
  const dapperConstructor = () => new DummyDapper();
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </DapperProvider>
  );
}
