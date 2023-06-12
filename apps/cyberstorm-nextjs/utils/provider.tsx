"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { Dapper, DapperProvider } from "@thunderstore/dapper/src";
import { SessionProvider, useSession } from "./SessionContext";
import { API_DOMAIN } from "./constants";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>
        <Substack>{children}</Substack>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function Substack({ children }: React.PropsWithChildren): JSX.Element {
  const { sessionId } = useSession();
  const dapper = new Dapper(API_DOMAIN, sessionId);

  return (
    <DapperProvider dapper={dapper}>
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </DapperProvider>
  );
}

export default Providers;
