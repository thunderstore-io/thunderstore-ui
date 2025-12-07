import { NewBreadCrumbsLink } from "@thunderstore/cyberstorm";
import { type UIMatch } from "react-router";

export function getPackageVersionBreadcrumbs(
  packageVersionPage: UIMatch | undefined,
  packageVersionWithoutCommunityPage: UIMatch | undefined
) {
  if (!packageVersionPage && !packageVersionWithoutCommunityPage) return null;
  return (
    <>
      {/* Package Version Page */}
      {packageVersionPage ? (
        <>
          <NewBreadCrumbsLink
            primitiveType="cyberstormLink"
            linkId="Package"
            community={packageVersionPage.params.communityId}
            namespace={packageVersionPage.params.namespaceId}
            package={packageVersionPage.params.packageId}
            csVariant="cyber"
          >
            {packageVersionPage.params.packageId}
          </NewBreadCrumbsLink>
          <span>
            <span>{packageVersionPage.params.packageVersion}</span>
          </span>
        </>
      ) : null}
      {/* Package version without community Page */}
      {packageVersionWithoutCommunityPage ? (
        <>
          <span>
            <span>{packageVersionWithoutCommunityPage.params.namespaceId}</span>
          </span>
          <span>
            <span>{packageVersionWithoutCommunityPage.params.packageId}</span>
          </span>
          <span>
            <span>
              {packageVersionWithoutCommunityPage.params.packageVersion}
            </span>
          </span>
        </>
      ) : null}
    </>
  );
}
