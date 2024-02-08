import React from "react";

import {
  LinkingProvider,
  CyberstormProviders,
  Footer,
  Header,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";
import { DapperProvider } from "@thunderstore/dapper";
import { DapperFake } from "@thunderstore/dapper-fake";
import { LinkLibrary } from "../LinkLibrary";
import { SessionProvider } from "../SessionContext";
// import styles from "../../cyberstorm-nextjs/app/RootLayout.module.css";

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
    return (
      <LinkingProvider value={LinkLibrary}>
        <CyberstormProviders>
          <SessionProvider>
            <DapperProvider dapperConstructor={() => new DapperFake()}>
              <LinkingProvider value={LinkLibrary}>
                {/* <div className={styles.root}>
                  <Header />
                  <Story />
                  <Footer />
                </div> */}
                <Story />
              </LinkingProvider>
            </DapperProvider>
          </SessionProvider>
        </CyberstormProviders>
      </LinkingProvider>
    );
  },
];
