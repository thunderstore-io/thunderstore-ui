import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { theme } from "thunderstore-components";

function MyApp({ Component, pageProps }: any): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
