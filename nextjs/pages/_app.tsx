import { AppProps } from "next/dist/next-server/lib/router/router";
import { RootWrapper, theme } from "thunderstore-components";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl: "http://localhost/api/",
      }}
    >
      <Component {...pageProps} />
    </RootWrapper>
  );
}

export default MyApp;
