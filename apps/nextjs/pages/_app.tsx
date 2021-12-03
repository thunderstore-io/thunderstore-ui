import { AppProps } from "next/app";
import { RootWrapper, theme } from "@thunderstore/components";
import { LinkingProvider } from "@thunderstore/components";
import { LinkLibrary } from "../LinkLibrary";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl:
          process.env.NEXT_PUBLIC_API_URL || "https://thunderstore.io/api/",
      }}
    >
      <LinkingProvider value={LinkLibrary}>
        <Component {...pageProps} />
      </LinkingProvider>
    </RootWrapper>
  );
}

export default MyApp;
