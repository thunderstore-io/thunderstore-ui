import { ThemeProvider, theme, CSSReset } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: any): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
