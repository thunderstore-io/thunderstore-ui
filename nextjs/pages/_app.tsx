import { AppProps } from "next/app";
import { RootWrapper, theme } from "thunderstore-components";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl:
          process.env.NEXT_PUBLIC_API_URL || "https://thunderstore.io/api/",
      }}
    >
      <Component {...pageProps} />
    </RootWrapper>
  );
}

export default MyApp;
