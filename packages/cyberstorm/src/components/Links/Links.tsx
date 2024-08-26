"use client";
/**
 * Ease-of-use wrapper for links defined in LinkingProvider.tsx. Allows
 * importing link components directly instead of having to manually call
 * useContext. LinkingContext can also be used "manually" if one so
 * wishes.
 */
import React, { PropsWithChildren } from "react";
import {
  LinkingContext,
  LinkLibrary,
  ThunderstoreLinkProps,
} from "./LinkingProvider";

const wrap = <T extends keyof LinkLibrary>(
  key: T,
  className?: string,
  ref?: React.ForwardedRef<HTMLAnchorElement>,
  forwardedProps?: object
): LinkLibrary[T] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  return (props: any) => {
    const Links = React.useContext(LinkingContext);
    const Link = Links[key];
    return (
      <Link
        {...props}
        className={className}
        forwardedProps={forwardedProps}
        ref={ref}
      />
    );
  };
};

interface typeWorkaroundProps extends PropsWithChildren {
  community?: string;
  namespace?: string;
  package?: string;
  version?: string;
  team?: string;
  user?: string;
  url?: string;
}

export type CyberstormLinkIds =
  | "Anonymous"
  | "Communities"
  | "Community"
  | "CommunityPackages"
  | "Index"
  | "ManifestValidator"
  | "MarkdownPreview"
  | "Package"
  | "PackageWiki"
  | "PackageChangelog"
  | "PackageVersions"
  | "PackageSource"
  | "PackageDependants"
  | "PackageFormatDocs"
  | "PackageVersion"
  | "PackageUpload"
  | "PrivacyPolicy"
  | "Settings"
  | "Team"
  | "Teams"
  | "TeamSettings"
  | "TeamSettingsMembers"
  | "TeamSettingsServiceAccounts"
  | "TeamSettingsSettings"
  | "TermsOfService"
  | "User";

interface CyberstormLinkProps
  extends ThunderstoreLinkProps,
    typeWorkaroundProps {
  linkId: CyberstormLinkIds;
  className?: string;
  forwardedProps?: object;
  ref?: React.ForwardedRef<HTMLAnchorElement>;
}

// This exists for typescripts type checking.
// And partly because I couldn't be bothered to figure out how to correctly structure the types
function typeWorkaround(props: typeWorkaroundProps) {
  return {
    children: props.children,
    url: props.url ? props.url : "",
    community: props.community ? props.community : "",
    namespace: props.namespace ? props.namespace : "",
    package: props.package ? props.package : "",
    version: props.version ? props.version : "",
    team: props.team ? props.team : "",
    user: props.user ? props.user : "",
  };
}

export function CyberstormLink(props: CyberstormLinkProps) {
  const { linkId, className, forwardedProps, ref, ...remainingProps } = props;
  const LinkGen = wrap(linkId, className, ref, forwardedProps);
  return LinkGen(typeWorkaround(remainingProps));
}
