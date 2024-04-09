"use client";

import React from "react";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "@thunderstore/ts-api-react";
import { getPublicApiUrl } from "@/config";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider domain={getPublicApiUrl()}>
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </SessionProvider>
  );
}

export default Providers;
