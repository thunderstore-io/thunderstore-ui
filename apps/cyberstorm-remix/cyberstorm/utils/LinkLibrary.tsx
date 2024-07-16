import { LinkLibrary, ThunderstoreLinkProps } from "@thunderstore/cyberstorm";
import { Link as RemixLink } from "@remix-run/react";
import { PropsWithChildren } from "react";

interface LinkProps extends PropsWithChildren, ThunderstoreLinkProps {
  className?: string;
  queryParams?: string;
  url: string;
  forwardedProps?: object;
  ref?: React.ForwardedRef<HTMLAnchorElement>;
}

export const Link = (props: LinkProps): React.ReactElement => {
  const { children, queryParams, className, url, forwardedProps, ref } = props;
  const q = queryParams ? `?${queryParams}` : "";

  return (
    <RemixLink
      to={`${url}${q}`}
      // passHref
      {...forwardedProps}
      className={className}
      ref={ref}
    >
      {children}
    </RemixLink>
  );
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Communities: (p) =>
    Link({
      ...p,
      url: "/communities",
    }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) =>
    Link({
      ...p,
      url: "/communities",
    }), // /communities temporarily the frontpage
  ManifestValidator: (p) =>
    Link({ ...p, url: "/developers/manifest-validator/" }),
  MarkdownPreview: (p) => Link({ ...p, url: "/developers/markdown-preview/" }),
  Package: (p) =>
    Link({ ...p, url: `/c/${p.community}/p/${p.namespace}/${p.package}/` }),
  PackageWiki: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/wiki`,
    }),
  PackageChangelog: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/changelog`,
    }),
  PackageVersions: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/versions`,
    }),
  PackageSource: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/source`,
    }),
  PackageDependants: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/dependants/`,
    }),
  PackageFormatDocs: (p) =>
    Link({ ...p, url: "/developers/package-format-docs/" }),
  PackageVersion: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/v/${p.version}/`,
    }),
  PackageUpload: (p) => Link({ ...p, url: "/developers/upload-package/" }),
  PrivacyPolicy: (p) => Link({ ...p, url: "/privacy-policy/" }),
  Settings: (p) => Link({ ...p, url: `/settings/` }),
  SettingsAccount: (p) => Link({ ...p, url: `/settings/account/` }),
  Team: (p) => Link({ ...p, url: `/c/${p.community}/p/${p.team}/` }),
  Teams: (p) => Link({ ...p, url: `/teams/` }),
  TeamSettings: (p) => Link({ ...p, url: `/teams/${p.team}` }),
  TeamSettingsMembers: (p) => Link({ ...p, url: `/teams/${p.team}/members` }),
  TeamSettingsServiceAccounts: (p) =>
    Link({ ...p, url: `/teams/${p.team}/service-accounts` }),
  TeamSettingsSettings: (p) => Link({ ...p, url: `/teams/${p.team}/settings` }),
  TermsOfService: (p) => Link({ ...p, url: "/terms-of-service/" }),
  User: (p) => Link({ ...p, url: `/u/${p.user}/` }),
};

export { library as LinkLibrary };
