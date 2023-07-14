import { AppProps } from "next/app";
import { LinkingProvider, RootWrapper, theme } from "@thunderstore/components";
import { Dapper, DapperProvider } from "@thunderstore/dapper";

import { SessionProvider } from "components/SessionContext";
import { LinkLibrary } from "LinkLibrary";
import { API_DOMAIN } from "utils/constants";

export default function ThunderstoreApp(appProps: AppProps): JSX.Element {
  return (
    <RootWrapper
      theme={theme}
      thunderstoreProviderValue={{
        apiUrl:
          process.env.NEXT_PUBLIC_API_URL || "https://thunderstore.io/api/",
      }}
    >
      <SessionProvider>
        <Substack {...appProps} />
      </SessionProvider>
    </RootWrapper>
  );
}

function Substack({ Component, pageProps }: AppProps): JSX.Element {
  // const { sessionId } = useSession();
  // const dapper = new Dapper(API_DOMAIN, sessionId);
  const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      <LinkingProvider value={LinkLibrary}>
        <Component {...pageProps} />
      </LinkingProvider>
    </DapperProvider>
  );
}
