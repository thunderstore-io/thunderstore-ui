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

export const decorators = [(Story) => <Story />];
