import { AppProps } from "next/app";
import { LinkingProvider, RootWrapper, theme } from "@thunderstore/components";
import { Dapper, DapperProvider } from "@thunderstore/dapper";

import { SessionProvider } from "components/SessionContext";
import { LinkLibrary } from "LinkLibrary";
import { API_DOMAIN } from "utils/constants";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl:
          process.env.NEXT_PUBLIC_API_URL || "https://thunderstore.io/api/",
      }}
    >
      <SessionProvider>
        <DapperProvider dapper={new Dapper(API_DOMAIN)}>
          <LinkingProvider value={LinkLibrary}>
            <Component {...pageProps} />
          </LinkingProvider>
        </DapperProvider>
      </SessionProvider>
    </RootWrapper>
  );
}

export default MyApp;
