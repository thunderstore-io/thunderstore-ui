import React from "react";
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
    values: [{ name: "thunderstore", value: "var(--color-surface--0)" }],
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
    return (
      <LinkingProvider value={LinkLibrary}>
        <CyberstormProviders>
          <SessionProvider>
            <Substack>
              <Story />
            </Substack>
          </SessionProvider>
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
