import { useEffect } from "react";

import { AdContainer } from "@thunderstore/cyberstorm";

import {
  type RenderedAdSlot,
  createPageScopedAd,
  removePageScopedAd,
  whenNitroAdsReady,
} from "./nitroAds";

/**
 * A page-scoped 300×250 sidebar ad — mounted by the community filter sidebar and
 * the package listing sidebar. The layout-level rail/bottom/floating slots live in the root
 * layout and are created once by createAllNimbusAds; a sidebar slot's container
 * only exists on its page, so it's created here on mount — once the NitroPay
 * script is ready — and freed on unmount. The AdContainer reserves the box and
 * shows the house fallback while unfilled.
 */
export function SidebarAd({ slot }: { slot: RenderedAdSlot }) {
  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    // Aborting on unmount drops the readiness waiter (and releases this closure)
    // so a blocked NitroPay script can't accumulate waiters across navigations.
    const readyController = new AbortController();

    // The script can still be loading when this mounts (direct entry / a nav
    // from an ad-free route), so wait for the ref instead of reading it now.
    whenNitroAdsReady(readyController.signal).then((nitroAds) => {
      if (cancelled || !nitroAds) {
        return;
      }
      // Defer the auction to idle so it doesn't contend with hydration, matching
      // the layout ads (AdsInit). StrictMode runs this effect twice in dev; the
      // first pass's cleanup sets `cancelled` before its resolved callback fires,
      // so the slot is created exactly once.
      const create = () => createPageScopedAd(nitroAds, slot);
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(create, { timeout: 2000 });
      } else {
        timeoutHandle = setTimeout(create, 200);
      }
    });

    return () => {
      cancelled = true;
      readyController.abort();
      if (idleHandle !== undefined) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
      // Leaving the page unmounts the container; drop the slot's refs (NitroPay
      // frees the div itself).
      removePageScopedAd(slot);
    };
  }, [slot]);

  return (
    <AdContainer
      containerId={slot.containerId}
      sizeVariant={slot.sizeVariant}
    />
  );
}

SidebarAd.displayName = "SidebarAd";
