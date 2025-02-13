import React from "react";

import "./storybook.css";
import { CyberstormProviders, LinkingProvider } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-theme";
import { LinkLibrary } from "../LinkLibrary";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "thunderstore",
    values: [{ name: "thunderstore", value: "var(--body-bg-color)" }],
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
          <Story />
        </CyberstormProviders>
      </LinkingProvider>
    );
  },
];
export const tags = ["autodocs", "autodocs"];
