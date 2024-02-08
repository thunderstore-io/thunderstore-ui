"use client";

import React from "react";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "@thunderstore/ts-api-react";
import { API_DOMAIN } from "./constants";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider domain={API_DOMAIN}>
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </SessionProvider>
  );
}

export default Providers;
