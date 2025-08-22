"use client";
/**
 * Ease-of-use wrapper for links defined in LinkingProvider.tsx. Allows
 * importing link components directly instead of having to manually call
 * useContext. LinkingContext can also be used "manually" if one so
 * wishes.
 */
import React, { PropsWithChildren } from "react";
import { LinkingContext, ThunderstoreLinkProps } from "./LinkingProvider";

interface typeWorkaroundProps extends PropsWithChildren {
  community?: string;
  namespace?: string;
  package?: string;
  version?: string;
  team?: string;
  user?: string;
  url?: string;
  wikipageslug?: string;
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
  | "PackageEdit"
  | "PackageRequired"
  | "PackageWiki"
  | "PackageWikiNewPage"
  | "PackageWikiPage"
  | "PackageWikiPageEdit"
  | "PackageChangelog"
  | "PackageVersions"
  | "PackageSource"
  | "PackageDependants"
  | "PackageFormatDocs"
  | "PackageVersion"
  | "PackageUpload"
  | "PrivacyPolicy"
  | "Settings"
  | "SettingsAccount"
  | "Team"
  | "Teams"
  | "TeamSettings"
  | "TeamSettingsMembers"
  | "TeamSettingsServiceAccounts"
  | "TeamSettingsSettings"
  | "TermsOfService"
  | "User";

interface CyberstormLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    ThunderstoreLinkProps,
    typeWorkaroundProps {
  linkId: CyberstormLinkIds;
  className?: string;
  forwardedProps?: object;
}

// TODO: Move to primitives
export const CyberstormLink = React.forwardRef<
  HTMLAnchorElement,
  CyberstormLinkProps
>((props: CyberstormLinkProps, forwardedRef) => {
  const {
    linkId,
    className,
    children,
    url = "",
    community = "",
    namespace = "",
    version = "",
    team = "",
    user = "",
    wikipageslug = "",
    ...forwardedProps
  } = props;
  const fProps =
    forwardedProps as React.AnchorHTMLAttributes<HTMLAnchorElement>;
  const Links = React.useContext(LinkingContext);
  const Link = Links[linkId];
  return (
    <Link
      {...fProps}
      url={url}
      className={className}
      community={community}
      namespace={namespace}
      package={props.package ?? ""}
      version={version}
      team={team}
      user={user}
      wikipageslug={wikipageslug}
      customRef={forwardedRef}
    >
      {children}
    </Link>
  );
});

CyberstormLink.displayName = "CyberstormLink";
