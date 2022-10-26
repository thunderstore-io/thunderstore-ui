import { LinkLibrary, ThunderstoreLinkProps } from "@thunderstore/components";

interface LinkProps extends ThunderstoreLinkProps {
  url: string;
}

const Link = (props: LinkProps): React.ReactElement => {
  const { url, children } = props;

  // Render links as spans so clicking them does nothing.
  return <a href={url}>{children}</a>;
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Communities: (p) => Link({ ...p, url: "/communities/" }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) => Link({ ...p, url: "/" }),
  Package: (p) =>
    Link({ ...p, url: `/c/${p.community}/p/${p.namespace}/${p.package}/` }),
  PackageUpload: (p) => Link({ ...p, url: "/packages/new/" }),
  PackageDependants: (p) =>
    Link({
      ...p,
      url: `/c/${p.community}/p/${p.namespace}/${p.package}/dependants/`,
    }),
  Team: (p) => Link({ ...p, url: `/team/${p.team}/` }),
};

export { library as LinkLibrary };
