// Temporary solution for implementing ads

import { AdContainer } from "@thunderstore/cyberstorm";
import { memo, useEffect, useRef } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

export const adContainerIds = [
  "right-column-1",
  "right-column-2",
  "right-column-3",
];

// REMIX TODO: Move to dynamic html
export function AdsInit() {
  const isHydrated = useHydrated();
  const startsHydrated = useRef(isHydrated);

  // This will be loaded 2 times in development because of:
  // https://react.dev/reference/react/StrictMode
  // If strict mode is removed from the entry.client.tsx, this should only run once
  useEffect(() => {
    if (!startsHydrated.current && isHydrated) return;
    if (
      typeof window !== "undefined" &&
      typeof window.nitroAds === "undefined"
    ) {
      const $script = document.createElement("script");
      $script.src = "https://s.nitropay.com/ads-785.js";
      $script.setAttribute("async", "true");
      $script.setAttribute("data-log-level", "silent");

      document.body.append($script);

      return () => $script.remove();
    }
  }, []);

  const nitroAds = typeof window !== "undefined" ? window.nitroAds : undefined;
  useEffect(() => {
    if (nitroAds !== undefined && nitroAds.createAd !== undefined) {
      adContainerIds.forEach((cid) => {
        nitroAds.createAd(cid, {
          demo: false,
          format: "display",
          refreshLimit: 0,
          refreshTime: 30,
          renderVisibleOnly: true,
          refreshVisibleOnly: true,
          sizes: [["300", "250"]],
          report: {
            enabled: true,
            wording: "Report Ad",
            position: "bottom-right",
          },
          mediaQuery: "(min-width: 1475px) and (min-height: 400px)",
        });
      });
    }
  }, [nitroAds]);

  return <></>;
}

export const Ads = memo(function Ads({ shouldShow }: { shouldShow: boolean }) {
  if (!shouldShow) return null;

  return (
    <div className="container container--y island-item layout__ads">
      <div className="container container--y layout__ads-inner">
        {adContainerIds.map((cid, k_i) => (
          <AdContainer key={k_i} containerId={cid} />
        ))}
      </div>
    </div>
  );
});
