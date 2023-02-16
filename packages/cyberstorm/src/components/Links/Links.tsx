/**
 * Ease-of-use wrapper for links defined in LinkingProvider.tsx. Allows
 * importing link components directly instead of having to manually call
 * useContext. LinkingContext can also be used "manually" if one so
 * wishes.
 */
import React from "react";
import { LinkingContext, LinkLibrary } from "./LinkingProvider";

const wrap = <T extends keyof LinkLibrary>(key: T): LinkLibrary[T] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  return (props: any) => {
    const Links = React.useContext(LinkingContext);
    const Link = Links[key];
    return <Link {...props} />;
  };
};

export const AnonymousLink = wrap("Anonymous");
export const CommunitiesLink = wrap("Communities");
export const CommunityLink = wrap("Community");
export const CommunityPackagesLink = wrap("CommunityPackages");
export const IndexLink = wrap("Index");
export const PackageLink = wrap("Package");
export const PackageDependantsLink = wrap("PackageDependants");
export const PackageUploadLink = wrap("PackageUpload");
export const TeamLink = wrap("Team");
