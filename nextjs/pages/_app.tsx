import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { theme, ThunderstoreProvider } from "thunderstore-components";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ThunderstoreProvider
        value={{
          apiUrl: "http://localhost/api/",
          apiToken: null,
        }}
      >
        <Component {...pageProps} />
      </ThunderstoreProvider>
    </ChakraProvider>
  );
}

export default MyApp;
