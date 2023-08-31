"use client";

import React from "react";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "./SessionContext";

function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
    </SessionProvider>
  );
}

export default Providers;
