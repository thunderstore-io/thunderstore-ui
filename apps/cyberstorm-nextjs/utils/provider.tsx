"use client";

import React from "react";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "@thunderstore/ts-api-react";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider
      domain={process.env.NEXT_PUBLIC_API_DOMAIN || "https://thunderstore.io"}
    >
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </SessionProvider>
  );
}

export default Providers;
