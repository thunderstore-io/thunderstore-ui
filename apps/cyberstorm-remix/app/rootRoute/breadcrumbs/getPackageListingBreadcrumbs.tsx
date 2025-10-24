import { NewBreadCrumbsLink } from "@thunderstore/cyberstorm";
import { type UIMatch } from "react-router";

export function getPackageListingBreadcrumb(
  packageListingPage: UIMatch | undefined,
  packageEditPage: UIMatch | undefined,
  packageDependantsPage: UIMatch | undefined
) {
  if (!packageListingPage && !packageEditPage && !packageDependantsPage)
    return null;
  return (
    <>
      {packageListingPage ? (
        <span>
          <span>{packageListingPage.params.packageId}</span>
        </span>
      ) : null}
      {packageEditPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageEditPage.params.communityId}
          namespace={packageEditPage.params.namespaceId}
          package={packageEditPage.params.packageId}
          csVariant="cyber"
        >
          {packageEditPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
      {packageDependantsPage ? (
        <NewBreadCrumbsLink
          primitiveType="cyberstormLink"
          linkId="Package"
          community={packageDependantsPage.params.communityId}
          namespace={packageDependantsPage.params.namespaceId}
          package={packageDependantsPage.params.packageId}
          csVariant="cyber"
        >
          {packageDependantsPage.params.packageId}
        </NewBreadCrumbsLink>
      ) : null}
    </>
  );
}
