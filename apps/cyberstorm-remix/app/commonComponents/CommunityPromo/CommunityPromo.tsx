import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

import { NewLink, NewTag, classnames } from "@thunderstore/cyberstorm";

import "./CommunityPromo.css";

type CommunityPromoVariant = "bar" | "pill";

interface PromoContent {
  href: string;
  copy: string;
  tag: string;
}

interface CommunityPromoConfig {
  bar: PromoContent;
  pill: PromoContent;
}

/**
 * Hard-coded DatHost affiliate promos, gated by community identifier.
 *
 * Adding another community is a one-line data change here — there is no backend
 * for this yet. (The live Django site drives the equivalent placements through
 * DynamicHTML entries that `require_communities`; Nimbus has no such API.)
 */
const COMMUNITY_PROMOS: Record<string, CommunityPromoConfig> = {
  // For local testing, point this key at a seeded community (e.g.
  // "test-community-1") — remember to flip it back before committing.
  valheim: {
    // Community landing, between the header and the package search (≤90 chars).
    bar: {
      href: "https://dathost.net/r/thunderstore2026/valheim?c=21631a00",
      copy: "DatHost Valheim server hosting",
      tag: "30% off!",
    },
    // Package sidebar, between the actions and the meta table (≤30 chars).
    pill: {
      href: "https://dathost.net/r/thunderstore2026/valheim?c=8913193b",
      copy: "DatHost Valheim hosting",
      tag: "30% off!",
    },
  },
};

// Own-property check (not `in` / bare indexing): community identifiers come
// from URLs and API data, so ids colliding with Object.prototype members
// (e.g. "constructor") must not resolve to inherited values and crash the
// page. Uses the hasOwnProperty.call pattern (as publicEnvVariables.ts does)
// rather than Object.hasOwn, which older browsers lack and esbuild does not
// polyfill.
function getPromoConfig(
  communityId?: string
): CommunityPromoConfig | undefined {
  // The same kill switch that hides the NitroPay slots (see root.tsx) also
  // hides this affiliate placement, so VITE_DISABLE_ADS=true environments
  // (tests, local dev) render genuinely ad-free pages. Checked here in the
  // shared gate so communityHasPromo — which drives the community page's
  // promo grid row — can never disagree with what CommunityPromo renders.
  // Both SSR and the client read the same value (process.env vs the
  // loader-serialized NIMBUS_PUBLIC_ENV), so this cannot cause a hydration
  // mismatch.
  const adsDisabled =
    getPublicEnvVariables(["VITE_DISABLE_ADS"]).VITE_DISABLE_ADS === "true";
  if (adsDisabled) {
    return undefined;
  }
  return communityId &&
    Object.prototype.hasOwnProperty.call(COMMUNITY_PROMOS, communityId)
    ? COMMUNITY_PROMOS[communityId]
    : undefined;
}

export function communityHasPromo(communityId?: string): boolean {
  return getPromoConfig(communityId) !== undefined;
}

interface CommunityPromoProps {
  variant: CommunityPromoVariant;
  communityId?: string;
}

export function CommunityPromo(props: CommunityPromoProps) {
  const { variant, communityId } = props;
  // getPromoConfig also applies the VITE_DISABLE_ADS kill switch.
  const config = getPromoConfig(communityId);

  if (!config) {
    return null;
  }

  const { href, copy, tag } = config[variant];

  return (
    <NewLink
      primitiveType="link"
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      rootClasses={classnames("community-promo", `community-promo--${variant}`)}
    >
      {/* Pinned over the container's top-left corner, per the Figma spec. */}
      <span className="community-promo__label">AD</span>
      <span className="community-promo__copy">{copy}</span>
      <NewTag
        csSize="xsmall"
        csVariant="green"
        rootClasses="community-promo__deal"
      >
        {tag}
      </NewTag>
    </NewLink>
  );
}
