import { LinkLibrary, ThunderstoreLinkProps } from "@thunderstore/cyberstorm";
import NextLink from "next/link";
import { PropsWithChildren } from "react";
import { getPublicSiteUrl } from "@/config";

interface LinkProps extends PropsWithChildren, ThunderstoreLinkProps {
  queryParams?: string;
  url: string;
}

export const Link = (props: LinkProps): React.ReactElement => {
  const { children, queryParams, url } = props;
  const q = queryParams ? `?${queryParams}` : "";

  return (
    <NextLink href={`${url}${q}`} passHref>
      {children}
    </NextLink>
  );
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Communities: (p) =>
    Link({
      ...p,
      url: `${getPublicSiteUrl()}/communities`,
    }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) =>
    Link({
      ...p,
      url: `${getPublicSiteUrl()}/communities`,
    }), // /communities temporarily the frontpage
  ManifestValidator: (p) =>
    Link({ ...p, url: "/developers/manifest-validator/" }),
  MarkdownPreview: (p) => Link({ ...p, url: "/developers/markdown-preview/" }),
  Package: (p) =>
    Link({ ...p, url: `/c/${p.community}/p/${p.namespace}/${p.package}/` }),
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
  Team: (p) => Link({ ...p, url: `/c/${p.community}/p/${p.team}/` }),
  Teams: (p) => Link({ ...p, url: `/teams/` }),
  TeamSettings: (p) => Link({ ...p, url: `/teams/${p.team}/profile` }),
  TermsOfService: (p) => Link({ ...p, url: "/terms-of-service/" }),
  User: (p) => Link({ ...p, url: `/u/${p.user}/` }),
};

export { library as LinkLibrary };
