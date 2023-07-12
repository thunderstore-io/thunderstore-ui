"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "./SessionContext";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <QueryClientProvider client={client}>
      <SessionProvider>
        <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
