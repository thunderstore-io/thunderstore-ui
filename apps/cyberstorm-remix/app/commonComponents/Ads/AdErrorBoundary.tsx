import * as Sentry from "@sentry/react-router";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface AdErrorBoundaryProps {
  // Stable placement key → Sentry fingerprint ["ad-container", placement], so
  // every render error from this placement groups into ONE issue and different
  // placements stay separate. The side rail passes a single key ("rail") to
  // cover all its size-tier containers; the sidebars derive one per page via
  // adPlacementKey (see nitroAds.ts / root.tsx).
  placement: string;
  children: ReactNode;
}

interface AdErrorBoundaryState {
  hasError: boolean;
}

/**
 * Isolates an ad placement so a render error in an AdContainer (or the SidebarAd
 * around it) can't bubble to the route error boundary and replace the whole page
 * with an error screen — the ads collapse to nothing and the rest of the page
 * keeps working. The error is reported to Sentry fingerprinted by `placement`,
 * so ad failures are observable per placement without one broken ad taking down
 * browsing.
 *
 * Scope: catches React RENDER errors only. The async slot-creation / refresh
 * path (nitroAds.ts) runs off the render tree in idle callbacks and is guarded
 * there; NitroPay mounts creatives via direct DOM outside React, so ad-SERVING
 * failures never reach this boundary (and ad-network script errors are already
 * dropped in sentry.ts beforeSend).
 */
export class AdErrorBoundary extends Component<
  AdErrorBoundaryProps,
  AdErrorBoundaryState
> {
  static displayName = "AdErrorBoundary";

  state: AdErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AdErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { placement } = this.props;

    // Match RouteErrorBoundary: log in dev, report in prod (Sentry is inert in
    // dev builds anyway).
    if (!import.meta.env.PROD) {
      console.error(`Ad placement "${placement}" render error`, error);
      return;
    }

    Sentry.captureException(error, {
      fingerprint: ["ad-container", placement],
      tags: { ad_placement: placement },
      contexts: {
        adErrorBoundary: {
          placement,
          componentStack: info.componentStack,
        },
      },
    });
  }

  render(): ReactNode {
    // On error the placement renders nothing; the reserved ad-gutter/box space is
    // owned by layout.css, not this element, so the surrounding layout holds.
    return this.state.hasError ? null : this.props.children;
  }
}
