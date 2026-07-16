import { Outlet } from "react-router";

import { type OutletContextShape } from "../root";
import type { loader } from "./Community";
import "./CommunityPackageListingSubpath.css";

type ResolvedCommunity = Awaited<
  Awaited<ReturnType<typeof loader>>["community"]
>;

type CommunityPageProps = {
  outletContext: OutletContextShape;
};

export function isPackageListingPath(pathname: string) {
  const splitPath = pathname.split("/");
  return splitPath.length > 5 && splitPath[1] === "c" && splitPath[3] === "p";
}

function CommunityPackageListingHeroBackground({
  resolvedCommunity,
}: {
  resolvedCommunity: ResolvedCommunity;
}) {
  return (
    <div className="community__background community__background--packagePage">
      {resolvedCommunity.hero_image_url ? (
        <div className="community__background-image">
          <img
            src={resolvedCommunity.hero_image_url}
            alt={resolvedCommunity.name}
          />
        </div>
      ) : null}
    </div>
  );
}

// The community hero banner for package pages. Rendered by each package page in
// the content column of its grid (see packageListing/packageListingVersion/
// Dependants), NOT here in the community layout, so it lines up with the content
// and the sidebar sits beside it instead of the banner spanning both. Returns
// null when the community has no hero image.
export function CommunityPackageListingHeader({
  resolvedCommunity,
}: {
  resolvedCommunity: ResolvedCommunity;
}) {
  if (!resolvedCommunity.hero_image_url) {
    return null;
  }

  return (
    <div className="community__header community__header--compact">
      <CommunityPackageListingHeroBackground
        resolvedCommunity={resolvedCommunity}
      />
    </div>
  );
}

export function CommunityPackageListingPage({
  outletContext,
}: CommunityPageProps) {
  // No wrapper element: package listing pages place their pieces directly into
  // the layout grid (see .layout__main--package-detail in layout.css), so an
  // intermediate box would break it. Dependants renders its own <Page>.
  return <Outlet context={outletContext} />;
}
