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
}
