import { LinkLibrary, ThunderstoreLinkProps } from "@thunderstore/cyberstorm";
import NextLink from "next/link";
import { PropsWithChildren } from "react";

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
  Communities: (p) => Link({ ...p, url: "/communities/" }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) => Link({ ...p, url: "/" }),
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
  PackageUpload: (p) => Link({ ...p, url: "/developers/upload-package/" }),
  PrivacyPolicy: (p) => Link({ ...p, url: "/privacy-policy/" }),
  Settings: (p) => Link({ ...p, url: `/settings/` }),
  Team: (p) => Link({ ...p, url: `/t/${p.team}/` }),
  Teams: (p) => Link({ ...p, url: `/teams/` }),
  TermsOfService: (p) => Link({ ...p, url: "/terms-of-service/" }),
};

export { library as LinkLibrary };
