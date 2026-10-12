import { useEffect } from "react";
import { useLocation } from "react-router";

import { AdContainer } from "@thunderstore/cyberstorm";

import { AdErrorBoundary } from "./AdErrorBoundary";
import {
  type RenderedAdSlot,
  adPlacementKey,
  createNimbusPageScopedAd,
} from "./nitroAds";
import { isStaticAdPath, staticAdForSlot } from "./staticAds";
import { useAdPageview } from "./useAdPageview";

// A page-scoped sidebar ad, re-created on every page change (useAdPageview).
export function SidebarAd({ slot }: { slot: RenderedAdSlot }) {
  const { pathname } = useLocation();
  const pageview = useAdPageview();
  const isStatic = isStaticAdPath(pathname);
  const staticAd = isStatic ? staticAdForSlot(slot, pathname) : undefined;

  useEffect(() => {
    if (isStatic) {
      return;
    }
    return createNimbusPageScopedAd(slot);
  }, [slot, isStatic, pageview]);

  return (
    <AdErrorBoundary placement={adPlacementKey(slot.containerId)}>
      <AdContainer
        containerId={slot.containerId}
        sizeVariant={slot.sizeVariant}
        mountKey={pageview}
        directlySold={isStatic}
        staticAd={staticAd}
      />
    </AdErrorBoundary>
  );
}

SidebarAd.displayName = "SidebarAd";
