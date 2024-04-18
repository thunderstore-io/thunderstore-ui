"use client";

import React, { useState } from "react";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { SessionProvider } from "@thunderstore/ts-api-react";
import { getPublicApiDomain } from "@/config";
import { AdProvider } from "./adProvider";
import Script from "next/script";

function Providers({ children }: React.PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SessionProvider domain={getPublicApiDomain()}>
      <LinkingProvider value={LinkLibrary}>
        <Script
          id="nitroAds"
          src="https://s.nitropay.com/ads-785.js"
          onReady={() => {
            setIsLoaded(true);
          }}
        />
        <AdProvider value={isLoaded}>{children}</AdProvider>
      </LinkingProvider>
    </SessionProvider>
  );
}

export default Providers;
