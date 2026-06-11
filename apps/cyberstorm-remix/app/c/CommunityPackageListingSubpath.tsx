import { Page } from "app/commonComponents/Page/Page";
import { Suspense } from "react";
import { Await, Outlet } from "react-router";

import { type OutletContextShape } from "../root";
import type { clientLoader, loader } from "./Community";
import "./CommunityPackageListingSubpath.css";

type ResolvedCommunity = Awaited<
  Awaited<ReturnType<typeof loader>>["community"]
>;

type CommunityPageProps = {
  community:
    | Awaited<ReturnType<typeof loader>>["community"]
    | Awaited<ReturnType<typeof clientLoader>>["community"];
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

function CommunityPackageListingHeader({
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
  community,
  outletContext,
}: CommunityPageProps) {
  return (
    <Page rootClasses="community community--packageListingSubpath">
      <Suspense fallback={null}>
        <Await resolve={community}>
          {(resolvedCommunity) => (
            <CommunityPackageListingHeader
              resolvedCommunity={resolvedCommunity}
            />
          )}
        </Await>
      </Suspense>
      <Outlet context={outletContext} />
    </Page>
  );
}
