import { LinkLibrary } from "@thunderstore/cyberstorm";
import React from "react";

interface CyberstormLinkProps {
  children?: React.ReactNode;
}

interface LinkProps extends CyberstormLinkProps {
  queryParams?: string;
  url: string;
}

const Link = (props: LinkProps): React.ReactElement => {
  const { children, queryParams, url } = props;
  const q = queryParams ? `?${queryParams}` : "";

  return <a href={`${url}${q}`}>{children}</a>;
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Communities: (p) => Link({ ...p, url: "/communities/" }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) => Link({ ...p, url: "/" }),
  Package: (p) =>
    Link({ ...p, url: `/c/${p.community}/p/${p.namespace}/${p.package}/` }),
  PackageDependants: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/dependants/`,
    }),
  PackageUpload: (p) => Link({ ...p, url: "/packages/new/" }),
  Team: (p) => Link({ ...p, url: `/team/${p.team}/` }),
};

export { library as LinkLibrary };
